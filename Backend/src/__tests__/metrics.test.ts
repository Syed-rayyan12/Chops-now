import { pctChangeLabel, monthWindows } from "../utils/metrics";

describe("pctChangeLabel — month-over-month formatting", () => {
  it("formats a positive change with a + sign and 1 dp", () => {
    expect(pctChangeLabel(150, 100)).toBe("+50.0% from last month");
  });

  it("formats a negative change", () => {
    expect(pctChangeLabel(80, 100)).toBe("-20.0% from last month");
  });

  it("reports 'No change' when this month equals last month (nonzero, flat)", () => {
    // A flat month must read neutral, not a green "+0.0%".
    expect(pctChangeLabel(100, 100)).toBe("No change");
  });

  it("reports 'New this month' when last month was zero but this month has activity", () => {
    // The fix: a zero baseline with current activity must NOT read as "+0.0%".
    expect(pctChangeLabel(25, 0)).toBe("New this month");
  });

  it("reports 'No change' when both months are zero", () => {
    expect(pctChangeLabel(0, 0)).toBe("No change");
  });

  it("never returns a misleading 0.0% for a zero baseline with activity", () => {
    expect(pctChangeLabel(500, 0)).not.toContain("0.0%");
  });
});

describe("monthWindows", () => {
  it("derives this-month and last-month boundaries from the reference date", () => {
    const { monthStart, lastMonthStart, lastMonthEnd } = monthWindows(new Date(2026, 5, 15));
    expect(monthStart).toEqual(new Date(2026, 5, 1));
    expect(lastMonthStart).toEqual(new Date(2026, 4, 1));
    expect(lastMonthEnd).toEqual(new Date(2026, 5, 1)); // last month ends where this begins
  });

  it("rolls over the year for January", () => {
    const { lastMonthStart, lastMonthEnd } = monthWindows(new Date(2026, 0, 10));
    expect(lastMonthStart).toEqual(new Date(2025, 11, 1));
    expect(lastMonthEnd).toEqual(new Date(2026, 0, 1));
  });
});
