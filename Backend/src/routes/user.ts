import { Router } from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import prisma from "../config/db";
import { generateToken } from "../utils/jwt";
import { calculateOrderPricing } from "../utils/pricing";
import { notifyOrderPlaced } from "../utils/orderNotifications";
import { authenticate } from "../middlewares/auth";
import { uploadToR2, deleteFromR2 } from "../config/r2";
import { logger } from "../utils/logger";

const router = Router();

// Memory storage for the customer profile picture, uploaded to R2 like every
// other image in the app (restaurants, riders, menu items) rather than stored
// as a base64 blob in the DB.
const profileImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPEG, PNG, GIF, and WebP images are allowed"));
  },
}).single("image");

logger.debug("✅ auth.ts loaded");

// Ping route to test router
router.get("/ping", (req, res) => {
  res.send("Auth router working ✅");
});

// DEPRECATED — Google OAuth is handled exclusively by POST /api/oauth/google,
// which validates the authorization code with Google and trusts only Google's
// verified_email. This legacy endpoint trusted an email supplied in the request
// body and minted a JWT from it, allowing account takeover by anyone who knew a
// victim's email. It is intentionally disabled (410 Gone) rather than removed so
// any stale client gets a clear, non-silent failure instead of a 404.
router.post("/google", (_req, res) => {
  return res.status(410).json({
    message: "This endpoint has been removed. Use POST /api/oauth/google instead.",
  });
});

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !address) {
      return res.status(400).json({ message: "All fields including address are required" });
    }

    // Validate first name and last name (letters, hyphens, apostrophes, spaces allowed, min 2 chars)
    const nameRegex = /^[a-zA-Z]([a-zA-Z\s'-]*[a-zA-Z])?$/;
    if (!nameRegex.test(firstName) || firstName.length < 2) {
      return res.status(400).json({ message: "First name must contain at least 2 letters and may include hyphens, apostrophes, or spaces" });
    }
    if (!nameRegex.test(lastName) || lastName.length < 2) {
      return res.status(400).json({ message: "Last name must contain at least 2 letters and may include hyphens, apostrophes, or spaces" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address (e.g., user@example.com)" });
    }

    // Validate password strength (min 6 chars, at least 1 letter and 1 number)
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password must contain at least one letter and one number" });
    }

    // Validate phone if provided (optional but must be valid format)
    if (phone) {
      const phoneRegex = /^[0-9+\-\s()]{10,}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Please provide a valid phone number" });
      }
    }

    // Check if email or phone already exists
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, phone ? { phone } : {}] },
    });

    if (existing) {
      if (!existing.isEmailVerified) {
        // Unverified account — clean it up so the user can re-register
        await prisma.cartItem.deleteMany({ where: { userId: existing.id } });
        await prisma.address.deleteMany({ where: { userId: existing.id } });
        await prisma.user.delete({ where: { id: existing.id } });
      } else {
        if (existing.email === email) {
          return res.status(400).json({ message: "This email is already registered. Please use a different email or login." });
        }
        if (existing.phone === phone) {
          return res.status(400).json({ message: "This phone number is already registered" });
        }
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user with address
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(), // Store email in lowercase
        password: hashedPassword,
        phone: phone || null,
        role: "USER",
        otp,
        otpExpiry,
        isEmailVerified: false,
        addresses: {
          create: {
            street: address,
            city: "",
            state: "",
            zipCode: "",
            country: "United Kingdom",
            isDefault: true,
          }
        }
      },
    });

    // Send OTP email and admin notification
    try {
      const { sendOTPEmail, sendAdminSignupNotification } = await import('../config/email.config');
      
      // Send OTP to user
      await sendOTPEmail({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        otp,
        role: 'USER'
      });
      logger.debug('✅ OTP email sent to user');

      // Send notification to admin
      await sendAdminSignupNotification({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: 'USER'
      });
      logger.debug('✅ Admin notification sent');
    } catch (emailError) {
      logger.error('⚠️ Failed to send emails:', emailError);
      // Don't fail signup if email fails
    }

    // Return success without token (user needs to verify email first)
    const { password: _pw, otp: _otp, otpExpiry: _otpExpiry, ...userWithoutSensitive } = user;
    res.status(201).json({ 
      user: userWithoutSensitive, 
      message: "Signup successful! Please check your email for OTP verification.",
      requiresVerification: true
    });
  } catch (err: any) {
    logger.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    // Find user (case-insensitive email search)
    const user = await prisma.user.findFirst({ 
      where: { 
        email: {
          equals: email.toLowerCase(),
          mode: 'insensitive'
        }
      } 
    });
    
    if (!user) {
      return res.status(404).json({ message: "No account found with this email. Please check your email or sign up." });
    }

    // Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Incorrect password. Please try again." });
    }

    // Enforce email verification — matches restaurant/rider login. An unverified
    // account must never receive a JWT, otherwise OTP verification is bypassable.
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in. Check your inbox for the verification code.",
        requiresVerification: true,
        email: user.email,
      });
    }

    // Generate JWT
    const token = generateToken({ id: user.id, role: user.role });

  // Return only email and token for login
  res.json({ email: user.email, token });
  } catch (err) {
    logger.error("Login error:", err);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
});

