// Small client-side CSV exporter used by the admin management tables. Each column
// maps a human header to a value getter so callers can flatten/derive fields
// (e.g. nested objects, formatted numbers) without leaking raw shapes into output.

export interface CsvColumn<T> {
  header: string;
  value: (row: T) => string | number | null | undefined;
}

// RFC-4180-ish escaping: wrap in quotes and double any embedded quotes. We always
// quote so commas, newlines and leading +/-/=/@ (Excel formula injection) stay inert.
function escapeCell(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '""';
  const str = String(input);
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
 * Generate a CSV from the given rows and trigger a browser download. No-op on the
 * server. Filename gets a YYYY-MM-DD suffix and `.csv` extension automatically.
 */
export function exportToCSV<T>(
  filename: string,
  rows: T[],
  columns: CsvColumn<T>[]
): void {
  if (typeof window === "undefined") return;

  const csv = toCsv(rows, columns);
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
