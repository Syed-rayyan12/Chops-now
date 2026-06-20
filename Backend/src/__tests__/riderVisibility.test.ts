// Rider lists exposed to restaurants must only show riders that can actually take
// work: admin-APPROVED, currently online, and with a known location. Otherwise a
// restaurant could try to hand an order to an offline or unapproved rider.
jest.mock("../config/db", () => ({
  __esModule: true,
  default: {
    rider: { findMany: jest.fn() },
    restaurant: { findFirst: jest.fn() },
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
import restaurantRouter from "../routes/restaurant";
import { generateToken } from "../utils/jwt";

const mockPrisma = prisma as unknown as {
  rider: { findMany: jest.Mock };
  restaurant: { findFirst: jest.Mock };
};

const RESTAURANT_ID = 3;
const restaurantToken = generateToken({ id: RESTAURANT_ID, role: "RESTAURANT" });

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/rider", riderRouter);
  app.use("/restaurant", restaurantRouter);
  return app;
}

describe("restaurant-visible rider lists", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /rider/all only queries approved, online, located riders", async () => {
    mockPrisma.rider.findMany.mockResolvedValue([]);

    const res = await request(makeApp())
      .get("/rider/all")
      .set("Authorization", `Bearer ${restaurantToken}`);

    expect(res.status).toBe(200);
    expect(mockPrisma.rider.findMany).toHaveBeenCalledTimes(1);
    const arg = mockPrisma.rider.findMany.mock.calls[0][0];
    expect(arg.where).toEqual({
      approvalStatus: "APPROVED",
      isOnline: true,
      latitude: { not: null },
      longitude: { not: null },
    });
  });

  it("GET /restaurant/:slug/nearby-riders filters to approved riders", async () => {
    mockPrisma.restaurant.findFirst.mockResolvedValue({
      id: RESTAURANT_ID,
      latitude: 51.5,
      longitude: -0.12,
    });
    mockPrisma.rider.findMany.mockResolvedValue([]);

    const res = await request(makeApp())
      .get("/restaurant/my-cafe/nearby-riders")
      .set("Authorization", `Bearer ${restaurantToken}`);

    expect(res.status).toBe(200);
    expect(mockPrisma.rider.findMany).toHaveBeenCalledTimes(1);
    const arg = mockPrisma.rider.findMany.mock.calls[0][0];
    expect(arg.where).toMatchObject({
      approvalStatus: "APPROVED",
      isOnline: true,
      latitude: { not: null },
      longitude: { not: null },
    });
  });
});
