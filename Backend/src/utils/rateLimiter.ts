// ============================================
// In-memory fixed-window rate limiter (backend)
// ============================================
// A tiny dependency-free limiter used to throttle abuse-prone public endpoints
// (OTP send/verify, resume upload). State is per-process and resets on restart,
// which is fine for these flows — the goal is to blunt automated abuse and user
// enumeration, not to provide a distributed quota. For multi-instance
// deployments this should be backed by a shared store (e.g. Redis).

import type { Request, Response, NextFunction } from "express";

interface Entry {
  count: number;
  resetAt: number;
}

// Every store registers itself so tests can reset all limiter state between
// cases without each module having to expose its private stores.
const allStores = new Set<FixedWindowStore>();

export class FixedWindowStore {
  private store = new Map<string, Entry>();

  constructor(private windowMs: number) {
    allStores.add(this);
  }

  /** Increment the counter for `key` within the current window and return the new count. */
  hit(key: string): number {
    const now = Date.now();
    const entry = this.store.get(key);
    if (!entry || entry.resetAt <= now) {
      this.store.set(key, { count: 1, resetAt: now + this.windowMs });
      return 1;
    }
    entry.count += 1;
    return entry.count;
  }

  /** Read the current count for `key` without incrementing it. */
  peek(key: string): number {
    const entry = this.store.get(key);
    if (!entry || entry.resetAt <= Date.now()) return 0;
    return entry.count;
  }

  reset(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

/** Test helper: wipe all limiter state across every store. */
export function resetAllRateLimits(): void {
  for (const store of allStores) store.clear();
}

/** Best-effort client IP, honouring a single proxy hop via X-Forwarded-For. */
export function clientIp(req: Request): string {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length > 0) {
    return fwd.split(",")[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || "unknown";
}

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  /** Derives the bucket key for a request. Returning undefined skips limiting. */
  keyGenerator: (req: Request) => string | undefined;
  message?: string;
}

/** Express middleware factory enforcing a fixed-window request cap per key. */
export function rateLimit(opts: RateLimitOptions) {
  const store = new FixedWindowStore(opts.windowMs);
  return (req: Request, res: Response, next: NextFunction) => {
    const key = opts.keyGenerator(req);
    if (!key) return next();
    const count = store.hit(key);
    if (count > opts.max) {
      res.setHeader("Retry-After", Math.ceil(opts.windowMs / 1000).toString());
      return res.status(429).json({
        success: false,
        message: opts.message || "Too many requests. Please try again later.",
      });
    }
    next();
  };
}
