import nodemailer from 'nodemailer';
import sendgridMail from '@sendgrid/mail';

console.log('📧 Email Config:', {
  emailUser: process.env.EMAIL_USER,
  passwordSet: !!process.env.EMAIL_PASSWORD,
  usingSendGrid: !!process.env.SENDGRID_API_KEY,
});

// If SendGrid API key is present, configure SendGrid
if (process.env.SENDGRID_API_KEY) {
  sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Create transporter using Gmail SMTP (fallback)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Company email addresses - emails will be sent to all of these
export const COMPANY_EMAILS = [
  'pr.muslim.82@gmail.com', // For testing - replace with client emails later
];

export interface ContactFormData {
  firstName: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterSubscriptionData {
  email: string;
}

export const sendContactEmail = async (data: ContactFormData) => {
  const { firstName, email, subject, message } = data;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #FF6B00 0%, #FF8533 100%); padding: 20px; border-radius: 10px 10px 0 0;">
        <h2 style="color: white; margin: 0; font-size: 24px;">🍽️ New Contact Form Submission</h2>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #333; width: 120px;">Name:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #555;">${firstName}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #333;">Email:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #555;">
              <a href="mailto:${email}" style="color: #FF6B00; text-decoration: none;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #333;">Subject:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #555;">${subject}</td>
          </tr>
        </table>
        <div style="margin-top: 25px;">
          <h3 style="color: #333; margin-bottom: 10px; font-size: 16px;">Message:</h3>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #FF6B00;">
            <p style="margin: 0; color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            This email was sent from ChopNow contact form<br/>
            Received at: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}
          </p>
        </div>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"ChopNow" <${process.env.EMAIL_USER}>`,
    to: COMPANY_EMAILS,
    replyTo: email,
    subject: `[ChopNow Contact] ${subject}`,
    html: htmlContent,
  };
  console.log('📤 Sending email to:', COMPANY_EMAILS);

  // If SendGrid key is present, use SendGrid SDK (preferred)
  if (process.env.SENDGRID_API_KEY) {
    const msg = {
      to: COMPANY_EMAILS,
      from: process.env.EMAIL_USER || 'no-reply@chopnow.example',
      replyTo: email,
      subject: mailOptions.subject,
      html: htmlContent,
    };

    const result = await sendgridMail.send(msg as any);
    console.log('✅ SendGrid response:', result && result[0] && result[0].statusCode);
    return result;
  }

  // Fallback to nodemailer
  const result = await transporter.sendMail(mailOptions as any);
  console.log('✅ Nodemailer sent:', result.messageId);
  return result;
};

export const sendNewsletterSubscriptionEmail = async (data: NewsletterSubscriptionData) => {
  const { email } = data;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #FF6B00 0%, #FF8533 100%); padding: 20px; border-radius: 10px 10px 0 0;">
        <h2 style="color: white; margin: 0; font-size: 24px;">📬 New Newsletter Subscription</h2>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #333; width: 120px;">Email:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #555;">
              <a href="mailto:${email}" style="color: #FF6B00; text-decoration: none;">${email}</a>
            </td>
          </tr>
        </table>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            This email was sent from ChopNow newsletter subscription form<br/>
            Received at: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}
          </p>
        </div>
      </div>
    </div>
  `;

  const subject = "[ChopNow Newsletter] New subscription";

  return sendEmail(COMPANY_EMAILS, subject, htmlContent, email);
};

// Helper function to send emails (DRY)
const sendEmail = async (to: string | string[], subject: string, html: string, replyTo?: string) => {
  console.log('📤 Sending email to:', to);

  if (process.env.SENDGRID_API_KEY) {
    const msg = {
      to: Array.isArray(to) ? to : [to],
      from: process.env.EMAIL_USER || 'noreply@chopnow.co.uk',
      replyTo: replyTo,
      subject,
      html,
    };
    const result = await sendgridMail.send(msg as any);
    console.log('✅ SendGrid sent');
    return result;
  }

  const mailOptions = {
    from: `"ChopNow" <${process.env.EMAIL_USER}>`,
    to: Array.isArray(to) ? to : [to],
    replyTo,
    subject,
    html,
  };
  const result = await transporter.sendMail(mailOptions as any);
  console.log('✅ Nodemailer sent:', result.messageId);
  return result;
};

// Order confirmation email to customer
export const sendOrderConfirmationEmail = async (data: {
  customerEmail: string;
  customerName: string;
  orderCode: string;
  restaurantName: string;
  items: Array<{ title: string; qty: number; unitPrice: number }>;
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
}) => {
  const { customerEmail, customerName, orderCode, restaurantName, items, subtotal, serviceFee, deliveryFee, total, deliveryAddress } = data;

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">${item.title}</td>
      <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; text-align: center;">${item.qty}</td>
      <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; text-align: right;">£${item.unitPrice.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; text-align: right; font-weight: bold;">£${(item.qty * item.unitPrice).toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #FF6B00 0%, #FF8533 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Order Confirmed!</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Thank you for your order</p>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Hi ${customerName},</p>
        <p style="font-size: 14px; color: #555; line-height: 1.6; margin: 0 0 25px 0;">
          Your order from <strong>${restaurantName}</strong> has been confirmed and is being prepared!
        </p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">Order Details</h3>
          <p style="margin: 0; color: #555;"><strong>Order Code:</strong> ${orderCode}</p>
          <p style="margin: 5px 0 0 0; color: #555;"><strong>Delivery Address:</strong> ${deliveryAddress}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 12px; text-align: left; font-weight: bold; color: #333;">Item</th>
              <th style="padding: 12px; text-align: center; font-weight: bold; color: #333;">Qty</th>
              <th style="padding: 12px; text-align: right; font-weight: bold; color: #333;">Price</th>
              <th style="padding: 12px; text-align: right; font-weight: bold; color: #333;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <table style="width: 100%; margin-top: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #555;">Subtotal:</td>
            <td style="padding: 8px 0; text-align: right; color: #555;">£${subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #555;">ChopNow Service Fee (15%):</td>
            <td style="padding: 8px 0; text-align: right; color: #555;">£${serviceFee.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #555;">Delivery Fee:</td>
            <td style="padding: 8px 0; text-align: right; color: #555;">£${deliveryFee.toFixed(2)}</td>
          </tr>
          <tr style="border-top: 2px solid #FF6B00;">
            <td style="padding: 12px 0; font-weight: bold; color: #333; font-size: 18px;">Total:</td>
            <td style="padding: 12px 0; text-align: right; font-weight: bold; color: #FF6B00; font-size: 18px;">£${total.toFixed(2)}</td>
          </tr>
        </table>

        <div style="margin-top: 30px; padding: 20px; background: #fff8f0; border-left: 4px solid #FF6B00; border-radius: 4px;">
          <p style="margin: 0; color: #555; font-size: 14px;">
            <strong>What's next?</strong><br/>
            Your order is being prepared. You'll receive updates as your order progresses. Track your order in your account dashboard.
          </p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Need help? Contact us at support@chopnow.co.uk<br/>
            © ${new Date().getFullYear()} ChopNow. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;

  return sendEmail(customerEmail, `Order Confirmed - ${orderCode}`, html);
};

// Welcome email for new users
export const sendWelcomeEmail = async (data: {
  email: string;
  firstName: string;
  role: 'USER' | 'RESTAURANT' | 'RIDER';
}) => {
  const { email, firstName, role } = data;
  
  const roleMessages = {
    USER: {
      title: 'Welcome to ChopNow! 🎉',
      content: "You're all set to discover amazing restaurants and order delicious food delivered right to your door.",
      cta: 'Browse restaurants and start your first order today!'
    },
    RESTAURANT: {
      title: 'Welcome to ChopNow Partners! 🍽️',
      content: "Your restaurant account has been created. Our team will review your application and activate your account soon.",
      cta: 'We\'ll notify you once your account is approved.'
    },
    RIDER: {
      title: 'Welcome to ChopNow Riders! 🚴',
      content: "Your rider account has been created. Our team will review your documents and approve your account soon.",
      cta: 'We\'ll notify you once your account is approved and you can start delivering.'
    }
  };

  const message = roleMessages[role];

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #FF6B00 0%, #FF8533 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">${message.title}</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Hi ${firstName},</p>
        <p style="font-size: 14px; color: #555; line-height: 1.6; margin: 0 0 25px 0;">
          ${message.content}
        </p>
        
        <div style="background: #fff8f0; padding: 20px; border-radius: 8px; border-left: 4px solid #FF6B00; margin: 25px 0;">
          <p style="margin: 0; color: #555; font-size: 14px;">
            ${message.cta}
          </p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Need help? Contact us at support@chopnow.co.uk<br/>
            © ${new Date().getFullYear()} ChopNow. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;

  return sendEmail(email, message.title, html);
};

// Restaurant approval/rejection email
export const sendRestaurantStatusEmail = async (data: {
  email: string;
  restaurantName: string;
  ownerName: string;
  approved: boolean;
  rejectionReason?: string;
}) => {
  const { email, restaurantName, ownerName, approved, rejectionReason } = data;

  const html = approved ? `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">✅ Restaurant Approved!</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Hi ${ownerName},</p>
        <p style="font-size: 14px; color: #555; line-height: 1.6; margin: 0 0 25px 0;">
          Great news! <strong>${restaurantName}</strong> has been approved and is now live on ChopNow.
        </p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 25px 0;">
          <p style="margin: 0; color: #555; font-size: 14px;">
            <strong>What's next?</strong><br/>
            • Add your menu items in the dashboard<br/>
            • Set your opening hours<br/>
            • Start receiving orders!
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://www.chopnow.co.uk/restaurant-dashboard" style="background: #FF6B00; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Go to Dashboard
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Need help? Contact us at partners@chopnow.co.uk<br/>
            © ${new Date().getFullYear()} ChopNow. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  ` : `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Application Update</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Hi ${ownerName},</p>
        <p style="font-size: 14px; color: #555; line-height: 1.6; margin: 0 0 25px 0;">
          Thank you for your interest in partnering with ChopNow. Unfortunately, we're unable to approve <strong>${restaurantName}</strong> at this time.
        </p>
        
        ${rejectionReason ? `
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 25px 0;">
            <p style="margin: 0; color: #555; font-size: 14px;">
              <strong>Reason:</strong><br/>
              ${rejectionReason}
            </p>
          </div>
        ` : ''}

        <p style="font-size: 14px; color: #555; line-height: 1.6; margin: 25px 0 0 0;">
          If you'd like to discuss this decision or reapply, please contact our partner support team.
        </p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Questions? Contact us at partners@chopnow.co.uk<br/>
            © ${new Date().getFullYear()} ChopNow. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;

  const subject = approved 
    ? `✅ ${restaurantName} - Application Approved!`
    : `Application Update - ${restaurantName}`;

  return sendEmail(email, subject, html);
};

// Rider approval/rejection email
export const sendRiderStatusEmail = async (data: {
  email: string;
  riderName: string;
  approved: boolean;
  rejectionReason?: string;
}) => {
  const { email, riderName, approved, rejectionReason } = data;

  const html = approved ? `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">✅ Rider Account Approved!</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Hi ${riderName},</p>
        <p style="font-size: 14px; color: #555; line-height: 1.6; margin: 0 0 25px 0;">
          Congratulations! Your rider account has been approved. You can now start accepting delivery orders.
        </p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 25px 0;">
          <p style="margin: 0; color: #555; font-size: 14px;">
            <strong>Getting started:</strong><br/>
            • Log in to your rider dashboard<br/>
            • Go online to start receiving orders<br/>
            • Track your earnings in real-time
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://www.chopnow.co.uk/rider-dashboard" style="background: #FF6B00; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Go to Dashboard
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Need help? Contact us at riders@chopnow.co.uk<br/>
            © ${new Date().getFullYear()} ChopNow. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  ` : `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Application Update</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Hi ${riderName},</p>
        <p style="font-size: 14px; color: #555; line-height: 1.6; margin: 0 0 25px 0;">
          Thank you for your interest in becoming a ChopNow rider. Unfortunately, we're unable to approve your application at this time.
        </p>
        
        ${rejectionReason ? `
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 25px 0;">
            <p style="margin: 0; color: #555; font-size: 14px;">
              <strong>Reason:</strong><br/>
              ${rejectionReason}
            </p>
          </div>
        ` : ''}

        <p style="font-size: 14px; color: #555; line-height: 1.6; margin: 25px 0 0 0;">
          If you'd like to discuss this decision or reapply with updated information, please contact our rider support team.
        </p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Questions? Contact us at riders@chopnow.co.uk<br/>
            © ${new Date().getFullYear()} ChopNow. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;

  const subject = approved 
    ? '✅ Your Rider Account is Approved!'
    : 'Rider Application Update';

  return sendEmail(email, subject, html);
};
