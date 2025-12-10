import { Router, Request, Response } from 'express';
import { sendContactEmail } from '../config/email.config';

const router = Router();

// POST /api/contact/submit
router.post('/submit', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (name, email, subject, message)',
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
    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters',
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
    await sendContactEmail({ name, email, phone, subject, message });

    console.log(`✉️ Contact form submitted by ${email} - Subject: ${subject}`);

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. We will get back to you soon.',
    });
  } catch (error) {
    console.error('❌ Contact form error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
    });
  }
});

export default router;
