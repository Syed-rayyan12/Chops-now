// The Stripe webhook is the ONLY place an order is marked paid — driven by the
// PaymentIntent metadata, never by the client.
jest.mock("../config/stripe", () => ({
  __esModule: true,
  default: {
    webhooks: { constructEvent: jest.fn() },
    paymentIntents: { create: jest.fn(), retrieve: jest.fn() },
  },
}));
jest.mock("../config/db", () => ({
  __esModule: true,
  default: {
    order: { update: jest.fn(), updateMany: jest.fn(), findUnique: jest.fn() },
    notification: { create: jest.fn() },
  },
}));

import express from "express";
import request from "supertest";
import stripe from "../config/stripe";
import prisma from "../config/db";
import paymentRouter from "../routes/payment";

const mockStripe = stripe as unknown as { webhooks: { constructEvent: jest.Mock } };
const mockPrisma = prisma as unknown as {
  order: { update: jest.Mock; updateMany: jest.Mock; findUnique: jest.Mock };
};

function appWithEvent(event: any) {
  mockStripe.webhooks.constructEvent.mockReturnValue(event);
  const app = express();
  app.use(express.json());
  app.use("/payment", paymentRouter);
  return app;
}

describe("POST /payment/webhook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.order.update.mockResolvedValue({});
    mockPrisma.order.updateMany.mockResolvedValue({ count: 1 });
    // notifyOrderPlaced looks the order up; returning null makes it a no-op here.
    mockPrisma.order.findUnique.mockResolvedValue(null);
  });

  it("marks the order PAID on payment_intent.succeeded using metadata.orderId", async () => {
    const app = appWithEvent({
      type: "payment_intent.succeeded",
      data: { object: { id: "pi_1", metadata: { orderId: "42" } } },
    });

    const res = await request(app)
      .post("/payment/webhook")
      .set("stripe-signature", "sig_test")
      .send({});

    expect(res.status).toBe(200);
    // Idempotent transition: only updates when not already paid.
    expect(mockPrisma.order.updateMany).toHaveBeenCalledWith({
      where: { id: 42, paymentStatus: { not: "PAID" } },
      data: { paymentStatus: "PAID" },
    });
  });

  it("marks the order FAILED on payment_intent.payment_failed", async () => {
    const app = appWithEvent({
      type: "payment_intent.payment_failed",
      data: { object: { id: "pi_2", metadata: { orderId: "43" } } },
    });

    const res = await request(app)
      .post("/payment/webhook")
      .set("stripe-signature", "sig_test")
      .send({});

    expect(res.status).toBe(200);
    expect(mockPrisma.order.update).toHaveBeenCalledWith({
      where: { id: 43 },
      data: { paymentStatus: "FAILED" },
    });
  });
});
