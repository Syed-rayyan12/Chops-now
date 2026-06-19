import { isOrderActionable, PAID_OR_NON_CARD } from "../utils/orderVisibility";

describe("order visibility / actionability gate", () => {
  it("a card order is NOT actionable until Stripe confirms payment", () => {
    expect(isOrderActionable({ paymentMethod: "CARD", paymentStatus: "PENDING" })).toBe(false);
    expect(isOrderActionable({ paymentMethod: "CARD", paymentStatus: "FAILED" })).toBe(false);
  });

  it("a card order becomes actionable once paid", () => {
    expect(isOrderActionable({ paymentMethod: "CARD", paymentStatus: "PAID" })).toBe(true);
  });

  it("cash orders are always actionable regardless of payment status", () => {
    expect(isOrderActionable({ paymentMethod: "CASH", paymentStatus: "PENDING" })).toBe(true);
    expect(isOrderActionable({ paymentMethod: "CASH", paymentStatus: "PAID" })).toBe(true);
  });

  it("the Prisma filter shows non-card OR paid orders", () => {
    expect(PAID_OR_NON_CARD).toEqual({
      OR: [{ paymentMethod: { not: "CARD" } }, { paymentStatus: "PAID" }],
    });
  });
});
