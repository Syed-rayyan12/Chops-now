import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/db";
import jwt from "jsonwebtoken";
import { authenticate } from "../middlewares/auth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

console.log("✅ auth.ts loaded");

// Ping route to test router
router.get("/ping", (req, res) => {
  res.send("Auth router working ✅");
});

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !address) {
      return res.status(400).json({ message: "All fields including address are required" });
    }

    // Validate first name and last name (only letters, min 2 chars)
    const nameRegex = /^[a-zA-Z]{2,}$/;
    if (!nameRegex.test(firstName)) {
      return res.status(400).json({ message: "First name must contain only letters and be at least 2 characters" });
    }
    if (!nameRegex.test(lastName)) {
      return res.status(400).json({ message: "Last name must contain only letters and be at least 2 characters" });
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
      if (existing.email === email) {
        return res.status(400).json({ message: "This email is already registered. Please use a different email or login." });
      }
      if (existing.phone === phone) {
        return res.status(400).json({ message: "This phone number is already registered" });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(), // Store email in lowercase
        password: hashedPassword,
        phone: phone || null,
        role: "USER",
      },
    });

  // Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    // Return full user (without password) and token
    const { password: _pw, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (err: any) {
    console.error("Signup error:", err);
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

    // Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

  // Return only email and token for login
  res.json({ email: user.email, token });
  } catch (err) {
    console.error("Login error:", err);
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
        role: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
});

// Protected: Update current user's profile
router.put("/profile", authenticate(["USER"]), async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email, phone } = req.body as {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string | null;
    };

    if (!firstName && !lastName && !email && !phone) {
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

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updates,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({ user: updatedUser });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
});

// Minimal addresses mock to keep profile Addresses tab working
router.get("/addresses", authenticate(["USER"]), async (req: any, res) => {
  try {
    const mockAddresses = [
      {
        id: 1,
        label: "Home",
        address: "123 Main Street, Apt 4B, Downtown",
        details: "Ring doorbell twice",
        isDefault: true,
        createdAt: new Date(),
      },
      {
        id: 2,
        label: "Work",
        address: "456 Business Ave, Suite 200, Business District",
        details: "Leave with reception",
        isDefault: false,
        createdAt: new Date(),
      },
    ];
    res.json({ addresses: mockAddresses });
  } catch (error: any) {
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
    } = req.body;

    // Validate required fields
    if (!restaurantId || !items || items.length === 0 || !deliveryAddress || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    
    // Get restaurant delivery fee
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { deliveryFee: true }
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const deliveryFee = restaurant.deliveryFee || 2.50; // Default £2.50 if not set
    const tip = 0; // Can be added from frontend
    const riderPayout = 0; // Will be calculated when assigned to rider
    const amount = subtotal + deliveryFee;

    // Generate unique order code
    const code = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create order with items
    const order = await prisma.order.create({
      
      data: {
        code,
        customerId: userId,
        restaurantId,
        status: 'PENDING',
        subTotal: subtotal,
        deliveryFee,
        tip,
        riderPayout,
        amount,
        addressId: null,
        deliveryAddress: deliveryAddress,
        items: {
          create: items.map((item: any) => ({
            title: item.title || item.name,
            qty: item.quantity,
            unitPrice: item.price,
            total: item.price * item.quantity,
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

    res.status(201).json({ 
      message: "Order placed successfully! 🎉",
      order 
    });
  } catch (error: any) {
    console.error("Create order error:", error);
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
    console.error("Get orders error:", error);
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
    console.error("Get order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;