// The dashboard-overview Revenue KPI (/admin/stats) must count live money only,
// same rule as /admin/analytics: cash/non-card orders plus Stripe-confirmed card
// orders (PAID_OR_NON_CARD). Unpaid/failed card attempts (PENDING/FAILED) must not
// inflate revenue. totalOrders stays an all-records count.
jest.mock("../config/db", () => ({
  __esModule: true,
  default: {
    order: { findMany: jest.fn(), count: jest.fn() },
    restaurant: { count: jest.fn() },
    user: { count: jest.fn(), findUnique: jest.fn() },
  },
}));

import express from "express";
import request from "supertest";
import prisma from "../config/db";
import adminRouter from "../routes/admin";
import { generateToken } from "../utils/jwt";

const mockPrisma = prisma as unknown as {
  order: { findMany: jest.Mock; count: jest.Mock };
  restaurant: { count: jest.Mock };
  user: { count: jest.Mock; findUnique: jest.Mock };
};

const adminToken = generateToken({ id: 1, role: "ADMIN" });

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/admin", adminRouter);
  return app;
}

function getStats() {
  return request(makeApp())
    .get("/admin/stats")
    .set("Authorization", `Bearer ${adminToken}`);
}

describe("GET /admin/stats overview revenue excludes unpaid card orders", () => {
  // 2 live orders (cash £10 + paid card £20) = £30; 2 dead card attempts excluded.
  const orders = [
    { amount: 10, paymentMethod: "CASH", paymentStatus: "PENDING" },
    { amount: 20, paymentMethod: "CARD", paymentStatus: "PAID" },
    { amount: 100, paymentMethod: "CARD", paymentStatus: "PENDING" },
    { amount: 50, paymentMethod: "CARD", paymentStatus: "FAILED" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.user.findUnique.mockResolvedValue({ role: "ADMIN" });
    mockPrisma.restaurant.count.mockResolvedValue(0);
    mockPrisma.user.count.mockResolvedValue(0);
    mockPrisma.order.count.mockResolvedValue(orders.length);

    // Apply the PAID_OR_NON_CARD `OR` clause when the endpoint passes it.
    mockPrisma.order.findMany.mockImplementation((args: any = {}) => {
      const where = args.where || {};
      let result = orders;
      if (where.OR) {
        result = result.filter(
          (o) => o.paymentMethod !== "CARD" || o.paymentStatus === "PAID"
        );
      }
      return Promise.resolve(result);
    });
  });

  it("totalRevenue counts only cash + paid-card orders", async () => {
    const res = await getStats();

    expect(res.status).toBe(200);
    expect(res.body.totalRevenue).toBe(30);
  });

  it("totalOrders still counts every created order (unfiltered)", async () => {
    const res = await getStats();

    expect(res.body.totalOrders).toBe(orders.length);
  });
});
