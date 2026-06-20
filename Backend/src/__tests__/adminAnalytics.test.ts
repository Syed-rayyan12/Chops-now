// Analytics "revenue" must count live money only: cash/non-card orders always,
// but CARD orders only once Stripe confirms payment (paymentStatus = PAID).
// Unpaid/failed CARD attempts are created as PENDING/FAILED and are intentionally
// hidden elsewhere via PAID_OR_NON_CARD — they must not inflate revenue here.
// totalOrders is deliberately NOT filtered: it counts all created order records.
jest.mock("../config/db", () => ({
  __esModule: true,
  default: {
    order: { findMany: jest.fn(), count: jest.fn() },
    user: { count: jest.fn(), findUnique: jest.fn() },
    earning: { aggregate: jest.fn() },
  },
}));

import express from "express";
import request from "supertest";
import prisma from "../config/db";
import adminRouter from "../routes/admin";
import { generateToken } from "../utils/jwt";

const mockPrisma = prisma as unknown as {
  order: { findMany: jest.Mock; count: jest.Mock };
  user: { count: jest.Mock; findUnique: jest.Mock };
  earning: { aggregate: jest.Mock };
};

const adminToken = generateToken({ id: 1, role: "ADMIN" });

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/admin", adminRouter);
  return app;
}

function getAnalytics() {
  return request(makeApp())
    .get("/admin/analytics")
    .set("Authorization", `Bearer ${adminToken}`);
}

describe("GET /admin/analytics revenue excludes unpaid card orders", () => {
  const now = new Date();

  // 2 live orders (cash + paid card) = £30 of real revenue; 2 dead card attempts
  // (pending + failed) that must be excluded. All in the current month.
  const orders = [
    { amount: 10, paymentMethod: "CASH", paymentStatus: "PENDING", status: "DELIVERED", deliveryFee: 2, createdAt: now },
    { amount: 20, paymentMethod: "CARD", paymentStatus: "PAID", status: "DELIVERED", deliveryFee: 3, createdAt: now },
    { amount: 100, paymentMethod: "CARD", paymentStatus: "PENDING", status: "PENDING", deliveryFee: 5, createdAt: now },
    { amount: 50, paymentMethod: "CARD", paymentStatus: "FAILED", status: "PENDING", deliveryFee: 0, createdAt: now },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Admin auth middleware re-checks the role from the DB.
    mockPrisma.user.findUnique.mockResolvedValue({ role: "ADMIN" });
    mockPrisma.user.count.mockResolvedValue(0);
    mockPrisma.earning.aggregate.mockResolvedValue({ _sum: { amount: 0 } });

    // totalOrders counts ALL order records; last-month window has none here.
    mockPrisma.order.count.mockImplementation((args?: any) =>
      Promise.resolve(args?.where?.createdAt ? 0 : orders.length)
    );

    // Faithfully simulate the filters the endpoint passes: createdAt range, status,
    // and the PAID_OR_NON_CARD `OR` clause (cash OR paid card).
    mockPrisma.order.findMany.mockImplementation((args: any = {}) => {
      const where = args.where || {};
      let result = orders;
      if (where.createdAt) {
        result = result.filter(
          (o) => o.createdAt >= where.createdAt.gte && o.createdAt < where.createdAt.lt
        );
      }
      if (where.status) {
        result = result.filter((o) => o.status === where.status);
      }
      if (where.OR) {
        result = result.filter(
          (o) => o.paymentMethod !== "CARD" || o.paymentStatus === "PAID"
        );
      }
      return Promise.resolve(result);
    });
  });

  it("totalRevenue counts only cash + paid-card orders", async () => {
    const res = await getAnalytics();

    expect(res.status).toBe(200);
    expect(res.body.stats.totalRevenue).toBe(30);
  });

  it("totalOrders still counts every created order (unfiltered)", async () => {
    const res = await getAnalytics();

    expect(res.body.stats.totalOrders).toBe(orders.length);
  });

  it("monthly revenue and order count exclude unpaid/failed card orders", async () => {
    const res = await getAnalytics();

    // The last bucket is the current month (loop pushes i=11..0).
    const currentMonth = res.body.revenueData[res.body.revenueData.length - 1];
    expect(currentMonth.revenue).toBe(30);
    expect(currentMonth.orders).toBe(2);
  });
});
