import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sendOTPEmail } from "../config/email.config";

const router = Router();
const prisma = new PrismaClient();

// Generate 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// POST /api/otp/send - Send OTP to email
router.post("/send", async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({
        success: false,
        message: "Email and role are required",
      });
    }

    // Validate role
    if (!["USER", "RESTAURANT", "RIDER"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Find user based on role and update OTP
    let user: any = null;
    let name = "";

    if (role === "USER") {
      user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        await prisma.user.update({
          where: { email },
          data: { otp, otpExpiry },
        });
        name = `${user.firstName} ${user.lastName}`;
      }
    } else if (role === "RESTAURANT") {
      user = await prisma.restaurant.findUnique({ where: { ownerEmail: email } });
      if (user) {
        await prisma.restaurant.update({
          where: { ownerEmail: email },
          data: { otp, otpExpiry },
        });
        name = `${user.ownerFirstName} ${user.ownerLastName}`;
      }
    } else if (role === "RIDER") {
      user = await prisma.rider.findUnique({ where: { email } });
      if (user) {
        await prisma.rider.update({
          where: { email },
          data: { otp, otpExpiry },
        });
        name = `${user.firstName} ${user.lastName}`;
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Send OTP email
    await sendOTPEmail({ email, name, otp, role: role as "USER" | "RESTAURANT" | "RIDER" });

    console.log(`✅ OTP sent to ${email} (${role}): ${otp}`);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error: any) {
    console.error("❌ OTP send error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
});

// POST /api/otp/verify - Verify OTP
router.post("/verify", async (req: Request, res: Response) => {
  try {
    const { email, otp, role } = req.body;

    if (!email || !otp || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and role are required",
      });
    }

    // Validate role
    if (!["USER", "RESTAURANT", "RIDER"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
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

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if OTP exists
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new one.",
      });
    }

    // Check if OTP expired
    if (new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Mark email as verified and clear OTP
    if (role === "USER") {
      await prisma.user.update({
        where: { email },
        data: {
          isEmailVerified: true,
          otp: null,
          otpExpiry: null,
        },
      });
    } else if (role === "RESTAURANT") {
      await prisma.restaurant.update({
        where: { ownerEmail: email },
        data: {
          isEmailVerified: true,
          otp: null,
          otpExpiry: null,
        },
      });
    } else if (role === "RIDER") {
      await prisma.rider.update({
        where: { email },
        data: {
          isEmailVerified: true,
          otp: null,
          otpExpiry: null,
        },
      });
    }

    console.log(`✅ Email verified for ${email} (${role})`);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now sign in.",
    });
  } catch (error: any) {
    console.error("❌ OTP verify error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
});

export default router;
