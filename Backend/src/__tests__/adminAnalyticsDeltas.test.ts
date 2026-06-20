// Month-over-month deltas in /admin/analytics must compare THIS month vs LAST
// month (not lifetime vs last month), and the revenue delta must exclude unpaid/
// failed CARD attempts. Date is pinned with fake timers so the month windows are
// deterministic; prisma is mocked to honor the createdAt / status / OR filters.
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

function inWindow(d: Date, where: any): boolean {
  const c = where?.createdAt;
  if (!c) return true;
  return (!c.gte || d >= c.gte) && (!c.lt || d < c.lt);
}

describe("GET /admin/analytics month-over-month deltas", () => {
  // Pinned "now": 15 Jun 2026 → this month = June, last month = May.
  beforeAll(() => {
    jest.useFakeTimers({
      // Fake only Date; leave timers real so supertest's HTTP round-trip works.
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

  // This month (June): live cash £100 + paid card £50 = £150 revenue, plus an
  // unpaid card £999 that must NOT count toward revenue. 3 order records total.
  // Last month (May): live cash £40, plus a failed card £500 (excluded). 2 records.
  const orders = [
    { amount: 100, paymentMethod: "CASH", paymentStatus: "PENDING", status: "DELIVERED", deliveryFee: 0, createdAt: new Date(2026, 5, 10) },
    { amount: 50, paymentMethod: "CARD", paymentStatus: "PAID", status: "DELIVERED", deliveryFee: 0, createdAt: new Date(2026, 5, 12) },
    { amount: 999, paymentMethod: "CARD", paymentStatus: "PENDING", status: "PENDING", deliveryFee: 0, createdAt: new Date(2026, 5, 11) },
    { amount: 40, paymentMethod: "CASH", paymentStatus: "PENDING", status: "DELIVERED", deliveryFee: 0, createdAt: new Date(2026, 4, 10) },
    { amount: 500, paymentMethod: "CARD", paymentStatus: "FAILED", status: "PENDING", deliveryFee: 0, createdAt: new Date(2026, 4, 12) },
  ];

  // Users: 5 registered this month, 2 last month, 3 older.
  const users = [
    ...Array(5).fill(new Date(2026, 5, 3)),
    ...Array(2).fill(new Date(2026, 4, 3)),
    ...Array(3).fill(new Date(2025, 0, 1)),
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.user.findUnique.mockResolvedValue({ role: "ADMIN" });
    mockPrisma.earning.aggregate.mockResolvedValue({ _sum: { amount: 0 } });

    mockPrisma.order.findMany.mockImplementation((args: any = {}) => {
      const where = args.where || {};
      let result = orders.filter((o) => inWindow(o.createdAt, where));
      if (where.status) result = result.filter((o) => o.status === where.status);
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
  });

  it("revenue delta compares this month vs last month and excludes unpaid/failed card orders", async () => {
    const res = await getAnalytics();

    expect(res.status).toBe(200);
    // This month live revenue £150 vs last month £40 → +275.0%. If the £999/£500
    // card attempts leaked in, this number would be completely different, so this
    // assertion also proves the delta excludes them.
    expect(res.body.stats.revenueChange).toBe("+275.0% from last month");
  });

  it("orders delta compares this month vs last month (all records)", async () => {
    const res = await getAnalytics();

    // 3 records this month vs 2 last month → +50.0%.
    expect(res.body.stats.ordersChange).toBe("+50.0% from last month");
  });

  it("users delta compares new users this month vs last month", async () => {
    const res = await getAnalytics();

    // 5 new this month vs 2 last month → +150.0%.
    expect(res.body.stats.usersChange).toBe("+150.0% from last month");
  });
});
