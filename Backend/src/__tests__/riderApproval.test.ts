// Operational rider endpoints must be gated on admin approval. This protects
// riders created via Google OAuth, which issues a RIDER token to a brand-new
// (PENDING) account — the token alone must not grant order access. Onboarding /
// self endpoints stay reachable so a pending rider can finish setup.
jest.mock("../config/db", () => ({
  __esModule: true,
  default: {
    rider: { findUnique: jest.fn() },
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
import riderRouter from "../routes/rider";
import { generateToken } from "../utils/jwt";

const mockPrisma = prisma as unknown as {
  rider: { findUnique: jest.Mock };
  order: { findMany: jest.Mock };
};

const RIDER_ID = 5;
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

describe("rider approval gate (covers OAuth-created riders)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.order.findMany.mockResolvedValue([]);
  });

  it("blocks a PENDING rider from an operational endpoint with 403", async () => {
    mockPrisma.rider.findUnique.mockResolvedValue({ approvalStatus: "PENDING" });

    const res = await authedGet("/rider/orders/available");

    expect(res.status).toBe(403);
    expect(res.body.pendingApproval).toBe(true);
    expect(res.body.approvalStatus).toBe("PENDING");
    // The endpoint's own query must never run for an unapproved rider.
    expect(mockPrisma.order.findMany).not.toHaveBeenCalled();
  });

  it("blocks a REJECTED rider with 403 and no pendingApproval flag", async () => {
    mockPrisma.rider.findUnique.mockResolvedValue({ approvalStatus: "REJECTED" });

    const res = await authedGet("/rider/orders/available");

    expect(res.status).toBe(403);
    expect(res.body.pendingApproval).toBe(false);
    expect(res.body.approvalStatus).toBe("REJECTED");
  });

  it("allows an APPROVED rider through to the endpoint", async () => {
    // isOnline:true so the rider also clears the online gate that /orders/available
    // now sits behind (the approval gate runs first; this test targets approval).
    mockPrisma.rider.findUnique.mockResolvedValue({ approvalStatus: "APPROVED", isOnline: true });

    const res = await authedGet("/rider/orders/available");

    expect(res.status).toBe(200);
    expect(res.body.orders).toEqual([]);
    expect(mockPrisma.order.findMany).toHaveBeenCalledTimes(1);
  });

  it("lets a PENDING rider reach an onboarding/self endpoint (/me)", async () => {
    // /me is intentionally NOT behind the approval gate so a pending rider can
    // view their status and complete onboarding.
    mockPrisma.rider.findUnique.mockResolvedValue({
      id: RIDER_ID,
      firstName: "Pat",
      lastName: "Rider",
      email: "pat@example.com",
      phone: "",
      address: null,
      vehicle: null,
      accountNumber: null,
      sortCode: null,
      idDocument: null,
      proofOfAddress: null,
      selfie: null,
      insurance: null,
      insuranceExpiryReminder: null,
      image: null,
      isOnline: false,
      createdAt: new Date(),
    });

    const res = await authedGet("/rider/me");

    expect(res.status).toBe(200);
    expect(res.body.rider.email).toBe("pat@example.com");
  });
});
