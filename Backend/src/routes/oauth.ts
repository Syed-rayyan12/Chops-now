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

    console.log('🔑 OAuth Request Details:');
    console.log('- Role:', userRole);
    console.log('- Code (first 20 chars):', code.substring(0, 20) + '...');
    console.log('- Redirect URI:', redirectUri);
    console.log('- Client ID:', GOOGLE_CLIENT_ID?.substring(0, 20) + '...');

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
      console.error("❌ Google token exchange failed:");
      console.error('- Status:', tokenResponse.status);
      console.error('- Error:', tokens.error);
      console.error('- Description:', tokens.error_description);
      console.error('- Redirect URI used:', redirectUri);
      console.error('\n⚠️ Common causes:');
      console.error('1. Redirect URI mismatch (must match exactly in Google Console)');
      console.error('2. Authorization code already used or expired');
      console.error('3. Client ID/Secret mismatch');
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
        
        // OAuth users don't need OTP - Google already verified email
        restaurant = await prisma.restaurant.create({
          data: {
            name: restaurantName,
            slug,
            phone: '', // Will be updated in profile
            address: '', // Will be updated in profile
            ownerEmail: email,
            ownerFirstName: firstName,
            ownerLastName: lastName,
            isEmailVerified: true, // Google already verified
          },
        });

        console.log(`✅ New restaurant created via Google OAuth:`, restaurant.ownerEmail);

        // Return with isNewUser flag
        const token = jwt.sign({ 
          id: restaurant.id, 
          role: 'RESTAURANT',
          email: restaurant.ownerEmail 
        }, JWT_SECRET, { expiresIn: "7d" });

        const response = { 
          success: true,
          isNewUser: true,
          needsSetup: true, // New user needs to complete profile
          requiresOTPVerification: false, // Google already verified email
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
        
        console.log('🔍 Returning NEW RESTAURANT response:', JSON.stringify(response, null, 2));
        return res.status(200).json(response);
      } else {
        console.log(`✅ Existing restaurant logged in via Google:`, restaurant.ownerEmail);
      }

      // Check if profile is complete (phone and address required)
      const needsSetup = !restaurant.phone || !restaurant.address;
      console.log(`🔍 Existing restaurant login - phone: "${restaurant.phone}", address: "${restaurant.address}", needsSetup: ${needsSetup}`);

      // Generate JWT token with restaurant data (for existing users)
      const token = jwt.sign({ 
        id: restaurant.id, 
        role: 'RESTAURANT',
        email: restaurant.ownerEmail 
      }, JWT_SECRET, { expiresIn: "7d" });

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
      
      console.log('🔍 Returning EXISTING RESTAURANT response:', JSON.stringify(response, null, 2));
      return res.status(200).json(response);
    }

    if (userRole === "RIDER") {
      console.log('🔍 Processing RIDER OAuth...', { email, firstName, lastName });
      
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
        console.log('📝 Creating new rider with data:', {
          email,
          firstName,
          lastName,
          phone: '',
          password: '',
          address: null
        });
        
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

          console.log(`✅ New rider created via Google OAuth:`, rider.email);
        } catch (createError: any) {
          console.error('❌ Prisma error creating rider:', createError);
          console.error('❌ Error details:', {
            code: createError.code,
            meta: createError.meta,
            message: createError.message
          });
          throw createError;
        }

        // Return with isNewUser flag
        const token = jwt.sign({ 
          id: rider.id, 
          role: 'RIDER',
          email: rider.email 
        }, JWT_SECRET, { expiresIn: "7d" });

        const response = { 
          success: true,
          isNewUser: true,
          needsSetup: true, // New user needs to complete profile
          requiresOTPVerification: false, // Google already verified email
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
        
        console.log('🔍 Returning NEW RIDER response:', JSON.stringify(response, null, 2));
        return res.status(200).json(response);
      } else {
        console.log(`✅ Existing rider logged in via Google:`, rider.email);
      }

      // Check if profile is complete (phone and address required)
      const needsSetup = !rider.phone || !rider.address;
      console.log(`🔍 Existing rider login - phone: "${rider.phone}", address: "${rider.address}", needsSetup: ${needsSetup}`);

      // Generate JWT token with rider data (for existing users)
      const token = jwt.sign({ 
        id: rider.id, 
        role: 'RIDER',
        email: rider.email 
      }, JWT_SECRET, { expiresIn: "7d" });

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
      
      console.log('🔍 Returning EXISTING RIDER response:', JSON.stringify(response, null, 2));
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
      // OAuth users don't need OTP - Google already verified email
      
      // Create new user from Google data
      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: '', // No password for OAuth users
          role: "USER",
          phone: null,
          address: null,
          isEmailVerified: true, // Google already verified
        },
      });

      isNewUser = true;
      requiresOTPVerification = false; // Google already verified
      needsSetup = true; // New user needs to complete profile
      console.log(`✅ New USER created via Google OAuth:`, user.email);
    } else {
      console.log(`✅ Existing USER logged in via Google:`, user.email);
      // Check if profile is complete (phone and address required)
      needsSetup = !user.phone || !user.address;
      isNewUser = false;
      requiresOTPVerification = false;
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

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
    console.error("❌ Google OAuth error:", err);
    res.status(500).json({ 
      success: false,
      message: "Google authentication failed", 
      error: err.message 
    });
  }
});

export default router;
