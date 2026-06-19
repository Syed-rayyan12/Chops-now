import { Router, Request, Response } from "express";
import { sendOTPEmail } from "../config/email.config";
import prisma from "../config/db";
import { logger } from "../utils/logger";
import { FixedWindowStore, clientIp, rateLimit } from "../utils/rateLimiter";

const router = Router();

const VALID_ROLES = ["USER", "RESTAURANT", "RIDER"] as const;

// Emails are normalized to a single canonical form (trimmed + lowercased) so
// that limiter keys, DB lookups/updates, email delivery, and brute-force
// counters all agree. Without this, "User@x.com " and "user@x.com" hit different
// limiter buckets and different (or missing) DB rows.
const normalizeEmail = (value: unknown): string => String(value ?? "").trim().toLowerCase();

// Generic responses keep these endpoints from leaking which emails are
// registered. A request for a non-existent account looks identical to a valid
// one (success on /send, generic failure on /verify).
const GENERIC_SEND_MESSAGE = "If an account exists for this email, an OTP has been sent.";
const GENERIC_VERIFY_FAILURE = "Invalid or expired OTP. Please request a new one.";

// 15-minute windows for everything below.
const WINDOW_MS = 15 * 60 * 1000;

// Per-IP caps blunt broad scanning; per-email caps blunt targeted spamming of a
// single inbox. Both apply to /send.
const sendByIp = rateLimit({
  windowMs: WINDOW_MS,
  max: 10,
  keyGenerator: (req) => `otp-send:ip:${clientIp(req)}`,
  message: "Too many OTP requests. Please try again later.",
});
const sendByEmail = rateLimit({
  windowMs: WINDOW_MS,
  max: 5,
  keyGenerator: (req) => {
    const { email, role } = req.body || {};
    if (!email || !role) return undefined;
    return `otp-send:email:${String(role)}:${normalizeEmail(email)}`;
  },
  message: "Too many OTP requests for this account. Please try again later.",
});

// /verify gets an IP cap plus a per-account failed-attempt lockout so a leaked
// or guessed OTP can't be brute-forced (6-digit space is only 1,000,000 wide).
const verifyByIp = rateLimit({
  windowMs: WINDOW_MS,
  max: 30,
  keyGenerator: (req) => `otp-verify:ip:${clientIp(req)}`,
  message: "Too many verification attempts. Please try again later.",
});
const MAX_VERIFY_FAILURES = 5;
const verifyFailures = new FixedWindowStore(WINDOW_MS);
const failureKey = (role: string, email: string) =>
  `otp-verify:fail:${role}:${normalizeEmail(email)}`;

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Resolve the account row for an email+role without revealing which table
// matched. Returns the account (or null) plus a display name.
async function findAccount(role: string, email: string): Promise<{ name: string } | null> {
  if (role === "USER") {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? { name: `${user.firstName} ${user.lastName}` } : null;
  }
  if (role === "RESTAURANT") {
    const restaurant = await prisma.restaurant.findUnique({ where: { ownerEmail: email } });
    return restaurant ? { name: `${restaurant.ownerFirstName} ${restaurant.ownerLastName}` } : null;
  }
  if (role === "RIDER") {
    const rider = await prisma.rider.findUnique({ where: { email } });
    return rider ? { name: `${rider.firstName} ${rider.lastName}` } : null;
  }
  return null;
}

// POST /api/otp/send - Send OTP to email
router.post("/send", sendByIp, sendByEmail, async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!email || !role) {
      return res.status(400).json({
        success: false,
        message: "Email and role are required",
      });
    }

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const account = await findAccount(role, email);

    // Generic response: do not disclose whether the account exists. If it does,
    // persist the OTP and email it; if not, we still return success.
    if (account) {
      if (role === "USER") {
        await prisma.user.update({ where: { email }, data: { otp, otpExpiry } });
      } else if (role === "RESTAURANT") {
        // Keep User and Restaurant rows in sync for restaurant owners.
        await prisma.user.update({ where: { email }, data: { otp, otpExpiry } });
        await prisma.restaurant.update({ where: { ownerEmail: email }, data: { otp, otpExpiry } });
      } else if (role === "RIDER") {
        await prisma.rider.update({ where: { email }, data: { otp, otpExpiry } });
      }

      await sendOTPEmail({ email, name: account.name, otp, role: role as (typeof VALID_ROLES)[number] });
      // Never log the OTP value itself.
      logger.debug(`✅ OTP sent to ${email} (${role})`);
    } else {
      logger.debug(`OTP requested for unknown account (${role})`);
    }

    return res.status(200).json({
      success: true,
      message: GENERIC_SEND_MESSAGE,
    });
  } catch (error: any) {
    logger.error("❌ OTP send error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
});

// POST /api/otp/verify - Verify OTP
router.post("/verify", verifyByIp, async (req: Request, res: Response) => {
  try {
    const { otp, role } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!email || !otp || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and role are required",
      });
    }

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const key = failureKey(role, email);

    // Lock the account out once too many wrong codes are submitted in the window.
    if (verifyFailures.peek(key) >= MAX_VERIFY_FAILURES) {
      return res.status(429).json({
        success: false,
        message: "Too many invalid attempts. Please request a new OTP and try again later.",
      });
    }

    // Find user based on role
    let user: any = null;
    if (role === "USER") {
      user = await prisma.user.findUnique({ where: { email } });
    } else if (role === "RESTAURANT") {
      user = await prisma.restaurant.findUnique({ where: { ownerEmail: email } });
    } else if (role === "RIDER") {
      user = await prisma.rider.findUnique({ where: { email } });
    }

    // Treat unknown account, missing OTP, and wrong OTP identically so the
    // endpoint can't be used to enumerate accounts or probe OTP state.
    const otpValid =
      !!user &&
      !!user.otp &&
      !!user.otpExpiry &&
      new Date() <= new Date(user.otpExpiry) &&
      user.otp === otp;

    if (!otpValid) {
      verifyFailures.hit(key);
      return res.status(400).json({
        success: false,
        message: GENERIC_VERIFY_FAILURE,
      });
    }

    // Mark email as verified and clear OTP
    if (role === "USER") {
      await prisma.user.update({
        where: { email },
        data: { isEmailVerified: true, otp: null, otpExpiry: null },
      });
    } else if (role === "RESTAURANT") {
      await prisma.user.update({
        where: { email },
        data: { isEmailVerified: true, otp: null, otpExpiry: null },
      });
      await prisma.restaurant.update({
        where: { ownerEmail: email },
        data: { isEmailVerified: true, otp: null, otpExpiry: null },
      });
    } else if (role === "RIDER") {
      await prisma.rider.update({
        where: { email },
        data: { isEmailVerified: true, otp: null, otpExpiry: null },
      });
    }

    // Successful verification clears the failed-attempt counter.
    verifyFailures.reset(key);

    logger.debug(`✅ Email verified for ${email} (${role})`);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now sign in.",
    });
  } catch (error: any) {
    logger.error("❌ OTP verify error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
});

export default router;
