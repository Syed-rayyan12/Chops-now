// OTP send/verify must canonicalize emails (trim + lowercase) so that a
// whitespace-padded / mixed-case address resolves to the same DB row, limiter
// bucket, and brute-force counter as its normalized form. Regression test for
// the normalization mismatch between limiter keys and DB lookups.
jest.mock("../config/email.config", () => ({
  __esModule: true,
  sendOTPEmail: jest.fn(),
}));
jest.mock("../config/db", () => ({
  __esModule: true,
  default: {
    user: { findUnique: jest.fn(), update: jest.fn() },
    restaurant: { findUnique: jest.fn(), update: jest.fn() },
    rider: { findUnique: jest.fn(), update: jest.fn() },
  },
}));

import express from "express";
import request from "supertest";
import { sendOTPEmail } from "../config/email.config";
import prisma from "../config/db";
import otpRouter from "../routes/otp";
import { resetAllRateLimits } from "../utils/rateLimiter";

const mockSendOTP = sendOTPEmail as unknown as jest.Mock;
const mockPrisma = prisma as unknown as {
  user: { findUnique: jest.Mock; update: jest.Mock };
};

const NORMALIZED = "ada@example.com";
const MESSY = "  Ada@Example.COM  ";

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/otp", otpRouter);
  return app;
}

describe("OTP email normalization", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetAllRateLimits();
    mockPrisma.user.update.mockResolvedValue({});
  });

  it("/send normalizes the email for DB lookup, update, and delivery", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ firstName: "Ada", lastName: "Lovelace" });

    const res = await request(makeApp())
      .post("/otp/send")
      .send({ email: MESSY, role: "USER" });

    expect(res.status).toBe(200);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: NORMALIZED } });
    expect(mockPrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { email: NORMALIZED } })
    );
    expect(mockSendOTP).toHaveBeenCalledTimes(1);
    expect(mockSendOTP.mock.calls[0][0].email).toBe(NORMALIZED);
  });

  it("/verify accepts a padded, uppercase email and verifies the canonical row", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      otp: "654321",
      otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
    });

    const res = await request(makeApp())
      .post("/otp/verify")
      .send({ email: MESSY, role: "USER", otp: "654321" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: NORMALIZED } });
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { email: NORMALIZED },
      data: { isEmailVerified: true, otp: null, otpExpiry: null },
    });
  });

  it("counts case/whitespace variants against the same brute-force bucket", async () => {
    // Wrong code each time; the lockout keys on the normalized email, so mixing
    // casing/whitespace across attempts must not reset the counter.
    mockPrisma.user.findUnique.mockResolvedValue({
      otp: "111111",
      otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
    });

    const variants = [
      "ada@example.com",
      "ADA@example.com",
      " ada@Example.com ",
      "Ada@Example.Com",
      "  ADA@EXAMPLE.COM",
    ];
    for (const email of variants) {
      const res = await request(makeApp())
        .post("/otp/verify")
        .send({ email, role: "USER", otp: "000000" });
      expect(res.status).toBe(400);
    }

    // 6th attempt (any variant) is locked out.
    const locked = await request(makeApp())
      .post("/otp/verify")
      .send({ email: "ada@example.com", role: "USER", otp: "000000" });
    expect(locked.status).toBe(429);
  });
});
