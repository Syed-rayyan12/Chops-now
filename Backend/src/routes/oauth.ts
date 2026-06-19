import { Router } from "express";
import prisma from "../config/db";
import { generateToken } from "../utils/jwt";

const router = Router();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Google OAuth - Exchange code for token and create/login user
router.post("/google", async (req, res) => {
  try {
    const { code, redirectUri, role = "USER" } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Authorization code is required" });
    }

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
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
      return res.status(400).json({ 
        message: `OAuth Error: ${tokens.error_description || 'Failed to exchange code for token'}`,
        details: {
          error: tokens.error,
          redirectUri: redirectUri,
          hint: 'Check that the redirect URI in Google Cloud Console matches exactly: ' + redirectUri
        }
      });
    }

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });

    const googleUser = await userInfoResponse.json();

    if (!userInfoResponse.ok) {
      return res.status(400).json({ message: 'Failed to get user information' });
    }

    // Only trust Google sign-in when Google itself reports the email as verified.
    // This is what lets us skip our own OTP flow for OAuth accounts — if Google
    // hasn't verified the address, we must not treat it as proof of ownership.
    if (googleUser.verified_email !== true) {
      return res.status(403).json({
        success: false,
        message: "Your Google account email is not verified. Please verify your email with Google and try again.",
      });
    }

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
        
        // Google already verified the email, so the account is created verified
        // and skips our OTP flow entirely.
        restaurant = await prisma.restaurant.create({
          data: {
            name: restaurantName,
            slug,
            phone: '', // Will be updated in profile
            address: '', // Will be updated in profile
            ownerEmail: email,
            ownerFirstName: firstName,
            ownerLastName: lastName,
            isEmailVerified: true, // Google verified the email
          },
        });

        // Return with isNewUser flag
        const token = generateToken({
          id: restaurant.id,
          role: 'RESTAURANT',
          email: restaurant.ownerEmail
        });

        const response = {
          success: true,
          isNewUser: true,
          needsSetup: true,
          requiresOTPVerification: false, // Google-verified — no OTP needed
          user: {
            id: restaurant.id,
            email: restaurant.ownerEmail,
            firstName: restaurant.ownerFirstName,
            lastName: restaurant.ownerLastName,
            phone: restaurant.phone,
            role: 'RESTAURANT',
          }, 
          token 
        };
        
        return res.status(200).json(response);
      }

      // A verified Google login also confirms the email for an existing account
      // that hadn't completed OTP verification.
      if (!restaurant.isEmailVerified) {
        await prisma.restaurant.update({
          where: { id: restaurant.id },
          data: { isEmailVerified: true },
        });
      }

      // Check if profile is complete (phone and address required)
      // Empty strings and null both mean incomplete
      const needsSetup = !restaurant.phone || restaurant.phone.trim() === '' || !restaurant.address || restaurant.address.trim() === '';

      // Generate JWT token with restaurant data (for existing users)
      const token = generateToken({
        id: restaurant.id,
        role: 'RESTAURANT',
        email: restaurant.ownerEmail
      });

      const response = { 
        success: true,
        isNewUser: false,
        needsSetup: needsSetup,
        requiresOTPVerification: false,
        user: {
          id: restaurant.id,
          email: restaurant.ownerEmail,
          firstName: restaurant.ownerFirstName,
          lastName: restaurant.ownerLastName,
          phone: restaurant.phone,
          role: 'RESTAURANT',
          slug: restaurant.slug,
          name: restaurant.name,
          address: restaurant.address,
        }, 
        token 
      };
      
      return res.status(200).json(response);
    }

    if (userRole === "RIDER") {
      
      // Check if rider already exists
      let rider = await prisma.rider.findFirst({
        where: { email },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          password: true,
          address: true,
          isEmailVerified: true,
          createdAt: true,
          personalDetails: true,
          idDocument: true,
          proofOfAddress: true,
          selfie: true,
          vehicle: true,
          insurance: true,
          insuranceExpiryReminder: true,
          accountNumber: true,
          sortCode: true,
          deliveryPartnerAgreementAccepted: true,
          isOnline: true,
          latitude: true,
          longitude: true,
          lastLocationUpdate: true,
          // Exclude image field as it doesn't exist in database yet
        }
      });

      if (!rider) {
        // OAuth users don't need OTP - Google already verified email
        
        // Create new rider
        try {
          rider = await prisma.rider.create({
            data: {
              email,
              firstName,
              lastName,
              phone: '', // Will be updated in profile
              password: '', // No password for OAuth users
              address: null,
              isEmailVerified: true, // Google already verified
              // Don't include image field - it doesn't exist in database yet
            },
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              password: true,
              address: true,
              isEmailVerified: true,
              createdAt: true,
              personalDetails: true,
              idDocument: true,
              proofOfAddress: true,
              selfie: true,
              vehicle: true,
              insurance: true,
              insuranceExpiryReminder: true,
              accountNumber: true,
              sortCode: true,
              deliveryPartnerAgreementAccepted: true,
              isOnline: true,
              latitude: true,
              longitude: true,
              lastLocationUpdate: true,
              // Exclude image field as it doesn't exist in database yet
            }
          });
        } catch (createError: any) {
          throw createError;
        }

        // Return with isNewUser flag. Google already verified the email (the
        // rider row is created with isEmailVerified: true), so no OTP is needed.
        // The rider still defaults to approvalStatus PENDING and stays blocked
        // from operational APIs by requireApprovedRider until an admin approves.
        const token = generateToken({
          id: rider.id,
          role: 'RIDER',
          email: rider.email
        });

        const response = {
          success: true,
          isNewUser: true,
          needsSetup: true,
          requiresOTPVerification: false, // Google-verified — no OTP needed
          user: {
            id: rider.id,
            email: rider.email,
            firstName: rider.firstName,
            lastName: rider.lastName,
            phone: rider.phone,
            role: 'RIDER',
          },
          token
        };
        
        return res.status(200).json(response);
      }

      // A verified Google login also confirms the email for an existing rider
      // that hadn't completed OTP verification.
      if (!rider.isEmailVerified) {
        await prisma.rider.update({
          where: { id: rider.id },
          data: { isEmailVerified: true },
        });
      }

      // Check if profile is complete (phone and address required)
      // Empty strings and null both mean incomplete
      const needsSetup = !rider.phone || rider.phone.trim() === '' || !rider.address || rider.address.trim() === '';

      // Generate JWT token with rider data (for existing users)
      const token = generateToken({
        id: rider.id,
        role: 'RIDER',
        email: rider.email
      });

      const response = {
        success: true,
        isNewUser: false,
        needsSetup: needsSetup,
        requiresOTPVerification: false,
        user: {
          id: rider.id,
          email: rider.email,
          firstName: rider.firstName,
          lastName: rider.lastName,
          phone: rider.phone,
          role: 'RIDER',
        }, 
        token 
      };
      
      return res.status(200).json(response);
    }

    // Handle USER role (default)
    // Check if user already exists
    let user = await prisma.user.findFirst({
      where: { email }
    });

    let isNewUser = false;
    let requiresOTPVerification = false;
    let needsSetup = false;

    if (!user) {
      // Google already verified the email, so create the account verified and
      // skip our OTP flow entirely.
      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: '', // No password for OAuth users
          role: "USER",
          phone: null,
          address: null,
          isEmailVerified: true, // Google verified the email
        },
      });

      isNewUser = true;
      requiresOTPVerification = false; // Google-verified — no OTP needed
      needsSetup = true;
    } else {
      // A verified Google login also confirms the email for an existing account
      // that hadn't completed OTP verification.
      if (!user.isEmailVerified) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { isEmailVerified: true },
        });
      }

      // Check if profile is complete (phone and address required)
      // Empty strings and null both mean incomplete
      needsSetup = !user.phone || (typeof user.phone === 'string' && user.phone.trim() === '') || !user.address || (typeof user.address === 'string' && user.address.trim() === '');
      isNewUser = false;
      requiresOTPVerification = false;
    }

    // Generate JWT token
    const token = generateToken({ id: user.id, role: user.role });

    // Return user data and token with flags
    const { password: _pw, ...userWithoutPassword } = user;
    
    res.status(200).json({ 
      success: true,
      isNewUser,
      needsSetup,
      requiresOTPVerification,
      user: userWithoutPassword, 
      token 
    });
  } catch (err: any) {
    res.status(500).json({ 
      success: false,
      message: "Google authentication failed", 
      error: err.message 
    });
  }
});

export default router;
