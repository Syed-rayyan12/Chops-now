import { Router } from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import prisma from "../config/db";
import { authenticate } from "../middlewares/auth";
import { logger } from "../utils/logger";
import { PAID_OR_NON_CARD } from "../utils/orderVisibility";
import { pctChangeLabel, monthWindows } from "../utils/metrics";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Admin accounts live in the database only (no hardcoded credentials).
    const admin = await prisma.user.findUnique({
      where: { email },
    });

    if (!admin || admin.role !== "ADMIN") {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Admin tokens are short-lived (12h vs the 7d default). Combined with the
    // per-request DB re-check in `authenticate`, this limits how long a deleted
    // or downgraded admin's token keeps working.
    const token = generateToken({ email: admin.email, role: "ADMIN", id: admin.id }, "12h");
    res.json({
      token,
      user: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users for admin panel with optional search and status filtering
router.get("/users", authenticate(["ADMIN"]), async (req, res) => {
  try {
    const { search, status } = req.query;

    const where: any = {
      role: "USER" // Only fetch users with role "USER", not restaurant owners
    };

    // Remove status filter since User model doesn't have status field
    // if (status && typeof status === 'string' && status !== "all") {
    //   where.status = status.toUpperCase();
    // }

    if (search && typeof search === 'string') {
      const searchNum = parseInt(search);
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        ...(isNaN(searchNum) ? [] : [{ id: searchNum }]),
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        customerOrders: {
          select: {
            amount: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            customerOrders: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform data to match frontend expectations
    const transformedUsers = users.map((user: any) => {
      // Calculate total spent from all orders
      const totalSpent = user.customerOrders.reduce((sum: number, order: any) => {
        return sum + (parseFloat(order.amount?.toString() || '0'));
      }, 0);

      // Calculate average order value
      const averageOrder = user._count.customerOrders > 0 
        ? totalSpent / user._count.customerOrders 
        : 0;

      // Get last order date
      const lastOrderDate = user.customerOrders.length > 0
        ? new Date(Math.max(...user.customerOrders.map((o: any) => new Date(o.createdAt).getTime())))
        : user.createdAt;

      return {
        id: `USR-${user.id.toString().padStart(3, '0')}`,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || "",
        status: "active", // Default status since User model doesn't have status field
        joinDate: user.createdAt.toISOString().split('T')[0],
        totalOrders: user._count.customerOrders,
        totalSpent: parseFloat(totalSpent.toFixed(2)),
        averageOrder: parseFloat(averageOrder.toFixed(2)),
        lastOrder: lastOrderDate.toISOString().split('T')[0],
        favoriteRestaurant: "N/A",
        avatar: null,
      };
    });

    res.json(transformedUsers);
  } catch (error) {
    logger.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Get orders for a specific user
router.get("/users/:userId/orders", authenticate(["ADMIN"]), async (req, res) => {
  try {
    const { userId } = req.params;
    logger.debug("Fetching orders for userId:", userId);
    
    // Extract numeric ID from USR-XXX format
    const numericId = parseInt(userId.replace('USR-', ''));
    logger.debug("Extracted numericId:", numericId);
    
    if (isNaN(numericId)) {
      logger.error("Invalid user ID format:", userId);
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const orders = await prisma.order.findMany({
      where: {
        customerId: numericId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        code: true,
        amount: true,
        subTotal: true,
        deliveryFee: true,
        tip: true,
        status: true,
        createdAt: true,
        deliveryAddress: true,
        restaurant: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
          },
        },
        items: {
          select: {
            id: true,
            title: true,
            qty: true,
            unitPrice: true,
            total: true,
          },
        },
      },
      take: 20, // Limit to last 20 orders
    });

    const transformedOrders = orders.map((order: any) => ({
      id: order.code,
      restaurant: order.restaurant.name,
      restaurantImage: order.restaurant.image,
      items: order.items.map((item: any) => item.title),
      amount: parseFloat(order.amount?.toString() || '0'),
      status: order.status.toLowerCase(),
      date: order.createdAt.toISOString().split('T')[0],
      time: new Date(order.createdAt).toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    }));

    res.json(transformedOrders);
  } catch (error) {
    logger.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
});

// Get orders for a specific restaurant
router.get("/restaurants/:restaurantId/orders", authenticate(["ADMIN"]), async (req, res) => {
  try {
    const { restaurantId } = req.params;
    logger.debug("=== Restaurant Orders Request ===");
    logger.debug("Raw restaurantId from URL:", restaurantId);
    
    if (!restaurantId || restaurantId === 'undefined' || restaurantId === 'null') {
      logger.error("Restaurant ID is missing or invalid");
      return res.status(400).json({ message: "Restaurant ID is required" });
    }
    
    // Try multiple parsing strategies
    let numericId: number;
    
    // Strategy 1: Check if it's already a number
    if (!isNaN(Number(restaurantId))) {
      numericId = Number(restaurantId);
      logger.debug("Strategy 1 (direct number):", numericId);
    } 
    // Strategy 2: Remove common prefixes
    else if (restaurantId.match(/^(REST-|RES-|RESTAURANT-)/i)) {
      const cleanId = restaurantId.replace(/^(REST-|RES-|RESTAURANT-)/i, '').trim();
      numericId = parseInt(cleanId, 10);
      logger.debug("Strategy 2 (removed prefix):", cleanId, "=>", numericId);
    }
    // Strategy 3: Extract any numbers from the string
    else {
      const matches = restaurantId.match(/\d+/);
      if (matches) {
        numericId = parseInt(matches[0], 10);
        logger.debug("Strategy 3 (extracted number):", matches[0], "=>", numericId);
      } else {
        logger.error("Could not extract number from:", restaurantId);
        return res.status(400).json({ 
          message: `Invalid restaurant ID format: ${restaurantId}`,
        });
      }
    }
    
    if (isNaN(numericId) || numericId <= 0) {
      logger.error("Final parsed ID is invalid:", numericId);
      return res.status(400).json({ 
        message: `Invalid restaurant ID: could not parse ${restaurantId}`,
      });
    }
    
    logger.debug("Final numeric ID to query:", numericId);

    const orders = await prisma.order.findMany({
      where: {
        restaurantId: numericId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        code: true,
        amount: true,
        subTotal: true,
        deliveryFee: true,
        tip: true,
        status: true,
        createdAt: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        items: {
          select: {
            id: true,
            title: true,
            qty: true,
            unitPrice: true,
            total: true,
          },
        },
      },
      take: 20, // Limit to last 20 orders
    });

    const transformedOrders = orders.map((order: any) => ({
      id: order.code,
      customerName: `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || 'Guest',
      itemCount: order.items?.length || 0,
      items: order.items?.map((item: any) => item.title) || [],
      amount: parseFloat(order.amount?.toString() || '0'),
      status: order.status.toLowerCase(),
      date: order.createdAt.toISOString().split('T')[0],
      time: new Date(order.createdAt).toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    }));

    res.json(transformedOrders);
  } catch (error) {
    logger.error("Error fetching restaurant orders:", error);
    res.status(500).json({ message: "Failed to fetch restaurant orders" });
  }
});

router.get("/restaurants", authenticate(["ADMIN"]), async (req, res) => {
  try {
    const { search, status } = req.query;

    const where: any = {};

    // Restaurant model doesn't have status field
    // if (status && typeof status === 'string' && status !== "all") {
    //   where.status = status.toUpperCase();
    // }

    if (search && typeof search === 'string') {
      const searchNum = parseInt(search);
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        ...(isNaN(searchNum) ? [] : [{ id: searchNum }]),
      ];
    }

    const restaurants = await prisma.restaurant.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        phone: true,
        address: true,
        createdAt: true,
        ownerEmail: true,
        ownerFirstName: true,
        ownerLastName: true,
        cuisineType: true,
        deliveryTime: true,
        description: true,
        image: true,
        minimumOrder: true,
        rating: true,
        orders: {
          select: {
            amount: true,
            status: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform data to match frontend expectations
    const transformedRestaurants = restaurants.map((restaurant: any) => {
      // Calculate total revenue from completed orders
      const totalRevenue = restaurant.orders.reduce((sum: number, order: any) => {
        // Only count completed/delivered orders for revenue
        if (order.status === 'DELIVERED' || order.status === 'COMPLETED') {
          return sum + (parseFloat(order.amount?.toString() || '0'));
        }
        return sum;
      }, 0);

      return {
        id: `REST-${restaurant.id.toString().padStart(3, '0')}`,
        name: restaurant.name,
        slug: restaurant.slug,
        cuisine: restaurant.cuisineType || "General",
        address: restaurant.address,
        phone: restaurant.phone,
        email: restaurant.ownerEmail,
        status: "active", // Default status since Restaurant model doesn't have status field
        rating: parseFloat(restaurant.rating.toString()) || 4.5,
        totalOrders: restaurant._count.orders,
        revenue: parseFloat(totalRevenue.toFixed(2)), // Calculated from completed orders
        joinDate: restaurant.createdAt.toISOString().split('T')[0],
        deliveryTime: restaurant.deliveryTime,
        commission: 15, // Placeholder
        image: restaurant.image || "/restaurant-placeholder.png",
        description: restaurant.description || `Restaurant owned by ${restaurant.ownerFirstName} ${restaurant.ownerLastName}`.trim(),
        openingHours: "11:00 AM - 10:00 PM", // Placeholder
        minimumOrder: parseFloat(restaurant.minimumOrder.toString()) || 15.0,
      };
    });

    res.json(transformedRestaurants);
  } catch (error) {
    logger.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
});

// Get dashboard overview stats
router.get("/stats", authenticate(["ADMIN"]), async (req, res) => {
  try {
    const now = new Date();
    const { monthStart, lastMonthStart, lastMonthEnd } = monthWindows(now);

    // ---- Headline lifetime totals ----
    const totalOrders = await prisma.order.count();
    const activeRestaurants = await prisma.restaurant.count({
      where: { deletedAt: null },
    });
    const totalUsers = await prisma.user.count({
      where: { role: "USER" },
    });

    // Total revenue from all LIVE orders. Same rule as /analytics: count cash/
    // non-card orders plus Stripe-confirmed card orders (PAID_OR_NON_CARD), so
    // unpaid/failed card attempts (created as PENDING/FAILED) aren't counted as
    // revenue. Keeps this KPI consistent with the analytics Total Revenue.
    const liveOrders = await prisma.order.findMany({
      where: { ...PAID_OR_NON_CARD },
      select: { amount: true },
    });
    const totalRevenue = liveOrders.reduce((sum, order) => sum + Number(order.amount), 0);

    // ---- Month-over-month deltas (this month vs last month) ----
    // Headline numbers above are lifetime totals; these compare this month to last.
    const sumAmounts = (orders: { amount: any }[]) =>
      orders.reduce((sum, o) => sum + Number(o.amount), 0);

    const [thisMonthRevenueOrders, lastMonthRevenueOrders] = await Promise.all([
      prisma.order.findMany({ where: { createdAt: { gte: monthStart }, ...PAID_OR_NON_CARD }, select: { amount: true } }),
      prisma.order.findMany({ where: { createdAt: { gte: lastMonthStart, lt: lastMonthEnd }, ...PAID_OR_NON_CARD }, select: { amount: true } }),
    ]);
    const revenueChange = pctChangeLabel(sumAmounts(thisMonthRevenueOrders), sumAmounts(lastMonthRevenueOrders));

    const [thisMonthOrders, lastMonthOrders] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: monthStart } } }),
      prisma.order.count({ where: { createdAt: { gte: lastMonthStart, lt: lastMonthEnd } } }),
    ]);
    const ordersChange = pctChangeLabel(thisMonthOrders, lastMonthOrders);

    const [thisMonthUsers, lastMonthUsers] = await Promise.all([
      prisma.user.count({ where: { role: "USER", createdAt: { gte: monthStart } } }),
      prisma.user.count({ where: { role: "USER", createdAt: { gte: lastMonthStart, lt: lastMonthEnd } } }),
    ]);
    const usersChange = pctChangeLabel(thisMonthUsers, lastMonthUsers);

    const [thisMonthRestaurants, lastMonthRestaurants] = await Promise.all([
      prisma.restaurant.count({ where: { deletedAt: null, createdAt: { gte: monthStart } } }),
      prisma.restaurant.count({ where: { deletedAt: null, createdAt: { gte: lastMonthStart, lt: lastMonthEnd } } }),
    ]);
    const restaurantsChange = pctChangeLabel(thisMonthRestaurants, lastMonthRestaurants);

    res.json({
      totalOrders,
      ordersChange,
      activeRestaurants,
      restaurantsChange,
      totalUsers,
      usersChange,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      revenueChange,
    });
  } catch (error) {
    logger.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
});

// Get recent orders for admin dashboard
router.get("/recent-orders", authenticate(["ADMIN"]), async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const recentOrders = await prisma.order.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        code: true,
        amount: true,
        status: true,
        createdAt: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        items: {
          select: {
            id: true,
            title: true,
            qty: true,
            unitPrice: true,
            total: true,
          },
        },
      },
    });

    // Transform to match frontend expectations
    const transformedOrders = recentOrders.map((order: any) => ({
      id: order.code,
      orderId: order.code,
      customer: `${order.customer.firstName} ${order.customer.lastName}`,
      customerEmail: order.customer.email,
      restaurant: order.restaurant.name,
      restaurantSlug: order.restaurant.slug,
      amount: parseFloat(order.amount.toString()),
      status: order.status.toLowerCase(),
      items: order.items.length,
      time: order.createdAt.toISOString(),
      date: order.createdAt.toISOString().split('T')[0],
    }));

    res.json(transformedOrders);
  } catch (error) {
    logger.error("Error fetching recent orders:", error);
    res.status(500).json({ message: "Failed to fetch recent orders" });
  }
});

// Get all orders for admin order management with stats, search, and filtering
router.get("/orders", authenticate(["ADMIN"]), async (req, res) => {
  try {
    const { search, status, sortBy = "createdAt", sortOrder = "desc" } = req.query;

    const where: any = {};

    // Status filter
    if (status && typeof status === 'string' && status !== "all") {
      where.status = status.toUpperCase();
    }

    // Search filter
    if (search && typeof search === 'string') {
      const searchNum = parseInt(search);
      where.OR = [
        { code: { contains: search, mode: "insensitive" } },
        { customer: { firstName: { contains: search, mode: "insensitive" } } },
        { customer: { lastName: { contains: search, mode: "insensitive" } } },
        { customer: { email: { contains: search, mode: "insensitive" } } },
        { restaurant: { name: { contains: search, mode: "insensitive" } } },
        ...(isNaN(searchNum) ? [] : [{ id: searchNum }]),
      ];
    }

    // Fetch all orders with filters
    const orders = await prisma.order.findMany({
      where,
      orderBy: {
        [sortBy as string]: sortOrder,
      },
      select: {
        id: true,
        code: true,
        amount: true,
        subTotal: true,
        deliveryFee: true,
        tip: true,
        status: true,
        createdAt: true,
        deliveryAddress: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            slug: true,
            address: true,
            phone: true,
          },
        },
        rider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        items: {
          select: {
            id: true,
            title: true,
            qty: true,
            unitPrice: true,
            total: true,
          },
        },
      },
    });

    // Calculate stats
    const stats = {
      total: orders.length,
      pending: orders.filter((o) => o.status === "PENDING").length,
      preparing: orders.filter((o) => o.status === "PREPARING").length,
      ready_for_pickup: orders.filter((o) => o.status === "READY_FOR_PICKUP").length,
      picked_up: orders.filter((o) => o.status === "PICKED_UP").length,
      out_for_delivery: orders.filter((o) => o.status === "PICKED_UP").length, // Same as picked_up
      delivered: orders.filter((o) => o.status === "DELIVERED").length,
      cancelled: orders.filter((o) => o.status === "CANCELLED").length,
    };

    // Transform orders
    const transformedOrders = orders.map((order: any) => ({
      id: order.code,
      orderId: order.code,
      customer: `${order.customer.firstName} ${order.customer.lastName}`,
      customerEmail: order.customer.email,
      customerPhone: order.customer.phone || "",
      restaurant: order.restaurant.name,
      restaurantSlug: order.restaurant.slug,
      restaurantAddress: order.restaurant.address,
      restaurantPhone: order.restaurant.phone,
      rider: order.rider ? `${order.rider.firstName} ${order.rider.lastName}` : "Not Assigned",
      riderPhone: order.rider?.phone || "",
      amount: parseFloat(order.amount.toString()),
      subTotal: parseFloat(order.subTotal.toString()),
      deliveryFee: parseFloat(order.deliveryFee.toString()),
      tip: parseFloat(order.tip.toString()),
      status: order.status.toLowerCase(),
      deliveryAddress: order.deliveryAddress || "N/A",
      items: order.items.map((item: any) => ({
        id: item.id,
        title: item.title,
        qty: item.qty,
        unitPrice: parseFloat(item.unitPrice.toString()),
        total: parseFloat(item.total.toString()),
      })),
      itemsCount: order.items.length,
      time: order.createdAt.toISOString(),
      date: order.createdAt.toISOString().split('T')[0],
    }));

    res.json({
      orders: transformedOrders,
      stats,
    });
  } catch (error) {
    logger.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Get all riders for admin panel with optional search and status filtering
router.get("/riders", authenticate(["ADMIN"]), async (req, res) => {
  try {
    const { search, status } = req.query;

    const where: any = {};

    if (search && typeof search === 'string') {
      const searchNum = parseInt(search);
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        ...(isNaN(searchNum) ? [] : [{ id: searchNum }]),
      ];
    }

    const riders = await prisma.rider.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        isOnline: true,
        approvalStatus: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get order stats for each rider
    const transformedRiders = await Promise.all(riders.map(async (rider: any) => {
      // Get all orders for this rider
      const orders = await prisma.order.findMany({
        where: { riderId: rider.id },
        select: {
          status: true,
          riderPayout: true,
          createdAt: true,
          deliveredAt: true,
        },
      });

      // Calculate total earnings from completed deliveries
      const totalEarnings = orders
        .filter((order: any) => order.status === "DELIVERED")
        .reduce((sum: number, order: any) => {
          return sum + (parseFloat(order.riderPayout?.toString() || '0'));
        }, 0);

      // Determine rider status based on isOnline and active orders
      let riderStatus = "offline"; // Default
      
      if (rider.isOnline) {
        // Check if rider has any active orders (PICKED_UP status)
        const hasActiveOrder = orders.some((o: any) => o.status === "PICKED_UP");
        riderStatus = hasActiveOrder ? "busy" : "online";
      }

      // Filter by status if provided
      if (status && typeof status === 'string' && status !== "all" && riderStatus !== status) {
        return null;
      }

      return {
        id: `RDR-${rider.id.toString().padStart(3, '0')}`,
        name: `${rider.firstName} ${rider.lastName}`,
        email: rider.email,
        phone: rider.phone || "N/A",
        status: riderStatus,
        approvalStatus: rider.approvalStatus,
        joinDate: rider.createdAt.toISOString().split('T')[0],
        totalDeliveries: orders.filter((o: any) => o.status === "DELIVERED").length,
        earnings: totalEarnings,
        lastDelivery: "N/A",
        avatar: null,
      };
    }));

    // Remove null entries from status filtering
    const filteredRiders = transformedRiders.filter(Boolean);

    res.json(filteredRiders);
  } catch (error) {
    logger.error("Error fetching riders:", error);
    res.status(500).json({ message: "Failed to fetch riders" });
  }
});

// GET single rider details for admin panel
router.get("/riders/:id", authenticate(["ADMIN"]), async (req, res) => {
  try {
    const { id } = req.params;

    // Extract numeric ID from RDR-XXX format
    const numericId = parseInt(id.replace("RDR-", ""));
    if (isNaN(numericId)) {
      return res.status(400).json({ message: "Invalid rider ID" });
    }

    const rider = await prisma.rider.findUnique({
      where: { id: numericId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        vehicle: true,
        insurance: true,
        insuranceExpiryReminder: true,
        accountNumber: true,
        sortCode: true,
        idDocument: true,
        proofOfAddress: true,
        selfie: true,
        image: true,
        isOnline: true,
        isEmailVerified: true,
        approvalStatus: true,
        deliveryPartnerAgreementAccepted: true,
        latitude: true,
        longitude: true,
        lastLocationUpdate: true,
        createdAt: true,
      },
    });

    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    // Get order stats
    const orders = await prisma.order.findMany({
      where: { riderId: numericId },
      select: {
        id: true,
        code: true,
        status: true,
        amount: true,
        riderPayout: true,
        deliveryFee: true,
        tip: true,
        createdAt: true,
        deliveredAt: true,
        restaurant: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const deliveredOrders = orders.filter((o) => o.status === "DELIVERED");
    const totalEarnings = deliveredOrders.reduce(
      (sum, o) => sum + parseFloat(o.riderPayout?.toString() || "0"),
      0
    );

    // Get ratings
    const ratings = await prisma.rating.findMany({
      where: { riderId: numericId },
      select: { score: true, comment: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
        : 0;

    // Online sessions
    const onlineSessions = await prisma.riderOnlineSession.findMany({
      where: { riderId: numericId },
      orderBy: { startedAt: "desc" },
      take: 10,
    });

    // Determine status
    let status = "offline";
    if (rider.isOnline) {
      const hasActiveOrder = orders.some((o) => o.status === "PICKED_UP");
      status = hasActiveOrder ? "busy" : "online";
    }

    res.json({
      rider: {
        id: `RDR-${rider.id.toString().padStart(3, "0")}`,
        numericId: rider.id,
        firstName: rider.firstName,
        lastName: rider.lastName,
        name: `${rider.firstName} ${rider.lastName}`,
        email: rider.email,
        phone: rider.phone || "N/A",
        address: rider.address || "N/A",
        vehicle: rider.vehicle || "N/A",
        insurance: rider.insurance || null,
        insuranceExpiryReminder: rider.insuranceExpiryReminder || null,
        accountNumber: rider.accountNumber ? `****${rider.accountNumber.slice(-4)}` : "N/A",
        sortCode: rider.sortCode || "N/A",
        idDocument: rider.idDocument || null,
        proofOfAddress: rider.proofOfAddress || null,
        selfie: rider.selfie || null,
        image: rider.image || null,
        isOnline: rider.isOnline,
        isEmailVerified: rider.isEmailVerified,
        approvalStatus: rider.approvalStatus,
        deliveryPartnerAgreementAccepted: rider.deliveryPartnerAgreementAccepted,
        latitude: rider.latitude,
        longitude: rider.longitude,
        lastLocationUpdate: rider.lastLocationUpdate,
        status,
        joinDate: rider.createdAt.toISOString().split("T")[0],
        createdAt: rider.createdAt.toISOString(),
        stats: {
          totalDeliveries: deliveredOrders.length,
          totalOrders: orders.length,
          totalEarnings: parseFloat(totalEarnings.toFixed(2)),
          avgRating: parseFloat(avgRating.toFixed(1)),
          totalRatings: ratings.length,
        },
        recentOrders: orders.slice(0, 10).map((o) => ({
          id: o.id,
          code: o.code,
          status: o.status,
          amount: parseFloat(o.amount?.toString() || "0"),
          riderPayout: parseFloat(o.riderPayout?.toString() || "0"),
          deliveryFee: parseFloat(o.deliveryFee?.toString() || "0"),
          tip: parseFloat(o.tip?.toString() || "0"),
          restaurant: o.restaurant?.name || "N/A",
          createdAt: o.createdAt.toISOString(),
          deliveredAt: o.deliveredAt?.toISOString() || null,
        })),
        recentRatings: ratings,
        recentSessions: onlineSessions.slice(0, 5),
      },
    });
  } catch (error) {
    logger.error("Error fetching rider details:", error);
    res.status(500).json({ message: "Failed to fetch rider details" });
  }
});

// GET - Comprehensive analytics for admin dashboard
router.get("/analytics", authenticate(["ADMIN"]), async (req, res) => {
  try {
    const now = new Date();
    const { monthStart, lastMonthStart, lastMonthEnd } = monthWindows(now);

    // ==========================================
    // TOTAL REVENUE (amount of all LIVE orders, any order status)
    // Counts real money only: cash/non-card orders plus CARD orders that Stripe has
    // confirmed (PAID_OR_NON_CARD). Unpaid/failed card attempts are created as
    // PENDING/FAILED and must not be counted as revenue. We don't filter on order
    // STATUS, so live-but-not-yet-delivered orders still count. (Restaurant/rider
    // earnings further down stay DELIVERED-only — those are payouts, not revenue.)
    // ==========================================
    const allOrders = await prisma.order.findMany({
      where: { ...PAID_OR_NON_CARD },
      select: { amount: true }
    });
    const totalRevenue = allOrders.reduce((sum, order) => sum + Number(order.amount), 0);

    // Last month's revenue for comparison (live orders in the window)
    const lastMonthOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lt: lastMonthEnd
        },
        ...PAID_OR_NON_CARD
      },
      select: { amount: true }
    });
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + Number(order.amount), 0);

    // This month's revenue (live orders) for a true MoM delta against last month.
    const thisMonthRevenueOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: monthStart },
        ...PAID_OR_NON_CARD
      },
      select: { amount: true }
    });
    const thisMonthRevenue = thisMonthRevenueOrders.reduce((sum, order) => sum + Number(order.amount), 0);
    const revenueChange = pctChangeLabel(thisMonthRevenue, lastMonthRevenue);

    // ==========================================
    // TOTAL ORDERS
    // ==========================================
    const totalOrders = await prisma.order.count();
    const lastMonthOrdersCount = await prisma.order.count({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lt: lastMonthEnd
        }
      }
    });
    // True MoM: this month's order records vs last month's. Counts all records
    // (no payment filter) to match the all-records Total Orders KPI value above.
    const thisMonthOrdersCount = await prisma.order.count({
      where: {
        createdAt: { gte: monthStart }
      }
    });
    const ordersChange = pctChangeLabel(thisMonthOrdersCount, lastMonthOrdersCount);

    // ==========================================
    // ACTIVE USERS (Total registered users with role USER)
    // ==========================================
    const activeUsersCount = await prisma.user.count({
      where: { role: "USER" }
    });

    // True MoM: new users registered this month vs last month (the headline value
    // above is the lifetime user count, not a monthly figure).
    const thisMonthNewUsers = await prisma.user.count({
      where: { role: "USER", createdAt: { gte: monthStart } }
    });
    const lastMonthNewUsers = await prisma.user.count({
      where: { role: "USER", createdAt: { gte: lastMonthStart, lt: lastMonthEnd } }
    });
    const usersChange = pctChangeLabel(thisMonthNewUsers, lastMonthNewUsers);

    // ==========================================
    // RESTAURANT & RIDER EARNINGS (for internal tracking)
    // ==========================================
    
    // Restaurant earnings calculation (order amount - delivery fee)
    const restaurantOrders = await prisma.order.findMany({
      where: { status: 'DELIVERED' },
      select: { amount: true, deliveryFee: true }
    });
    const totalRestaurantEarnings = restaurantOrders.reduce((sum, order) => {
      const restaurantPortion = Number(order.amount) - Number(order.deliveryFee);
      return sum + restaurantPortion;
    }, 0);

    // Rider earnings from earnings table
    const riderEarningsResult = await prisma.earning.aggregate({
      _sum: { amount: true }
    });
    const totalRiderEarnings = Number(riderEarningsResult._sum.amount || 0);

    // ==========================================
    // MONTHLY REVENUE TREND (Last 12 months)
    // Revenue and order count below both cover LIVE orders (PAID_OR_NON_CARD, any
    // order status), matching the Total Revenue KPI. Note this intentionally
    // differs from the all-records Total Orders KPI: the monthly "orders" line
    // tracks live/paid orders that contribute to the revenue line beside it.
    // ==========================================
    const monthlyRevenue = [];
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const monthOrders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: monthDate,
            lt: nextMonth
          },
          ...PAID_OR_NON_CARD
        },
        select: { amount: true }
      });

      const revenue = monthOrders.reduce((sum, order) => sum + Number(order.amount), 0);
      const ordersCount = monthOrders.length;
      
      // Get users registered in this month
      const monthNewUsers = await prisma.user.count({
        where: {
          role: "USER",
          createdAt: {
            gte: monthDate,
            lt: nextMonth
          }
        }
      });

      monthlyRevenue.push({
        name: monthDate.toLocaleString('en-US', { month: 'short' }),
        revenue: Number(revenue.toFixed(2)),
        orders: ordersCount,
        users: monthNewUsers
      });
    }

    res.json({
      stats: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        revenueChange,
        totalOrders,
        ordersChange,
        activeUsers: activeUsersCount,
        usersChange,
        totalRestaurantEarnings: Number(totalRestaurantEarnings.toFixed(2)),
        totalRiderEarnings: Number(totalRiderEarnings.toFixed(2))
      },
      revenueData: monthlyRevenue
    });
  } catch (error: any) {
    logger.error("Get analytics error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ============================================
// Admin Account Management Routes
// ============================================

// Get all admin accounts
router.get("/accounts", authenticate(["ADMIN"]), async (req, res) => {
  try {
    const admins = await prisma.user.findMany({
      where: {
        role: "ADMIN",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(admins);
  } catch (error) {
    logger.error("Error fetching admin accounts:", error);
    res.status(500).json({ message: "Failed to fetch admin accounts" });
  }
});

// Create new admin account
router.post("/accounts", authenticate(["ADMIN"]), async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    logger.debug("📝 Creating new admin account:", { email });

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      logger.debug("❌ Missing fields:", { firstName, lastName, email, password });
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      logger.debug("❌ Password too short");
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if email already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      logger.debug("❌ Email already exists:", email);
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });

    logger.debug("✅ Admin account created:", newAdmin);
    res.status(201).json(newAdmin);
  } catch (error) {
    logger.error("❌ Error creating admin account:", error);
    res.status(500).json({ message: "Failed to create admin account" });
  }
});

// Update admin account
router.put("/accounts/:id", authenticate(["ADMIN"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ message: "First name and last name are required" });
    }

    const updatedAdmin = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        firstName,
        lastName,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });

    res.json(updatedAdmin);
  } catch (error) {
    logger.error("Error updating admin account:", error);
    res.status(500).json({ message: "Failed to update admin account" });
  }
});

// Delete admin account
router.delete("/accounts/:id", authenticate(["ADMIN"]), async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting the last admin (optional but recommended)
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    });

    if (adminCount <= 1) {
      return res.status(400).json({ message: "Cannot delete the last admin account" });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Admin account deleted successfully" });
  } catch (error) {
    logger.error("Error deleting admin account:", error);
    res.status(500).json({ message: "Failed to delete admin account" });
  }
});

// Restaurant approval/rejection
router.put("/restaurants/:id/approve", authenticate(["ADMIN"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { approved, rejectionReason } = req.body;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: parseInt(id) },
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    if (approved) {
      // Approve - ensure deletedAt is null
      await prisma.restaurant.update({
        where: { id: parseInt(id) },
        data: { deletedAt: null },
      });
    } else {
      // Reject - soft delete
      await prisma.restaurant.update({
        where: { id: parseInt(id) },
        data: { deletedAt: new Date() },
      });
    }

    // Send approval/rejection email
    try {
      const { sendRestaurantStatusEmail } = await import('../config/email.config');
      await sendRestaurantStatusEmail({
        email: restaurant.ownerEmail,
        restaurantName: restaurant.name,
        ownerName: `${restaurant.ownerFirstName} ${restaurant.ownerLastName}`,
        approved: !!approved,
        rejectionReason: rejectionReason || undefined,
      });
      logger.debug('✅ Restaurant status email sent');
    } catch (emailError) {
      logger.error('⚠️ Failed to send restaurant status email:', emailError);
    }

    res.json({ 
      message: approved ? "Restaurant approved successfully" : "Restaurant rejected",
      restaurant 
    });
  } catch (error) {
    logger.error("Error updating restaurant status:", error);
    res.status(500).json({ message: "Failed to update restaurant status" });
  }
});

// Rider approval/rejection
router.put("/riders/:id/approve", authenticate(["ADMIN"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { approved, rejectionReason } = req.body;

    // Extract numeric ID if formatted (e.g., "RDR-001" -> 1)
    let numericId: number;
    if (typeof id === 'string' && id.startsWith('RDR-')) {
      numericId = parseInt(id.replace('RDR-', ''));
    } else {
      numericId = parseInt(id);
    }

    const rider = await prisma.rider.findUnique({
      where: { id: numericId },
    });

    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    // Persist the decision on the Rider row. This is the source of truth that
    // rider login, online toggle, and order-accept all enforce.
    const updatedRider = await prisma.rider.update({
      where: { id: numericId },
      data: { approvalStatus: approved ? "APPROVED" : "REJECTED" },
    });

    // Send approval/rejection email
    try {
      const { sendRiderStatusEmail } = await import('../config/email.config');
      await sendRiderStatusEmail({
        email: rider.email,
        riderName: `${rider.firstName} ${rider.lastName}`,
        approved: !!approved,
        rejectionReason: rejectionReason || undefined,
      });
      logger.debug('✅ Rider status email sent');
    } catch (emailError) {
      logger.error('⚠️ Failed to send rider status email:', emailError);
    }

    res.json({
      message: approved ? "Rider approved successfully" : "Rider rejected",
      rider: updatedRider,
    });
  } catch (error) {
    logger.error("Error updating rider status:", error);
    res.status(500).json({ message: "Failed to update rider status" });
  }
});

export default router;