// Toggling online status must also maintain RiderOnlineSession rows so admin
// reporting reflects real online time. Going online opens a session (idempotently);
// going offline closes any open session. All in one transaction so the isOnline
// flag and the session record can't drift apart.
jest.mock("../config/db", () => {
  const tx = {
    rider: { update: jest.fn() },
    riderOnlineSession: {
      findFirst: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
    },
  };
  return {
    __esModule: true,
    default: {
      rider: { findUnique: jest.fn() },
      $transaction: jest.fn(async (cb: any) => cb(tx)),
      __tx: tx,
    },
  };
});
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
  $transaction: jest.Mock;
  __tx: {
    rider: { update: jest.Mock };
    riderOnlineSession: {
      findFirst: jest.Mock;
      create: jest.Mock;
      updateMany: jest.Mock;
    };
  };
};

const RIDER_ID = 9;
const riderToken = generateToken({ id: RIDER_ID, role: "RIDER" });

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/rider", riderRouter);
  return app;
}

function toggle(isOnline: boolean) {
  return request(makeApp())
    .patch("/rider/toggle-online")
    .set("Authorization", `Bearer ${riderToken}`)
    .send({ isOnline });
}

describe("PATCH /rider/toggle-online session tracking", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // re-arm $transaction since clearAllMocks resets the implementation
    mockPrisma.$transaction.mockImplementation(async (cb: any) => cb(mockPrisma.__tx));
    mockPrisma.rider.findUnique.mockResolvedValue({ approvalStatus: "APPROVED" });
    mockPrisma.__tx.rider.update.mockResolvedValue({
      id: RIDER_ID,
      firstName: "Sam",
      lastName: "Rider",
      email: "sam@example.com",
      isOnline: true,
    });
  });

  it("opens a session when going online and none is open", async () => {
    mockPrisma.__tx.riderOnlineSession.findFirst.mockResolvedValue(null);

    const res = await toggle(true);

    expect(res.status).toBe(200);
    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
    expect(mockPrisma.__tx.rider.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ isOnline: true }) })
    );
    expect(mockPrisma.__tx.riderOnlineSession.create).toHaveBeenCalledWith({
      data: { riderId: RIDER_ID },
    });
  });

  it("does NOT open a second session when one is already open", async () => {
    mockPrisma.__tx.riderOnlineSession.findFirst.mockResolvedValue({
      id: 1,
      riderId: RIDER_ID,
      endedAt: null,
    });

    const res = await toggle(true);

    expect(res.status).toBe(200);
    expect(mockPrisma.__tx.riderOnlineSession.create).not.toHaveBeenCalled();
  });

  it("closes open sessions when going offline", async () => {
    mockPrisma.__tx.rider.update.mockResolvedValue({
      id: RIDER_ID,
      firstName: "Sam",
      lastName: "Rider",
      email: "sam@example.com",
      isOnline: false,
    });

    const res = await toggle(false);

    expect(res.status).toBe(200);
    expect(mockPrisma.__tx.rider.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ isOnline: false }) })
    );
    expect(mockPrisma.__tx.riderOnlineSession.updateMany).toHaveBeenCalledWith({
      where: { riderId: RIDER_ID, endedAt: null },
      data: { endedAt: expect.any(Date) },
    });
    // Going offline must not open a new session.
    expect(mockPrisma.__tx.riderOnlineSession.create).not.toHaveBeenCalled();
  });

  it("rejects a non-boolean isOnline with 400 and does no writes", async () => {
    const res = await request(makeApp())
      .patch("/rider/toggle-online")
      .set("Authorization", `Bearer ${riderToken}`)
      .send({ isOnline: "yes" });

    expect(res.status).toBe(400);
    expect(mockPrisma.$transaction).not.toHaveBeenCalled();
  });
});
