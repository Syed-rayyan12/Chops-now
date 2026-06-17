import { Router, Request, Response } from "express";
import { sendNewsletterSubscriptionEmail } from "../config/email.config";
import { logger } from "../utils/logger";

const router = Router();

// POST /api/newsletter/subscribe
router.post("/subscribe", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email address",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    await sendNewsletterSubscriptionEmail({ email });

    return res.status(200).json({
      success: true,
      message: "Thank you! Your subscription has been received.",
    });
  } catch (error: any) {
    logger.error("Newsletter subscription error:", error?.message || error);
    return res.status(500).json({
      success: false,
      message: `Failed to process subscription: ${error.message || "Unknown error"}`,
    });
  }
});

export default router;
