// /rider/earnings must return real breakdowns derived from completed-delivery
// Earning records — hourly buckets for today and daily buckets for the last 7 days
// — not hardcoded sample data. Date is pinned so the windows are deterministic.
jest.mock("../config/db", () => ({
  __esModule: true,
  default: {
    rider: { findUnique: jest.fn() },
    earning: { findMany: jest.fn() },
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
import riderRouter from "../routes/rider";
import { generateToken } from "../utils/jwt";

const mockPrisma = prisma as unknown as {
  rider: { findUnique: jest.Mock };
  earning: { findMany: jest.Mock };
};

const RIDER_ID = 11;
const token = generateToken({ id: RIDER_ID, role: "RIDER" });

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/rider", riderRouter);
  return app;
}

function getEarnings() {
  return request(makeApp())
    .get("/rider/earnings")
    .set("Authorization", `Bearer ${token}`);
}

describe("GET /rider/earnings breakdowns from real earnings", () => {
  // Pin now: 15 Jun 2026 12:00. weekStart = 09 Jun (today minus 6 days).
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

  const earnings = [
    { amount: 12.5, date: new Date(2026, 5, 15, 9, 30) },  // today, 09:xx
    { amount: 6.25, date: new Date(2026, 5, 15, 9, 45) },  // today, 09:xx
    { amount: 15.0, date: new Date(2026, 5, 15, 12, 10) }, // today, 12:xx
    { amount: 20.0, date: new Date(2026, 5, 14, 18, 0) },  // yesterday
    { amount: 8.0, date: new Date(2026, 5, 11, 10, 0) },   // 4 days ago (in week)
    { amount: 99.0, date: new Date(2026, 5, 7, 13, 0) },   // 8 days ago (out of week)
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.rider.findUnique.mockResolvedValue({ approvalStatus: "APPROVED" });
    // Endpoint fetches the 7-day window once: return records on/after where.date.gte.
    mockPrisma.earning.findMany.mockImplementation((args: any = {}) => {
      const gte = args?.where?.date?.gte;
      const res = gte ? earnings.filter((e) => e.date >= gte) : earnings;
      return Promise.resolve(res.map((e) => ({ amount: e.amount, date: e.date })));
    });
  });

  it("summary totals reflect today and the last 7 days (8-days-ago excluded)", async () => {
    const res = await getEarnings();

    expect(res.status).toBe(200);
    expect(res.body.earnings.today).toBe(33.75);   // 12.5 + 6.25 + 15
    expect(res.body.earnings.thisWeek).toBe(61.75); // 33.75 + 20 + 8
  });

  it("todayBreakdown groups completed earnings into hourly buckets", async () => {
    const res = await getEarnings();

    expect(res.body.todayBreakdown).toEqual([
      { hour: 9, label: "09:00 - 10:00", orders: 2, earnings: 18.75 },
      { hour: 12, label: "12:00 - 13:00", orders: 1, earnings: 15 },
    ]);
  });

  it("weekBreakdown has 7 daily buckets with orders, earnings and avg/order", async () => {
    const res = await getEarnings();

    const week = res.body.weekBreakdown;
    expect(week).toHaveLength(7);

    // index 6 = today (15 Jun): 3 orders, £33.75, avg £11.25
    expect(week[6]).toMatchObject({ orders: 3, earnings: 33.75, avgPerOrder: 11.25 });
    // index 5 = 14 Jun: 1 order, £20
    expect(week[5]).toMatchObject({ orders: 1, earnings: 20, avgPerOrder: 20 });
    // index 2 = 11 Jun: 1 order, £8
    expect(week[2]).toMatchObject({ orders: 1, earnings: 8, avgPerOrder: 8 });
    // a quiet day, e.g. index 0 = 09 Jun
    expect(week[0]).toMatchObject({ orders: 0, earnings: 0, avgPerOrder: 0 });
    // each bucket carries a human day label
    expect(typeof week[6].day).toBe("string");
    expect(week[6].day.length).toBeGreaterThan(0);
  });
});
