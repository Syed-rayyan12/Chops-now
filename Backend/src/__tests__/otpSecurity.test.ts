// OTP endpoints must not leak which accounts exist and must lock out brute-force
// guessing of the 6-digit code.
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

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/otp", otpRouter);
  return app;
}

describe("OTP security", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetAllRateLimits();
    mockPrisma.user.update.mockResolvedValue({});
  });

  describe("POST /otp/send enumeration resistance", () => {
    it("returns a generic 200 for an unknown account without sending email", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const res = await request(makeApp())
        .post("/otp/send")
        .send({ email: "nobody@example.com", role: "USER" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockSendOTP).not.toHaveBeenCalled();
    });

    it("returns the same generic 200 for a known account and sends an email", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        firstName: "Ada",
        lastName: "Lovelace",
      });

      const res = await request(makeApp())
        .post("/otp/send")
        .send({ email: "ada@example.com", role: "USER" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockSendOTP).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /otp/verify brute-force lockout", () => {
    it("locks the account out with 429 after repeated wrong codes", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        otp: "111111",
        otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
      });

      const submitWrong = () =>
        request(makeApp())
          .post("/otp/verify")
          .send({ email: "ada@example.com", role: "USER", otp: "000000" });

      // First 5 wrong attempts are rejected as invalid (400)...
      for (let i = 0; i < 5; i++) {
        const res = await submitWrong();
        expect(res.status).toBe(400);
      }

      // ...the 6th is locked out (429).
      const locked = await submitWrong();
      expect(locked.status).toBe(429);
    });

    it("does not reveal whether the account exists on a failed verify", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const res = await request(makeApp())
        .post("/otp/verify")
        .send({ email: "ghost@example.com", role: "USER", otp: "123456" });

      // Same generic 400 as a wrong code for a real account.
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/invalid or expired/i);
    });

    it("verifies a correct, unexpired OTP and marks the email verified", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        otp: "654321",
        otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
      });

      const res = await request(makeApp())
        .post("/otp/verify")
        .send({ email: "ada@example.com", role: "USER", otp: "654321" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { email: "ada@example.com" },
        data: { isEmailVerified: true, otp: null, otpExpiry: null },
      });
    });
  });
});
