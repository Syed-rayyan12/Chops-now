import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

console.log("✅ auth.ts loaded");

// Ping route
router.get("/ping", (req, res) => {
  res.send("Auth router working ✅");
});

// Signup Route
router.post("/signup", async (req, res) => {
  try {

    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      personalDetails,
      address,
      idDocument,
      proofOfAddress,
      selfie,
      vehicle,
      insurance,
      insuranceExpiryReminder,
      accountNumber,
      sortCode,
      deliveryPartnerAgreementAccepted
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if email is already used
    const existingRider = await prisma.rider.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });
    if (existingRider) {
      return res.status(400).json({ message: "Email or phone already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create rider with only firstName/lastName (no legacy name field)
    const rider = await prisma.rider.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        personalDetails,
        address,
        idDocument,
        proofOfAddress,
        selfie,
        vehicle,
        insurance,
        insuranceExpiryReminder,
        accountNumber,
        sortCode,
        deliveryPartnerAgreementAccepted: !!deliveryPartnerAgreementAccepted,
      },
    });

    // Generate JWT
    const token = jwt.sign({ id: rider.id, role: "RIDER" }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ rider, token });
  } catch (err: any) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find rider
    const rider = await prisma.rider.findUnique({ where: { email } });

    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, rider.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT
    const token = jwt.sign({ id: rider.id, role: "RIDER" }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return minimal response: email and token
    res.json({ email: rider.email, token });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// GET - Rider profile (me)
router.get("/me", authenticate(["RIDER"]), async (req: any, res: any) => {
  try {
    const riderId = req.user.id;
  const rider = await prisma.rider.findUnique({
      where: { id: riderId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        vehicle: true,
        accountNumber: true,
        sortCode: true,
        idDocument: true,
        proofOfAddress: true,
        selfie: true,
        insurance: true,
        insuranceExpiryReminder: true,
        createdAt: true,
      },
    });

    if (!rider) return res.status(404).json({ message: "Rider not found" });

    res.json({ rider });
  } catch (err: any) {
    console.error("Get rider profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT - Update rider profile
router.put("/update-profile", authenticate(["RIDER"]), async (req: any, res: any) => {
  try {
    const riderId = req.user.id;
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      vehicle,
      accountNumber,
      sortCode
    } = req.body;

    const updatedRider = await prisma.rider.update({
      where: { id: riderId },
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        vehicle,
        accountNumber,
        sortCode
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        vehicle: true,
        accountNumber: true,
        sortCode: true,
        createdAt: true,
      }
    });

    res.json({ rider: updatedRider });
  } catch (err: any) {
    console.error("Update rider profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================================
// RIDER ORDER MANAGEMENT ENDPOINTS
// ============================================

// GET - Rider stats
router.get("/stats", authenticate(["RIDER"]), async (req: any, res: any) => {
  try {
    const riderId = req.user.id;

    const [activeOrders, completedOrders, totalEarningsResult] = await Promise.all([
      prisma.order.count({
        where: { riderId, status: 'PICKED_UP' }
      }),
      prisma.order.count({
        where: { riderId, status: 'DELIVERED' }
      }),
      prisma.earning.aggregate({
        where: { riderId },
        _sum: { amount: true }
      })
    ]);

    res.json({
      activeOrders,
      completedOrders,
      totalEarnings: Number(totalEarningsResult._sum.amount || 0)
    });
  } catch (error: any) {
    console.error("Get rider stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - Available orders (READY_FOR_PICKUP)
router.get("/orders/available", authenticate(["RIDER"]), async (_req: any, res: any) => {
  try {
    console.log("🔍 Fetching available orders (READY_FOR_PICKUP, riderId: null)");
    
    const orders = await prisma.order.findMany({
      where: {
        status: 'READY_FOR_PICKUP',
        riderId: null
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
          }
        },
        address: true,
        items: true,
        customer: {
          select: {
            phone: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`✅ Found ${orders.length} available orders for rider`);
    
    const formattedOrders = orders.map(order => ({
      id: order.id,
      code: order.code,
      status: order.status,
      subTotal: Number(order.subTotal),
      deliveryFee: Number(order.deliveryFee),
      tip: Number(order.tip),
      totalAmount: Number(order.amount),
      riderPayout: Number(order.riderPayout),
      distanceKm: order.distanceKm ? Number(order.distanceKm) : null,
      deliveryAddress: (order as any).deliveryAddress || (order.address ? `${order.address.street}, ${order.address.city}, ${order.address.zipCode}` : null),
      phone: order.customer?.phone || null,
      restaurant: order.restaurant,
      createdAt: order.createdAt.toISOString()
    }));

    res.json({ orders: formattedOrders });
  } catch (error: any) {
    console.error("Get available orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - Active orders (PICKED_UP by this rider)
router.get("/orders/active", authenticate(["RIDER"]), async (req: any, res: any) => {
  try {
    const riderId = req.user.id;

    const orders = await prisma.order.findMany({
      where: {
        riderId,
        status: 'PICKED_UP'
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
          }
        },
        address: true,
        items: true,
        customer: {
          select: {
            phone: true
          }
        }
      },
      orderBy: { pickedUpAt: 'desc' }
    });

    const formattedOrders = orders.map(order => ({
      id: order.id,
      code: order.code,
      status: order.status,
      subTotal: Number(order.subTotal),
      deliveryFee: Number(order.deliveryFee),
      tip: Number(order.tip),
      totalAmount: Number(order.amount),
      riderPayout: Number(order.riderPayout),
      distanceKm: order.distanceKm ? Number(order.distanceKm) : null,
      deliveryAddress: (order as any).deliveryAddress || (order.address ? `${order.address.street}, ${order.address.city}, ${order.address.zipCode}` : null),
      phone: order.customer?.phone || null,
      restaurant: order.restaurant,
      createdAt: order.createdAt.toISOString(),
      pickedUpAt: order.pickedUpAt?.toISOString()
    }));

    res.json({ orders: formattedOrders });
  } catch (error: any) {
    console.error("Get active orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - Completed orders
router.get("/orders/completed", authenticate(["RIDER"]), async (req: any, res: any) => {
  try {
    const riderId = req.user.id;

    const orders = await prisma.order.findMany({
      where: {
        riderId,
        status: 'DELIVERED'
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
          }
        }
      },
      orderBy: { deliveredAt: 'desc' },
      take: 20
    });

    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderId: order.code, // Use code as orderId (e.g., "ORD-001")
      code: order.code,
      status: order.status,
      amount: Number(order.amount),
      subTotal: Number(order.subTotal),
      deliveryFee: Number(order.deliveryFee),
      tip: Number(order.tip),
      riderPayout: Number(order.riderPayout),
      distanceKm: order.distanceKm ? Number(order.distanceKm) : null,
      deliveryAddress: (order as any).deliveryAddress,
      restaurant: order.restaurant,
      createdAt: order.createdAt.toISOString(),
      assignedAt: order.assignedAt?.toISOString(),
      pickedUpAt: order.pickedUpAt?.toISOString(),
      deliveredAt: order.deliveredAt?.toISOString()
    }));

    res.json({ orders: formattedOrders });
  } catch (error: any) {
    console.error("Get completed orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH - Accept delivery (READY_FOR_PICKUP → PICKED_UP)
router.patch("/orders/:orderId/accept", authenticate(["RIDER"]), async (req: any, res: any) => {
  try {
    const { orderId } = req.params;
    const riderId = req.user.id;

    // Load order and validate
    const order = await prisma.order.findUnique({ where: { id: parseInt(orderId) } });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== 'READY_FOR_PICKUP') {
      return res.status(400).json({ message: "Order is not ready for pickup" });
    }

    if (order.riderId && order.riderId !== riderId) {
      return res.status(400).json({ message: "Order already assigned to another rider" });
    }

    // Calculate rider payout (80% of delivery fee)
    const riderPayout = Number(order.deliveryFee) * 0.8;

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        riderId,
        status: 'PICKED_UP',
        riderPayout,
        pickedUpAt: new Date(),
        assignedAt: new Date()
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
          }
        },
        items: true,
        customer: {
          select: {
            phone: true
          }
        }
      }
    });

    res.json({ order: updatedOrder });
  } catch (error: any) {
    console.error("Accept delivery error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH - Mark delivered (PICKED_UP → DELIVERED)
router.patch("/orders/:orderId/deliver", authenticate(["RIDER"]), async (req: any, res: any) => {
  try {
    const { orderId } = req.params;
    const riderId = req.user.id;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) }
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.riderId !== riderId) {
      return res.status(403).json({ message: "Not authorized to deliver this order" });
    }

    if (order.status !== 'PICKED_UP') {
      return res.status(400).json({ message: "Order must be picked up before delivery" });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        status: 'DELIVERED',
        deliveredAt: new Date()
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
          }
        },
        address: true,
      }
    });

    // Create earning record
    await prisma.earning.create({
      data: {
        riderId,
        orderId: parseInt(orderId),
        amount: order.riderPayout,
        date: new Date()
      }
    });

    res.json({ order: updatedOrder });
  } catch (error: any) {
    console.error("Mark delivered error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - Recent activity
router.get("/activity/recent", authenticate(["RIDER"]), async (req: any, res: any) => {
  try {
    const riderId = req.user.id;

    const recentOrders = await prisma.order.findMany({
      where: {
        riderId,
        status: 'DELIVERED'
      },
      include: {
        restaurant: {
          select: {
            name: true
          }
        }
      },
      orderBy: { deliveredAt: 'desc' },
      take: 10
    });

    const activities = recentOrders.map(order => ({
      id: order.id,
      orderCode: order.code,
      status: order.status,
      restaurantName: order.restaurant.name,
      amount: Number(order.riderPayout),
      deliveredAt: order.deliveredAt?.toISOString() || new Date().toISOString()
    }));

    res.json({ activities });
  } catch (error: any) {
    console.error("Get recent activity error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
