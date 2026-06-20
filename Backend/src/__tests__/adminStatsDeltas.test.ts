// The dashboard-overview tab renders ordersChange/restaurantsChange/usersChange/
// revenueChange from /admin/stats. These are month-over-month (this month vs last),
// the revenue delta excludes unpaid/failed CARD attempts, and the orders delta uses
// all order records. Date is pinned so the month windows are deterministic.
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

function inWindow(d: Date, where: any): boolean {
  const c = where?.createdAt;
  if (!c) return true;
  return (!c.gte || d >= c.gte) && (!c.lt || d < c.lt);
}

describe("GET /admin/stats month-over-month deltas", () => {
  // Pinned "now": 15 Jun 2026 → this month = June, last month = May.
  beforeAll(() => {
    jest.useFakeTimers({
      doNotFake: [
        "nextTick", "setImmediate", "setTimeout", "clearTimeout", "setInterval",
        "clearInterval", "clearImmediate", "queueMicrotask", "requestAnimationFrame",
        "cancelAnimationFrame", "requestIdleCallback", "cancelIdleCallback",
        "hrtime", "performance",
      ],
    });
    jest.setSystemTime(new Date(2026, 5, 15, 12, 0, 0));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  // June: live cash £100 + paid card £50 = £150 (+ unpaid card £999 excluded) → 3 records.
  // May:  live cash £40 (+ failed card £500 excluded) → 2 records.
  const orders = [
    { amount: 100, paymentMethod: "CASH", paymentStatus: "PENDING", createdAt: new Date(2026, 5, 10) },
    { amount: 50, paymentMethod: "CARD", paymentStatus: "PAID", createdAt: new Date(2026, 5, 12) },
    { amount: 999, paymentMethod: "CARD", paymentStatus: "PENDING", createdAt: new Date(2026, 5, 11) },
    { amount: 40, paymentMethod: "CASH", paymentStatus: "PENDING", createdAt: new Date(2026, 4, 10) },
    { amount: 500, paymentMethod: "CARD", paymentStatus: "FAILED", createdAt: new Date(2026, 4, 12) },
  ];

  // Users: 5 this month, 2 last month, 3 older.
  const users = [
    ...Array(5).fill(new Date(2026, 5, 3)),
    ...Array(2).fill(new Date(2026, 4, 3)),
    ...Array(3).fill(new Date(2025, 0, 1)),
  ];

  // Restaurants (all non-deleted): 4 this month, 2 last month, 3 older.
  const restaurants = [
    ...Array(4).fill(new Date(2026, 5, 5)),
    ...Array(2).fill(new Date(2026, 4, 5)),
    ...Array(3).fill(new Date(2025, 0, 1)),
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.user.findUnique.mockResolvedValue({ role: "ADMIN" });

    mockPrisma.order.findMany.mockImplementation((args: any = {}) => {
      const where = args.where || {};
      let result = orders.filter((o) => inWindow(o.createdAt, where));
      if (where.OR) {
        result = result.filter((o) => o.paymentMethod !== "CARD" || o.paymentStatus === "PAID");
      }
      return Promise.resolve(result);
    });

    mockPrisma.order.count.mockImplementation((args: any = {}) =>
      Promise.resolve(orders.filter((o) => inWindow(o.createdAt, args.where || {})).length)
    );

    mockPrisma.user.count.mockImplementation((args: any = {}) =>
      Promise.resolve(users.filter((d) => inWindow(d, args.where || {})).length)
    );

    // All restaurants here are non-deleted, so deletedAt:null doesn't drop any.
    mockPrisma.restaurant.count.mockImplementation((args: any = {}) =>
      Promise.resolve(restaurants.filter((d) => inWindow(d, args.where || {})).length)
    );
  });

  it("revenueChange compares this vs last month and excludes unpaid/failed card orders", async () => {
    const res = await getStats();

    expect(res.status).toBe(200);
    // £150 vs £40 → +275.0% (would differ wildly if £999/£500 card attempts leaked in).
    expect(res.body.revenueChange).toBe("+275.0% from last month");
  });

  it("ordersChange compares this vs last month (all records)", async () => {
    const res = await getStats();
    // 3 records vs 2 → +50.0%.
    expect(res.body.ordersChange).toBe("+50.0% from last month");
  });

  it("usersChange compares new users this vs last month", async () => {
    const res = await getStats();
    // 5 vs 2 → +150.0%.
    expect(res.body.usersChange).toBe("+150.0% from last month");
  });

  it("restaurantsChange compares new restaurants this vs last month", async () => {
    const res = await getStats();
    // 4 vs 2 → +100.0%.
    expect(res.body.restaurantsChange).toBe("+100.0% from last month");
  });
});
