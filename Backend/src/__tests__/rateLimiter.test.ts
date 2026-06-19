import express from "express";
import request from "supertest";
import {
  FixedWindowStore,
  rateLimit,
  resetAllRateLimits,
} from "../utils/rateLimiter";

describe("FixedWindowStore", () => {
  it("counts hits and reads without incrementing via peek", () => {
    const store = new FixedWindowStore(60_000);
    expect(store.hit("a")).toBe(1);
    expect(store.hit("a")).toBe(2);
    expect(store.peek("a")).toBe(2); // peek does not increment
    expect(store.peek("b")).toBe(0);
  });

  it("reset clears a single key", () => {
    const store = new FixedWindowStore(60_000);
    store.hit("a");
    store.hit("a");
    store.reset("a");
    expect(store.peek("a")).toBe(0);
  });

  it("starts a fresh window once the previous one has expired", () => {
    const store = new FixedWindowStore(-1); // already-expired window
    expect(store.hit("a")).toBe(1);
    expect(store.hit("a")).toBe(1); // never accumulates
  });
});

describe("rateLimit middleware", () => {
  beforeEach(() => resetAllRateLimits());

  function appWithLimiter(max: number) {
    const limiter = rateLimit({
      windowMs: 60_000,
      max,
      keyGenerator: () => "fixed-key",
      message: "slow down",
    });
    const app = express();
    app.get("/ping", limiter, (_req, res) => res.json({ ok: true }));
    return app;
  }

  it("allows up to max requests then returns 429", async () => {
    const app = appWithLimiter(2);

    expect((await request(app).get("/ping")).status).toBe(200);
    expect((await request(app).get("/ping")).status).toBe(200);

    const blocked = await request(app).get("/ping");
    expect(blocked.status).toBe(429);
    expect(blocked.body.message).toBe("slow down");
  });

  it("skips limiting when the key generator returns undefined", async () => {
    const limiter = rateLimit({
      windowMs: 60_000,
      max: 1,
      keyGenerator: () => undefined,
    });
    const app = express();
    app.get("/ping", limiter, (_req, res) => res.json({ ok: true }));

    for (let i = 0; i < 5; i++) {
      expect((await request(app).get("/ping")).status).toBe(200);
    }
  });
});
