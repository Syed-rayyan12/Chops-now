// /payment-status/:id must only disclose a PaymentIntent's status to the user
// who owns it — verified via the userId/orderId we stamped into PI metadata.
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
    order: { findUnique: jest.fn() },
  },
}));

import express from "express";
import request from "supertest";
import stripe from "../config/stripe";
import prisma from "../config/db";
import paymentRouter from "../routes/payment";
import { generateToken } from "../utils/jwt";

const mockStripe = stripe as unknown as {
  paymentIntents: { retrieve: jest.Mock };
};
const mockPrisma = prisma as unknown as {
  order: { findUnique: jest.Mock };
};

const OWNER_ID = 7;
const ownerToken = generateToken({ id: OWNER_ID, role: "USER" });

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/payment", paymentRouter);
  return app;
}

function getStatus(piId: string) {
  return request(makeApp())
    .get(`/payment/payment-status/${piId}`)
    .set("Authorization", `Bearer ${ownerToken}`);
}

describe("GET /payment/payment-status/:paymentIntentId ownership", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns status when metadata.userId matches the caller", async () => {
    mockStripe.paymentIntents.retrieve.mockResolvedValue({
      status: "succeeded",
      amount: 1500,
      currency: "gbp",
      metadata: { userId: String(OWNER_ID), orderId: "42" },
    });

    const res = await getStatus("pi_owned");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("succeeded");
    expect(res.body.amount).toBe(15);
  });

  it("returns 404 when the PaymentIntent belongs to another user", async () => {
    mockStripe.paymentIntents.retrieve.mockResolvedValue({
      status: "succeeded",
      amount: 1500,
      currency: "gbp",
      metadata: { userId: "999", orderId: "42" },
    });
    // Fallback order lookup also resolves to a different customer.
    mockPrisma.order.findUnique.mockResolvedValue({ customerId: 999 });

    const res = await getStatus("pi_foreign");

    expect(res.status).toBe(404);
    expect(res.body.status).toBeUndefined();
  });

  it("falls back to the linked order's customerId when metadata.userId is absent", async () => {
    mockStripe.paymentIntents.retrieve.mockResolvedValue({
      status: "processing",
      amount: 2000,
      currency: "gbp",
      metadata: { orderId: "55" },
    });
    mockPrisma.order.findUnique.mockResolvedValue({ customerId: OWNER_ID });

    const res = await getStatus("pi_byorder");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("processing");
  });
});