// Protected: Get current user's profile
router.get("/profile", authenticate(["USER"]), async (req: any, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error: any) {
    logger.error("Error fetching profile:", error);
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
});

// Protected: Update current user's profile
router.put("/profile", authenticate(["USER"]), profileImageUpload, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email, phone, address } = req.body as {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string | null;
      address?: string | null;
    };

    // Image arrives as an uploaded file (req.file). An empty/"null" `image`
    // text field signals explicit removal.
    const removeImage = req.body.image === "" || req.body.image === "null";
    const hasImageChange = !!req.file || removeImage;

    if (!firstName && !lastName && !email && !phone && address === undefined && !hasImageChange) {
      return res.status(400).json({ message: "At least one field is required" });
    }

    // Validations
    const updates: any = {};
    const nameRegex = /^[a-zA-Z]{2,}$/;
    if (firstName !== undefined) {
      if (!firstName.trim() || !nameRegex.test(firstName)) {
        return res.status(400).json({ message: "First name must contain only letters and be at least 2 characters" });
      }
      updates.firstName = firstName.trim();
    }
    if (lastName !== undefined) {
      if (!lastName.trim() || !nameRegex.test(lastName)) {
        return res.status(400).json({ message: "Last name must contain only letters and be at least 2 characters" });
      }
      updates.lastName = lastName.trim();
    }
    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Please provide a valid email address" });
      }
      // Ensure email uniqueness (case-insensitive) excluding current user
      const existingEmail = await prisma.user.findFirst({
        where: { email: { equals: email.toLowerCase(), mode: 'insensitive' }, NOT: { id: userId } },
        select: { id: true },
      });
      if (existingEmail) {
        return res.status(400).json({ message: "This email is already registered" });
      }
      updates.email = email.toLowerCase();
    }
    if (phone !== undefined) {
      if (phone && !/^[0-9+\-\s()]{10,}$/.test(phone)) {
        return res.status(400).json({ message: "Please provide a valid phone number" });
      }
      // Ensure phone uniqueness excluding current user
      if (phone) {
        const existingPhone = await prisma.user.findFirst({
          where: { phone, NOT: { id: userId } },
          select: { id: true },
        });
        if (existingPhone) {
          return res.status(400).json({ message: "This phone number is already registered" });
        }
      }
      updates.phone = phone ?? null;
    }
    if (address !== undefined) {
      updates.address = address ?? null;
    }

    // Profile picture: upload to R2 and store the URL (matching restaurants,
    // riders, and menu items), or clear it. Any previous R2 object is deleted
    // so we don't leak orphaned files.
    if (hasImageChange) {
      const existing = await prisma.user.findUnique({
        where: { id: userId },
        select: { image: true },
      });
      if (existing?.image && existing.image.includes("r2.dev")) {
        await deleteFromR2(existing.image);
      }
      updates.image = req.file
        ? await uploadToR2(req.file.buffer, req.file.originalname, "user-profiles")
        : null;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updates,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({ user: updatedUser });
  } catch (error: any) {
    logger.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
});

