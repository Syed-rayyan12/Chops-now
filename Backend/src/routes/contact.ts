import { Router, Request, Response } from 'express';
import { sendContactEmail } from '../config/email.config';

const router = Router();

// POST /api/contact/submit
router.post('/submit', async (req: Request, res: Response) => {
  console.log('📨 Contact form submission received:', req.body);
  
  try {
    const { firstName, email, subject, message } = req.body;

    // Validation
    if (!firstName || !email || !subject || !message) {
      console.log('❌ Validation failed: missing fields');
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (firstName, email, subject, message)',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Validation failed: invalid email');
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Name validation
    if (firstName.trim().length < 2) {
      console.log('❌ Validation failed: firstName too short');
      return res.status(400).json({
        success: false,
        message: 'First name must be at least 2 characters',
      });
    }

    // Message validation
    if (message.trim().length < 10) {
      console.log('❌ Validation failed: message too short');
      return res.status(400).json({
        success: false,
        message: 'Message must be at least 10 characters',
      });
    }

    console.log('✅ Validation passed, sending email...');

    // Send email to all company accounts
    const result = await sendContactEmail({ firstName, email, subject, message });
    
    console.log('✅ Email sent successfully:', result);

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. We will get back to you soon.',
    });
  } catch (error: any) {
    console.error('❌ Contact form error:', error.message);
    console.error('❌ Full error:', error);
    return res.status(500).json({
      success: false,
      message: `Failed to send message: ${error.message || 'Unknown error'}`,
    });
  }
});

export default router;
