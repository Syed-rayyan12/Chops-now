import { Router, Request, Response } from "express";
import { sendNewsletterSubscriptionEmail } from "../config/email.config";

const router = Router();

// POST /api/newsletter/subscribe
router.post("/subscribe", async (req: Request, res: Response) => {
  console.log("📨 Newsletter subscription received:", req.body);

  try {
    const { email } = req.body;

    if (!email) {
      console.log("❌ Validation failed: missing email");
      return res.status(400).json({
        success: false,
        message: "Please provide an email address",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Validation failed: invalid email");
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    console.log("✅ Validation passed, sending newsletter email...");

    const result = await sendNewsletterSubscriptionEmail({ email });

    console.log("✅ Newsletter email sent successfully:", result);

    return res.status(200).json({
      success: true,
      message: "Thank you! Your subscription has been received.",
    });
  } catch (error: any) {
    console.error("❌ Newsletter subscription error:", error.message);
    console.error("❌ Full error:", error);
    return res.status(500).json({
      success: false,
      message: `Failed to process subscription: ${error.message || "Unknown error"}`,
    });
  }
});

export default router;
