// Google OAuth must only succeed for Google-verified emails, and a verified
// Google login is treated as proof of email ownership — accounts are created
// already-verified and never routed through our OTP flow.
jest.mock("../config/db", () => ({
  __esModule: true,
  default: {
    user: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
    restaurant: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
    rider: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
  },
}));

import express from "express";
import request from "supertest";
import prisma from "../config/db";
import oauthRouter from "../routes/oauth";

const mockPrisma = prisma as unknown as {
  user: { findFirst: jest.Mock; create: jest.Mock; update: jest.Mock };
  restaurant: { findFirst: jest.Mock; create: jest.Mock; update: jest.Mock };
  rider: { findFirst: jest.Mock; create: jest.Mock; update: jest.Mock };
};

let googleProfile: any;

beforeEach(() => {
  jest.clearAllMocks();
  googleProfile = {
    email: "Newbie@Example.com",
    given_name: "New",
    family_name: "Bie",
    verified_email: true,
  };
  // Stub Google's token + userinfo endpoints. Any other fetch (there should be
  // none — OTP sends are gone) resolves to an empty ok response.
  global.fetch = jest.fn((url: any) => {
    const u = String(url);
    if (u.includes("oauth2.googleapis.com/token")) {
      return Promise.resolve({ ok: true, json: async () => ({ access_token: "tok" }) });
    }
    if (u.includes("/oauth2/v2/userinfo")) {
      return Promise.resolve({ ok: true, json: async () => googleProfile });
    }
    return Promise.resolve({ ok: true, json: async () => ({}) });
  }) as any;
});

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/oauth", oauthRouter);
  return app;
}

function googleLogin(role: string) {
  return request(makeApp())
    .post("/oauth/google")
    .send({ code: "auth-code", redirectUri: "http://localhost:3000/auth/callback", role });
}

function otpSendWasCalled() {
  return (global.fetch as jest.Mock).mock.calls.some((c) =>
    String(c[0]).includes("/api/otp/send")
  );
}

describe("POST /oauth/google", () => {
  it("rejects an unverified Google email with 403 and no token/account", async () => {
    googleProfile.verified_email = false;

    const res = await googleLogin("USER");

    expect(res.status).toBe(403);
    expect(res.body.token).toBeUndefined();
    expect(mockPrisma.user.create).not.toHaveBeenCalled();
  });

  it("creates a verified USER and never requests OTP", async () => {
    mockPrisma.user.findFirst.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({
      id: 1,
      email: "newbie@example.com",
      role: "USER",
      firstName: "New",
      lastName: "Bie",
      phone: null,
      address: null,
    });

    const res = await googleLogin("USER");

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe("string");
    expect(res.body.requiresOTPVerification).toBe(false);
    expect(mockPrisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ isEmailVerified: true }) })
    );
    expect(otpSendWasCalled()).toBe(false);
  });

  it("creates a verified RESTAURANT and never requests OTP", async () => {
    mockPrisma.restaurant.findFirst.mockResolvedValue(null);
    mockPrisma.restaurant.create.mockResolvedValue({
      id: 2,
      ownerEmail: "newbie@example.com",
      ownerFirstName: "New",
      ownerLastName: "Bie",
      phone: "",
      address: "",
      slug: "new-restaurant",
      name: "New's Restaurant",
    });

    const res = await googleLogin("RESTAURANT");

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe("string");
    expect(res.body.requiresOTPVerification).toBe(false);
    expect(mockPrisma.restaurant.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ isEmailVerified: true }) })
    );
    expect(otpSendWasCalled()).toBe(false);
  });

  it("creates a verified RIDER and never requests OTP (still PENDING approval)", async () => {
    mockPrisma.rider.findFirst.mockResolvedValue(null);
    mockPrisma.rider.create.mockResolvedValue({
      id: 3,
      email: "newbie@example.com",
      firstName: "New",
      lastName: "Bie",
      phone: "",
    });

    const res = await googleLogin("RIDER");

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe("string");
    expect(res.body.requiresOTPVerification).toBe(false);
    expect(mockPrisma.rider.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ isEmailVerified: true }) })
    );
    expect(otpSendWasCalled()).toBe(false);
  });
});
