import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

console.log('📧 Email Config:', {
  resendKeySet: !!process.env.RESEND_API_KEY,
});

// Company email addresses - emails will be sent to all of these
// TODO: Replace with client's 5 company emails after testing
export const COMPANY_EMAILS = [
  'pr.muslim.82@gmail.com', // For testing - replace with client emails later
  // 'contact@chopnow.co.uk',
  // 'support@chopnow.co.uk',
  // 'info@chopnow.co.uk',
  // 'sales@chopnow.co.uk',
  // 'admin@chopnow.co.uk',
];

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async (data: ContactFormData) => {
  const { name, email, phone, subject, message } = data;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #FF6B00 0%, #FF8533 100%); padding: 20px; border-radius: 10px 10px 0 0;">
        <h2 style="color: white; margin: 0; font-size: 24px;">🍽️ New Contact Form Submission</h2>
      </div>
      <div style="background: #ffffff; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #333; width: 120px;">Name:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #555;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #333;">Email:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #555;">
              <a href="mailto:${email}" style="color: #FF6B00; text-decoration: none;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #333;">Phone:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #555;">${phone || 'Not provided'}</td>
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

  // Send email using Resend API
  const { data: result, error } = await resend.emails.send({
    from: 'ChopNow <onboarding@resend.dev>', // Use Resend's test domain or your verified domain
    to: COMPANY_EMAILS,
    replyTo: email,
    subject: `[ChopNow Contact] ${subject}`,
    html: htmlContent,
  });

  if (error) {
    console.error('❌ Resend error:', error);
    throw new Error(error.message);
  }

  console.log('✅ Email sent via Resend:', result);
  return result;
};
