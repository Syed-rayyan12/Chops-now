// Restaurant earnings windows (today/week/month) must be keyed on deliveredAt, not
// createdAt, so they line up with the transactions list (which sorts by deliveredAt)
// and with when the restaurant is actually paid. An order created in one period but
// delivered in another belongs to the period it was delivered.
jest.mock("../config/db", () => ({
  __esModule: true,
  default: {
    restaurant: { findFirst: jest.fn() },
    order: { findMany: jest.fn() },
  },
}));
jest.mock("../config/r2", () => ({
  __esModule: true,
  uploadToR2: jest.fn(),
  deleteFromR2: jest.fn(),
  r2Client: {},
}));

import express from "express";
import request from "supertest";
import prisma from "../config/db";
import restaurantRouter from "../routes/restaurant";
import { generateToken } from "../utils/jwt";

const mockPrisma = prisma as unknown as {
  restaurant: { findFirst: jest.Mock };
  order: { findMany: jest.Mock };
};

const RESTAURANT_ID = 2;
const token = generateToken({ id: RESTAURANT_ID, role: "RESTAURANT" });

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/restaurant", restaurantRouter);
  return app;
}

function getEarnings() {
  return request(makeApp())
    .get("/restaurant/my-cafe/earnings")
    .set("Authorization", `Bearer ${token}`);
}

describe("GET /restaurant/:slug/earnings uses deliveredAt windows", () => {
  // Pin now: 15 Jun 2026. today=15 Jun, weekStart=8 Jun, monthStart=1 Jun.
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

  // A: created last month, DELIVERED today  → counts toward today/week/month.
  // B: created today, DELIVERED earlier this month (before this week) → month only.
  const orders = [
    { restaurantPayout: 10, createdAt: new Date(2026, 4, 1), deliveredAt: new Date(2026, 5, 15, 9, 0) },
    { restaurantPayout: 20, createdAt: new Date(2026, 5, 15), deliveredAt: new Date(2026, 5, 5) },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.restaurant.findFirst.mockResolvedValue({ id: RESTAURANT_ID });

    // Apply whichever date filter the endpoint passes (createdAt under the old
    // behavior, deliveredAt under the fixed behavior) so the test distinguishes them.
    mockPrisma.order.findMany.mockImplementation((args: any = {}) => {
      const where = args.where || {};
      let res = orders;
      if (where.createdAt?.gte) res = res.filter((o) => o.createdAt >= where.createdAt.gte);
      if (where.deliveredAt?.gte) res = res.filter((o) => o.deliveredAt >= where.deliveredAt.gte);
      return Promise.resolve(res.map((o) => ({ restaurantPayout: o.restaurantPayout })));
    });
  });

  it("today's earnings count orders delivered today regardless of when created", async () => {
    const res = await getEarnings();

    expect(res.status).toBe(200);
    // Only A was delivered today (B was created today but delivered 5 Jun).
    expect(res.body.earnings.today).toBe(10);
  });

  it("weekly earnings count orders delivered within the last 7 days", async () => {
    const res = await getEarnings();
    // A delivered 15 Jun (in window); B delivered 5 Jun (before 8 Jun) → excluded.
    expect(res.body.earnings.weekly).toBe(10);
  });

  it("monthly earnings count all orders delivered this month", async () => {
    const res = await getEarnings();
    // Both A (15 Jun) and B (5 Jun) delivered this month.
    expect(res.body.earnings.monthly).toBe(30);
  });
});
