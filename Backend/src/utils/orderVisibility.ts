import { Prisma } from "@prisma/client";

/**
 * An order is visible/actionable to restaurants and riders only when it is NOT
 * an unpaid card order. Cash orders are always visible; card orders appear only
 * once Stripe has confirmed payment (paymentStatus = PAID). This prevents a
 * customer from creating a CARD order that restaurants/riders can act on before
 * payment is verified.
 */
export const PAID_OR_NON_CARD: Prisma.OrderWhereInput = {
  OR: [{ paymentMethod: { not: "CARD" } }, { paymentStatus: "PAID" }],
};

/** True when an order may be shown to / acted on by restaurants and riders. */
export function isOrderActionable(order: {
  paymentMethod: string;
  paymentStatus: string;
}): boolean {
  return order.paymentMethod !== "CARD" || order.paymentStatus === "PAID";
}
