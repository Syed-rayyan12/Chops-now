# SendGrid Email Integration

## Overview
The backend now supports **SendGrid** for transactional emails with automatic fallback to Gmail SMTP.

## Setup

### 1. Get Your SendGrid API Key
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API key with **Mail Send** permissions
3. **Never commit the key to git**

### 2. Configure Environment Variables

Add to your Railway environment or local `.env` file:

```env
# Primary email service (recommended)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx

# Sender email address (required by SendGrid)
EMAIL_USER=noreply@chopnow.co.uk

# Optional: Gmail SMTP fallback (if SENDGRID_API_KEY is not set)
EMAIL_PASSWORD=your-gmail-app-password
```

### 3. Deploy
Push to git and Railway will auto-deploy with the new configuration.

## How It Works

- **With `SENDGRID_API_KEY` set:** Uses SendGrid API for reliable delivery
- **Without `SENDGRID_API_KEY`:** Falls back to Gmail SMTP (requires `EMAIL_USER` and `EMAIL_PASSWORD`)

## Current Email Features

✅ **Contact Form** (`/api/contact/submit`)
- Sends customer inquiries to company email addresses
- Automatically uses SendGrid when configured

## Testing

### Local Test (optional)
```bash
cd Backend
npm run dev

# Send a test contact form submission
curl -X POST http://localhost:4000/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test User",
    "email": "test@example.com",
    "subject": "Testing SendGrid",
    "message": "This is a test email via SendGrid"
  }'
```

### Production Test
Use your live frontend contact form or call the API directly:
```bash
curl -X POST https://nodejs-production-c43f.up.railway.app/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "email": "yourtest@example.com",
    "subject": "Hello",
    "message": "Testing from production"
  }'
```

## Security Notes

⚠️ **IMPORTANT:**
- The API key in the integration guide screenshot is **publicly exposed** - revoke it immediately
- Never paste API keys in public channels
- Use Railway's environment variables for all secrets
- Keep `.env` files out of version control (already in `.gitignore`)

## Dependencies

- `@sendgrid/mail` - Official SendGrid Node.js SDK
- `nodemailer` - Fallback email transport (existing)

## Future Enhancements

Potential email features to add:
- Order confirmation emails
- Password reset emails
- Restaurant approval notifications
- Rider assignment notifications
