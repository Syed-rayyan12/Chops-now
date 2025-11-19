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
      latitude,
      longitude,
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

    // Validate sort code if provided (UK format: 6 digits, optional dashes)
    if (sortCode) {
      // Remove any dashes or spaces
      const cleanedSortCode = sortCode.replace(/[-\s]/g, '')
      
      // Check if it's exactly 6 digits
      if (!/^\d{6}$/.test(cleanedSortCode)) {
        return res.status(400).json({ 
          message: "Sort code must be exactly 6 digits (format: XX-XX-XX)" 
        });
      }
      
      // Format as XX-XX-XX for storage
      const formattedSortCode = cleanedSortCode.replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3')
      
      // Update the sortCode value to formatted version
      req.body.sortCode = formattedSortCode
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
    
    // Use formatted sort code from validation
    const finalSortCode = req.body.sortCode || sortCode
    
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
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        idDocument,
        proofOfAddress,
        selfie,
        vehicle,
        insurance,
        insuranceExpiryReminder,
        accountNumber,
        sortCode: finalSortCode,
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

// GET - All riders (for restaurant to see available riders)
router.get("/all", async (_req: any, res: any) => {
  try {
    const riders = await prisma.rider.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        latitude: true,
        longitude: true,
        isOnline: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ riders });
  } catch (err: any) {
    console.error("Get all riders error:", err);
    res.status(500).json({ message: "Server error" });
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
        isOnline: true,
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

// GET - Rider earnings (today and this week)
router.get("/earnings", authenticate(["RIDER"]), async (req: any, res: any) => {
  try {
    const riderId = req.user.id;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Today's earnings
    const todayEarnings = await prisma.earning.aggregate({
      where: {
        riderId,
        date: { gte: todayStart }
      },
      _sum: { amount: true }
    });

    // This week's earnings
    const weeklyEarnings = await prisma.earning.aggregate({
      where: {
        riderId,
        date: { gte: weekStart }
      },
      _sum: { amount: true }
    });

    res.json({
      earnings: {
        today: Number(todayEarnings._sum.amount || 0),
        thisWeek: Number(weeklyEarnings._sum.amount || 0)
      }
    });
  } catch (error: any) {
    console.error("Get rider earnings error:", error);
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

// PATCH - Toggle online/offline status
router.patch("/toggle-online", authenticate(["RIDER"]), async (req: any, res: any) => {
  try {
    const riderId = req.user.id;
    const { isOnline } = req.body;

    // Validate input
    if (typeof isOnline !== 'boolean') {
      return res.status(400).json({ message: "isOnline must be a boolean" });
    }

    const updatedRider = await prisma.rider.update({
      where: { id: riderId },
      data: { isOnline },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isOnline: true,
      }
    });

    res.json({ 
      rider: updatedRider,
      message: isOnline ? "You are now online and available for orders" : "You are now offline"
    });
  } catch (error: any) {
    console.error("Toggle online status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================================
// UPDATE RIDER LOCATION
// ============================================
router.put("/location", authenticate(["RIDER"]), async (req: any, res: any) => {
  try {
    const riderId = req.user?.id;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    // Validate coordinates
    const { validateCoordinates } = await import('../utils/location');
    if (!validateCoordinates(latitude, longitude)) {
      return res.status(400).json({ message: "Invalid coordinates" });
    }

    const updatedRider = await prisma.rider.update({
      where: { id: riderId },
      data: {
        latitude,
        longitude,
        lastLocationUpdate: new Date()
      },
      select: {
        id: true,
        latitude: true,
        longitude: true,
        lastLocationUpdate: true,
      }
    });

    res.json({ 
      success: true,
      location: updatedRider
    });
  } catch (error: any) {
    console.error("Update location error:", error);
    res.status(500).json({ message: "Failed to update location" });
  }
});

// ============================================
// GET NEARBY ORDERS (within 5km of rider)
// ============================================
router.get("/nearby-orders", authenticate(["RIDER"]), async (req: any, res: any) => {
  try {
    const riderId = req.user?.id;

    // Get rider's current location
    const rider = await prisma.rider.findUnique({
      where: { id: riderId },
      select: { latitude: true, longitude: true, isOnline: true }
    });

    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    if (!rider.latitude || !rider.longitude) {
      return res.status(400).json({ 
        message: "Please enable location services to see nearby orders"
      });
    }

    // Get all available orders (READY_FOR_PICKUP status)
    const orders = await prisma.order.findMany({
      where: {
        status: 'READY_FOR_PICKUP',
        riderId: null // Not yet assigned
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            slug: true,
            address: true,
            latitude: true,
            longitude: true,
            phone: true,
          }
        },
        items: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          }
        }
      }
    });

    // Filter orders within 5km of rider
    const { filterByRadius } = await import('../utils/location');
    const nearbyOrders = filterByRadius(
      rider.latitude,
      rider.longitude,
      orders.map(order => ({
        ...order,
        latitude: order.restaurant.latitude,
        longitude: order.restaurant.longitude,
      })),
      5 // 5km radius
    );

    // Calculate distance for each order
    const { calculateDistance } = await import('../utils/location');
    const ordersWithDistance = nearbyOrders.map(order => ({
      ...order,
      distanceFromRider: calculateDistance(
        rider.latitude!,
        rider.longitude!,
        order.restaurant.latitude!,
        order.restaurant.longitude!
      )
    }));

    // Sort by distance (closest first)
    ordersWithDistance.sort((a, b) => a.distanceFromRider - b.distanceFromRider);

    res.json({ 
      orders: ordersWithDistance,
      riderLocation: {
        latitude: rider.latitude,
        longitude: rider.longitude
      }
    });
  } catch (error: any) {
    console.error("Get nearby orders error:", error);
    res.status(500).json({ message: "Failed to fetch nearby orders" });
  }
});

export default router;
