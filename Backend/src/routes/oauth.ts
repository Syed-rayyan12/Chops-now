import { Router } from "express";
import prisma from "../config/db";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

console.log("✅ OAuth routes loaded");

// Google OAuth - Exchange code for token and create/login user
router.post("/google", async (req, res) => {
  try {
    const { code, redirectUri, role = "USER" } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Authorization code is required" });
    }

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      console.error("❌ Google OAuth credentials not configured");
      return res.status(500).json({ message: "OAuth not configured properly" });
    }

    // Validate role
    const validRoles = ["USER", "RESTAURANT", "RIDER"];
    const userRole = validRoles.includes(role) ? role : "USER";

    // Exchange code for tokens with Google
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("❌ Google token exchange failed:", tokens);
      return res.status(400).json({ message: tokens.error_description || 'Failed to exchange code for token' });
    }

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });

    const googleUser = await userInfoResponse.json();

    if (!userInfoResponse.ok) {
      console.error("❌ Failed to get user info from Google");
      return res.status(400).json({ message: 'Failed to get user information' });
    }

    console.log('✅ Google user info received:', { email: googleUser.email, role: userRole });

    // Check if user already exists
    let user = await prisma.user.findFirst({
      where: { email: googleUser.email.toLowerCase() }
    });

    if (!user) {
      // Create new user from Google data
      const firstName = googleUser.given_name || googleUser.email.split('@')[0];
      const lastName = googleUser.family_name || '';

      user = await prisma.user.create({
        data: {
          email: googleUser.email.toLowerCase(),
          firstName,
          lastName,
          password: '', // No password for OAuth users
          role: userRole as any,
          phone: null,
          // image: googleUser.picture || null, // Temporarily removed - requires migration
        },
      });

      console.log(`✅ New ${userRole} user created via Google OAuth:`, user.email);

      // Send welcome email
      try {
        const { sendWelcomeEmail } = await import('../config/email.config');
        await sendWelcomeEmail({
          email: user.email,
          firstName: user.firstName,
          role: userRole
        });
        console.log('✅ Welcome email sent to Google user');
      } catch (emailError) {
        console.error('⚠️ Failed to send welcome email:', emailError);
      }
    } else {
      console.log(`✅ Existing ${user.role} user logged in via Google:`, user.email);
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    // Return user data and token
    const { password: _pw, ...userWithoutPassword } = user;
    res.status(200).json({ 
      success: true,
      user: userWithoutPassword, 
      token 
    });
  } catch (err: any) {
    console.error("❌ Google OAuth error:", err);
    res.status(500).json({ 
      success: false,
      message: "Google authentication failed", 
      error: err.message 
    });
  }
});

export default router;
