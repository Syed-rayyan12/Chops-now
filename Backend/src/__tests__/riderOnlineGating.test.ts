// Approved-but-offline riders must not be able to discover or claim NEW work.
// Online gating applies to the "find/accept available orders" endpoints, but NOT
// to active/completed/deliver — a rider who went offline must still be able to
// finish an order they already accepted.
jest.mock("../config/db", () => ({
  __esModule: true,
  default: {
    rider: { findUnique: jest.fn() },
    order: { findMany: jest.fn(), findUnique: jest.fn(), updateMany: jest.fn() },
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
  order: { findMany: jest.Mock; findUnique: jest.Mock; updateMany: jest.Mock };
};

const RIDER_ID = 7;
const riderToken = generateToken({ id: RIDER_ID, role: "RIDER" });

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/rider", riderRouter);
  return app;
}

function authedGet(path: string) {
  return request(makeApp()).get(path).set("Authorization", `Bearer ${riderToken}`);
}
function authedPatch(path: string) {
  return request(makeApp()).patch(path).set("Authorization", `Bearer ${riderToken}`);
}

describe("rider online gate on new-work endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.order.findMany.mockResolvedValue([]);
    mockPrisma.order.updateMany.mockResolvedValue({ count: 1 });
  });

  describe("offline approved rider is blocked from new work", () => {
    beforeEach(() => {
      mockPrisma.rider.findUnique.mockResolvedValue({
        approvalStatus: "APPROVED",
        isOnline: false,
        latitude: 51.5,
        longitude: -0.12,
      });
    });

    it("blocks GET /orders/available with 403 and never queries orders", async () => {
      const res = await authedGet("/rider/orders/available");

      expect(res.status).toBe(403);
      expect(res.body.offline).toBe(true);
      expect(mockPrisma.order.findMany).not.toHaveBeenCalled();
    });

    it("blocks GET /nearby-orders with 403", async () => {
      const res = await authedGet("/rider/nearby-orders");

      expect(res.status).toBe(403);
      expect(res.body.offline).toBe(true);
    });

    it("blocks PATCH /orders/:id/accept with 403 and never claims the order", async () => {
      const res = await authedPatch("/rider/orders/12/accept");

      expect(res.status).toBe(403);
      expect(res.body.offline).toBe(true);
      expect(mockPrisma.order.updateMany).not.toHaveBeenCalled();
    });
  });

  describe("online approved rider reaches new-work endpoints", () => {
    beforeEach(() => {
      mockPrisma.rider.findUnique.mockResolvedValue({
        approvalStatus: "APPROVED",
        isOnline: true,
        latitude: 51.5,
        longitude: -0.12,
      });
    });

    it("allows GET /orders/available through to the query", async () => {
      const res = await authedGet("/rider/orders/available");

      expect(res.status).toBe(200);
      expect(mockPrisma.order.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("offline rider can still work already-accepted orders", () => {
    beforeEach(() => {
      mockPrisma.rider.findUnique.mockResolvedValue({
        approvalStatus: "APPROVED",
        isOnline: false,
      });
    });

    it("does NOT block GET /orders/active", async () => {
      const res = await authedGet("/rider/orders/active");

      expect(res.status).toBe(200);
      expect(mockPrisma.order.findMany).toHaveBeenCalledTimes(1);
    });

    it("does NOT block GET /orders/completed", async () => {
      const res = await authedGet("/rider/orders/completed");

      expect(res.status).toBe(200);
    });

    it("does NOT block PATCH /orders/:id/deliver with the online gate", async () => {
      // Order missing -> 404 from the handler. The point is we reached the
      // handler (not a 403 online gate) while offline.
      mockPrisma.order.findUnique.mockResolvedValue(null);

      const res = await authedPatch("/rider/orders/12/deliver");

      expect(res.status).toBe(404);
    });
  });
});
