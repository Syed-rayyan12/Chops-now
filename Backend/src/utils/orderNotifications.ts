import prisma from "../config/db";
import { logger } from "./logger";

/**
 * Runs the "order is now live" side effects: notify the restaurant and email the
 * customer their confirmation. Called immediately for CASH orders, and from the
 * Stripe webhook for CARD orders *after* paymentStatus becomes PAID — so neither
 * the restaurant nor the customer is told about a card order that was never paid.
 * Best-effort: failures are logged, never thrown, so they can't break the caller.
 */
export async function notifyOrderPlaced(orderId: number): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      restaurant: { select: { id: true, name: true } },
      customer: { select: { id: true, email: true, firstName: true, lastName: true } },
    },
  });

  if (!order) {
    logger.error(`notifyOrderPlaced: order ${orderId} not found`);
    return;
  }

  const customerName = `${order.customer?.firstName ?? ""} ${order.customer?.lastName ?? ""}`.trim();

  // Notify the restaurant about the new order
  try {
    await prisma.notification.create({
      data: {
        type: "ORDER_STATUS",
        title: "New Order Received",
        message: `New order #${order.code} from ${customerName}`,
        recipientRole: "RESTAURANT",
        recipientId: order.restaurantId,
        isRead: false,
        metadata: JSON.stringify({
          orderId: order.id,
          orderCode: order.code,
          customerId: order.customerId,
          customerName,
          amount: Number(order.amount),
          items: order.items.length,
        }),
      },
    });
  } catch (err) {
    logger.error("notifyOrderPlaced: failed to create restaurant notification:", err);
  }

  // Send the order confirmation email to the customer
  try {
    if (order.customer?.email) {
      const { sendOrderConfirmationEmail } = await import("../config/email.config");
      await sendOrderConfirmationEmail({
        customerEmail: order.customer.email,
        customerName,
        orderCode: order.code,
        restaurantName: order.restaurant?.name ?? "",
        items: order.items.map((item) => ({
          title: item.title,
          qty: item.qty,
          unitPrice: Number(item.unitPrice),
        })),
        subtotal: Number(order.subTotal),
        serviceFee: Number(order.serviceFee),
        deliveryFee: Number(order.deliveryFee),
        total: Number(order.amount),
        deliveryAddress: order.deliveryAddress ?? "",
      });
      logger.debug("✅ Order confirmation email sent");
    }
  } catch (emailError) {
    logger.error("notifyOrderPlaced: failed to send confirmation email:", emailError);
  }
}
