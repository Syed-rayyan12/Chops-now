import { Router, Request, Response } from 'express';
import { sendContactEmail } from '../config/email.config';
import { logger } from '../utils/logger';

const router = Router();

// POST /api/contact/submit
router.post('/submit', async (req: Request, res: Response) => {
  try {
    const { firstName, email, subject, message } = req.body;

    // Validation
    if (!firstName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (firstName, email, subject, message)',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Name validation
    if (firstName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'First name must be at least 2 characters',
      });
    }

    // Message validation
    if (message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Message must be at least 10 characters',
      });
    }

    // Send email to all company accounts
    await sendContactEmail({ firstName, email, subject, message });

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. We will get back to you soon.',
    });
  } catch (error: any) {
    logger.error('Contact form error:', error?.message || error);
    return res.status(500).json({
      success: false,
      message: `Failed to send message: ${error.message || 'Unknown error'}`,
    });
  }
});

export default router;
