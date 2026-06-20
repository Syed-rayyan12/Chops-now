// Month-over-month delta formatting shared by the admin dashboard endpoints
// (/admin/stats and /admin/analytics).
//
// Each KPI's headline number is a lifetime total; the "change" string compares
// THIS month's figure against LAST month's — not lifetime-vs-last-month, which
// would massively overstate the change.

/**
 * Human-readable month-over-month change.
 *
 * - current === previous:    "No change"       — identical figures (incl. 0 vs 0);
 *                            avoids rendering a flat month as a green "+0.0%".
 * - previous > 0:            "+12.5% from last month" / "-3.2% from last month"
 * - previous 0, current > 0: "New this month"  — there was nothing last month, so
 *                            a percentage is undefined; reporting "+0.0%" would be
 *                            misleading, so we flag it as genuinely new activity.
 */
export function pctChangeLabel(current: number, previous: number): string {
  if (current === previous) return "No change";
  if (previous > 0) {
    const pct = ((current - previous) / previous) * 100;
    return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}% from last month`;
  }
  return "New this month";
}

/**
 * Start-of-month boundaries for "this month" and "last month", derived from a
 * reference date (defaults to now). Extracted so callers share one definition and
 * tests can pin the reference date.
 */
export function monthWindows(now: Date = new Date()) {
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  // Last month ends where this month begins (exclusive upper bound).
  const lastMonthEnd = monthStart;
  return { monthStart, lastMonthStart, lastMonthEnd };
}