// Protected: Complete user profile (after Google OAuth)
router.post("/complete-profile", authenticate(["USER"]), async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone, address } = req.body;

    if (!firstName || !lastName || !phone || !address) {
      return res.status(400).json({ message: "First name, last name, phone, and address are required" });
    }

    // Validate first name and last name (only letters, min 2 chars)
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    if (!nameRegex.test(firstName)) {
      return res.status(400).json({ message: "First name must contain only letters and be at least 2 characters" });
    }
    if (!nameRegex.test(lastName)) {
      return res.status(400).json({ message: "Last name must contain only letters and be at least 2 characters" });
    }

    // Validate phone number
    if (!/^[0-9+\-\s()]{10,}$/.test(phone)) {
      return res.status(400).json({ message: "Please provide a valid phone number" });
    }

    // Update user with profile data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        phone,
        address,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        role: true,
      },
    });

    logger.debug(`✅ User profile completed:`, updatedUser.email);

    res.status(200).json({
      success: true,
      message: "User profile completed successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    logger.error("Error completing user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user addresses
router.get("/addresses", authenticate(["USER"]), async (req: any, res) => {
  try {
    const userId = req.user.id;

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    // Format addresses for frontend
    const formattedAddresses = addresses.map(addr => ({
      id: addr.id,
      label: addr.isDefault ? "Home" : "Other",
      address: `${addr.street}${addr.city ? ', ' + addr.city : ''}${addr.state ? ', ' + addr.state : ''}${addr.zipCode ? ', ' + addr.zipCode : ''}`,
      details: addr.country,
      isDefault: addr.isDefault,
      createdAt: addr.createdAt,
    }));

    res.json({ addresses: formattedAddresses });
  } catch (error: any) {
    logger.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Failed to fetch addresses", error: error.message });
  }
});

// ============================================
// ORDER ENDPOINTS (Customer)
// ============================================

// POST - Create new order (Customer places order)
router.post("/orders", authenticate(["USER"]), async (req: any, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      restaurantId,
      items, // [{ menuItemId, quantity, price, name, title }]
      deliveryAddress,
      deliveryInstructions,
      paymentMethod,
      customerName,
      customerEmail,
      customerPhone,
      customerLatitude,
      customerLongitude,
    } = req.body;

    // Validate required fields
    if (!restaurantId || !items || items.length === 0 || !deliveryAddress || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // SECURITY: item prices are looked up server-side from the database and never
    // trusted from the client. calculateOrderPricing validates that every item
    // belongs to this restaurant and is available, and derives every fee/total
    // authoritatively so a tampered cart or edited localStorage cannot alter pricing.
    const pricingResult = await calculateOrderPricing({
      restaurantId,
      items,
      customerLatitude,
      customerLongitude,
    });

    if (!pricingResult.ok) {
      return res.status(pricingResult.status).json({ message: pricingResult.message });
    }

    const {
      subtotal,
      serviceFee,
      deliveryFee,
      restaurantPayout,
      platformRevenue,
      riderPayout,
      tip,
      amount,
      distanceKm,
      lineItems,
      restaurantName,
    } = pricingResult.pricing;

    // Generate unique order code
    const code = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Normalize the payment method. Card orders are created UNPAID — the client
    // can never mark an order paid. Only the Stripe webhook flips paymentStatus
    // to PAID after a verified payment_intent.succeeded event, and until then the
    // order is hidden from restaurants/riders.
    const normalizedPaymentMethod =
      String(paymentMethod).toUpperCase() === "CARD" ? "CARD" : "CASH";

    // Create order with items and location
    const order = await prisma.order.create({

      data: {
        code,
        customerId: userId,
        restaurantId,
        status: 'PENDING',
        paymentMethod: normalizedPaymentMethod,
        paymentStatus: 'PENDING',
        subTotal: subtotal,
        serviceFee: serviceFee,
        deliveryFee,
        tip,
        riderPayout,
        restaurantPayout,
        platformRevenue,
        amount,
        addressId: null,
        deliveryAddress: deliveryAddress,
        customerLatitude: customerLatitude || null,
        customerLongitude: customerLongitude || null,
        distanceKm: distanceKm,
        items: {
          create: lineItems.map((item) => ({
            title: item.title,
            qty: item.qty,
            unitPrice: item.unitPrice,
            total: item.total,
          }))
        }
      },
      include: {
        items: true,
        restaurant: {
          select: {
            id: true,
            name: true,
            slug: true,
            phone: true,
            address: true,
            image: true,
          }
        },
      }
    });

    // For CASH the order is live immediately, so notify the restaurant and email
    // the customer now. For CARD these side effects are deferred to the Stripe
    // webhook (after paymentStatus=PAID) so nobody is alerted about an order that
    // has not actually been paid for.
    if (normalizedPaymentMethod === "CASH") {
      await notifyOrderPlaced(order.id);
    }

    res.status(201).json({
      message: "Order placed successfully! 🎉",
      order 
    });
  } catch (error: any) {
    logger.error("Create order error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET - Get user's orders (Customer)
router.get("/orders", authenticate(["USER"]), async (req: any, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = await prisma.order.findMany({
      where: { customerId: userId },
      include: {
        items: true,
        restaurant: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            phone: true,
            address: true,
          }
        },
        rider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedOrders = orders.map(order => ({
      ...order,
      orderId: order.code,
      totalAmount: Number(order.amount),
      subTotal: Number(order.subTotal),
      deliveryFee: Number(order.deliveryFee),
      tip: Number(order.tip),
      deliveryAddress: (order as any).deliveryAddress,
    }));

    res.json({ orders: formattedOrders });
  } catch (error: any) {
    logger.error("Get orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - Get single order details (Customer)
router.get("/orders/:orderId", authenticate(["USER"]), async (req: any, res) => {
  try {
    const userId = req.user?.id;
    const { orderId } = req.params;

    const order = await prisma.order.findFirst({
      where: { 
        id: parseInt(orderId),
        customerId: userId 
      },
      include: {
        items: true,
        restaurant: {
          select: {
            id: true,
            name: true,
            slug: true,
            phone: true,
            address: true,
            image: true,
          }
        },
        address: true,
        rider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ order });
  } catch (error: any) {
    logger.error("Get order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;