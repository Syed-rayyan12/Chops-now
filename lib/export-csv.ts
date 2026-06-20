// Small client-side CSV exporter used by the admin management tables. Each column
// maps a human header to a value getter so callers can flatten/derive fields
// (e.g. nested objects, formatted numbers) without leaking raw shapes into output.

export interface CsvColumn<T> {
  header: string;
  value: (row: T) => string | number | null | undefined;
}

// Turn a value into a safe, quoted CSV field.
//
// 1. CSV injection: spreadsheets (Excel/Sheets) evaluate a cell as a formula when
//    its text begins with =, +, -, or @ — and they do so even for quoted CSV
//    values, so quoting alone does NOT neutralize it. We prefix such values with a
//    single apostrophe, which spreadsheets honor as "treat the cell as literal
//    text". The check allows optional leading whitespace because the apps ignore
//    it when sniffing for a formula. This is applied only to string inputs, so
//    genuine numeric columns keep negative values like -5 intact.
// 2. RFC-4180 quoting: every field is wrapped in double quotes with embedded
//    quotes doubled, so commas, quotes and newlines stay within a single field.
function escapeCell(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '""';
  let str = String(input);
  if (typeof input === "string" && /^\s*[=+\-@]/.test(str)) {
    str = "'" + str;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Build CSV text from rows + column definitions. Exposed separately so it can be
 * unit-tested without touching the DOM.
 */
export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((c) => escapeCell(c.header)).join(",");
  const body = rows.map((row) =>
    columns.map((c) => escapeCell(c.value(row))).join(",")
  );
  return [header, ...body].join("\r\n");
}

/**
 * Trigger a browser download of an already-built CSV string. No-op on the server.
 * Filename gets a YYYY-MM-DD suffix and `.csv` extension automatically. Use this
 * when a single file needs more than one table/section (e.g. a summary block above
 * a time series); otherwise prefer exportToCSV which builds the CSV for you.
 */
export function downloadCsvText(filename: string, csv: string): void {
  if (typeof window === "undefined") return;

  // Prepend a UTF-8 BOM so Excel renders accented characters correctly.
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().slice(0, 10);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${date}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Build a CSV from the given rows + columns and trigger a browser download.
 */
export function exportToCSV<T>(
  filename: string,
  rows: T[],
  columns: CsvColumn<T>[]
): void {
  downloadCsvText(filename, toCsv(rows, columns));
}
