// Customer (USER) login must enforce email verification — an unverified account
// must never receive a JWT, matching restaurant/rider behaviour. Regression test
// for the email-verification bypass.
jest.mock("../config/db", () => ({
  __esModule: true,
  default: {
    user: { findFirst: jest.fn() },
  },
}));
jest.mock("bcryptjs", () => ({ compare: jest.fn(), hash: jest.fn() }));

import express from "express";
import request from "supertest";
import bcrypt from "bcryptjs";
import prisma from "../config/db";
import userRouter from "../routes/user";

const mockPrisma = prisma as unknown as {
  user: { findFirst: jest.Mock };
};
const mockBcrypt = bcrypt as unknown as { compare: jest.Mock };

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/user", userRouter);
  return app;
}

const baseUser = {
  id: 1,
  email: "customer@example.com",
  password: "hashed-password",
  role: "USER",
};

describe("POST /user/login email verification", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Password is correct in all cases — verification is the variable under test.
    mockBcrypt.compare.mockResolvedValue(true);
  });

  it("rejects an unverified USER with 403 and requiresVerification, issuing no token", async () => {
    mockPrisma.user.findFirst.mockResolvedValue({ ...baseUser, isEmailVerified: false });

    const res = await request(makeApp())
      .post("/user/login")
      .send({ email: baseUser.email, password: "Password1" });

    expect(res.status).toBe(403);
    expect(res.body.requiresVerification).toBe(true);
    expect(res.body.token).toBeUndefined();
  });

  it("lets a verified USER log in and returns a token", async () => {
    mockPrisma.user.findFirst.mockResolvedValue({ ...baseUser, isEmailVerified: true });

    const res = await request(makeApp())
      .post("/user/login")
      .send({ email: baseUser.email, password: "Password1" });

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe("string");
    expect(res.body.email).toBe(baseUser.email);
  });

  it("rejects a wrong password before reaching the verification check", async () => {
    mockPrisma.user.findFirst.mockResolvedValue({ ...baseUser, isEmailVerified: true });
    mockBcrypt.compare.mockResolvedValue(false);

    const res = await request(makeApp())
      .post("/user/login")
      .send({ email: baseUser.email, password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body.token).toBeUndefined();
  });
});

describe("POST /user/google (legacy, disabled)", () => {
  it("returns 410 Gone and never issues a token", async () => {
    mockPrisma.user.findFirst.mockClear();

    const res = await request(makeApp())
      .post("/user/google")
      .send({ email: "attacker@example.com", firstName: "Mal", lastName: "Ory" });

    expect(res.status).toBe(410);
    expect(res.body.token).toBeUndefined();
    // The legacy handler must not touch the DB at all.
    expect(mockPrisma.user.findFirst).not.toHaveBeenCalled();
  });
});
