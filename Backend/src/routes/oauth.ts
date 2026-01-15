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

    const firstName = googleUser.given_name || googleUser.email.split('@')[0];
    const lastName = googleUser.family_name || '';
    const email = googleUser.email.toLowerCase();

    // Handle different roles
    if (userRole === "RESTAURANT") {
      // Check if restaurant already exists
      let restaurant = await prisma.restaurant.findFirst({
        where: { ownerEmail: email }
      });

      if (!restaurant) {
        // Create new restaurant
        const restaurantName = `${firstName}'s Restaurant`;
        const slug = `${firstName.toLowerCase()}-restaurant-${Date.now()}`;
        
        restaurant = await prisma.restaurant.create({
          data: {
            name: restaurantName,
            slug,
            phone: '', // Will be updated in profile
            address: '', // Will be updated in profile
            ownerEmail: email,
            ownerFirstName: firstName,
            ownerLastName: lastName,
          },
        });

        console.log(`✅ New restaurant created via Google OAuth:`, restaurant.ownerEmail);

        // Send welcome email
        try {
          const { sendWelcomeEmail } = await import('../config/email.config');
          await sendWelcomeEmail({
            email: restaurant.ownerEmail,
            firstName: restaurant.ownerFirstName,
            role: 'RESTAURANT'
          });
          console.log('✅ Welcome email sent to restaurant owner');
        } catch (emailError) {
          console.error('⚠️ Failed to send welcome email:', emailError);
        }

        // Return with isNewUser flag
        const token = jwt.sign({ 
          id: restaurant.id, 
          role: 'RESTAURANT',
          email: restaurant.ownerEmail 
        }, JWT_SECRET, { expiresIn: "7d" });

        return res.status(200).json({ 
          success: true,
          isNewUser: true,
          user: {
            id: restaurant.id,
            email: restaurant.ownerEmail,
            firstName: restaurant.ownerFirstName,
            lastName: restaurant.ownerLastName,
            phone: restaurant.phone,
            role: 'RESTAURANT',
          }, 
          token 
        });
      } else {
        console.log(`✅ Existing restaurant logged in via Google:`, restaurant.ownerEmail);
      }

      // Check if profile is complete (phone and address required)
      const needsSetup = !restaurant.phone || !restaurant.address;

      // Generate JWT token with restaurant data (for existing users)
      const token = jwt.sign({ 
        id: restaurant.id, 
        role: 'RESTAURANT',
        email: restaurant.ownerEmail 
      }, JWT_SECRET, { expiresIn: "7d" });

      return res.status(200).json({ 
        success: true,
        isNewUser: needsSetup, // Redirect to setup if profile incomplete
        user: {
          id: restaurant.id,
          email: restaurant.ownerEmail,
          firstName: restaurant.ownerFirstName,
          lastName: restaurant.ownerLastName,
          phone: restaurant.phone,
          role: 'RESTAURANT',
        }, 
        token 
      });
    }

    if (userRole === "RIDER") {
      // Check if rider already exists
      let rider = await prisma.rider.findFirst({
        where: { email }
      });

      if (!rider) {
        // Create new rider
        rider = await prisma.rider.create({
          data: {
            email,
            firstName,
            lastName,
            phone: '', // Will be updated in profile
            password: '', // No password for OAuth users
            address: null,
          },
        });

        console.log(`✅ New rider created via Google OAuth:`, rider.email);

        // Send welcome email
        try {
          const { sendWelcomeEmail } = await import('../config/email.config');
          await sendWelcomeEmail({
            email: rider.email,
            firstName: rider.firstName,
            role: 'RIDER'
          });
          console.log('✅ Welcome email sent to rider');
        } catch (emailError) {
          console.error('⚠️ Failed to send welcome email:', emailError);
        }

        // Return with isNewUser flag
        const token = jwt.sign({ 
          id: rider.id, 
          role: 'RIDER',
          email: rider.email 
        }, JWT_SECRET, { expiresIn: "7d" });

        return res.status(200).json({ 
          success: true,
          isNewUser: true,
          user: {
            id: rider.id,
            email: rider.email,
            firstName: rider.firstName,
            lastName: rider.lastName,
            phone: rider.phone,
            role: 'RIDER',
          }, 
          token 
        });
      } else {
        console.log(`✅ Existing rider logged in via Google:`, rider.email);
      }

      // Check if profile is complete (phone and address required)
      const needsSetup = !rider.phone || !rider.address;

      // Generate JWT token with rider data (for existing users)
      const token = jwt.sign({ 
        id: rider.id, 
        role: 'RIDER',
        email: rider.email 
      }, JWT_SECRET, { expiresIn: "7d" });

      return res.status(200).json({ 
        success: true,
        isNewUser: needsSetup, // Redirect to setup if profile incomplete
        user: {
          id: rider.id,
          email: rider.email,
          firstName: rider.firstName,
          lastName: rider.lastName,
          phone: rider.phone,
          role: 'RIDER',
        }, 
        token 
      });
    }

    // Handle USER role (default)
    // Check if user already exists
    let user = await prisma.user.findFirst({
      where: { email }
    });

    if (!user) {
      // Create new user from Google data
      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: '', // No password for OAuth users
          role: "USER",
          phone: null,
        },
      });

      console.log(`✅ New USER created via Google OAuth:`, user.email);

      // Send welcome email
      try {
        const { sendWelcomeEmail } = await import('../config/email.config');
        await sendWelcomeEmail({
          email: user.email,
          firstName: user.firstName,
          role: 'USER'
        });
        console.log('✅ Welcome email sent to Google user');
      } catch (emailError) {
        console.error('⚠️ Failed to send welcome email:', emailError);
      }
    } else {
      console.log(`✅ Existing USER logged in via Google:`, user.email);
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    // Return user data and token with isNewUser flag
    const { password: _pw, ...userWithoutPassword } = user;
    const isNewUser = !user.createdAt || (Date.now() - new Date(user.createdAt).getTime()) < 5000;
    
    res.status(200).json({ 
      success: true,
      isNewUser: false, // Users don't need additional setup
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
