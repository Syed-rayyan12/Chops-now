import { Router } from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import prisma from "../config/db";
import { authenticate } from "../middlewares/auth";

const router = Router();

const ADMIN_EMAIL = "admin@chopnow.com";
const ADMIN_PASSWORD = "admin123"; // hardcoded

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // First check if it's the hardcoded admin
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = generateToken({ email, role: "ADMIN" });
      return res.json({
        token,
        user: {
          id: 1,
          firstName: "Admin",
          lastName: "User",
          email: ADMIN_EMAIL,
          role: "ADMIN"
        }
      });
    }

    // Then check database for other admin accounts
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

    // Generate token
    const token = generateToken({ email: admin.email, role: "ADMIN", id: admin.id });
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
    console.error("Login error:", error);
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
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Get orders for a specific user
router.get("/users/:userId/orders", authenticate(["ADMIN"]), async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching orders for userId:", userId);
    
    // Extract numeric ID from USR-XXX format
    const numericId = parseInt(userId.replace('USR-', ''));
    console.log("Extracted numericId:", numericId);
    
    if (isNaN(numericId)) {
      console.error("Invalid user ID format:", userId);
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
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
});

// Get orders for a specific restaurant
router.get("/restaurants/:restaurantId/orders", authenticate(["ADMIN"]), async (req, res) => {
  try {
    const { restaurantId } = req.params;
    console.log("=== Restaurant Orders Request ===");
    console.log("Raw restaurantId from URL:", restaurantId);
    
    if (!restaurantId || restaurantId === 'undefined' || restaurantId === 'null') {
      console.error("Restaurant ID is missing or invalid");
      return res.status(400).json({ message: "Restaurant ID is required" });
    }
    
    // Try multiple parsing strategies
    let numericId: number;
    
    // Strategy 1: Check if it's already a number
    if (!isNaN(Number(restaurantId))) {
      numericId = Number(restaurantId);
      console.log("Strategy 1 (direct number):", numericId);
    } 
    // Strategy 2: Remove common prefixes
    else if (restaurantId.match(/^(REST-|RES-|RESTAURANT-)/i)) {
      const cleanId = restaurantId.replace(/^(REST-|RES-|RESTAURANT-)/i, '').trim();
      numericId = parseInt(cleanId, 10);
      console.log("Strategy 2 (removed prefix):", cleanId, "=>", numericId);
    }
    // Strategy 3: Extract any numbers from the string
    else {
      const matches = restaurantId.match(/\d+/);
      if (matches) {
        numericId = parseInt(matches[0], 10);
        console.log("Strategy 3 (extracted number):", matches[0], "=>", numericId);
      } else {
        console.error("Could not extract number from:", restaurantId);
        return res.status(400).json({ 
          message: `Invalid restaurant ID format: ${restaurantId}`,
        });
      }
    }
    
    if (isNaN(numericId) || numericId <= 0) {
      console.error("Final parsed ID is invalid:", numericId);
      return res.status(400).json({ 
        message: `Invalid restaurant ID: could not parse ${restaurantId}`,
      });
    }
    
    console.log("Final numeric ID to query:", numericId);

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
    console.error("Error fetching restaurant orders:", error);
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
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
});

// Get dashboard overview stats
router.get("/stats", authenticate(["ADMIN"]), async (req, res) => {
  try {
    // Get total orders count
    const totalOrders = await prisma.order.count();

    // Get active restaurants count (not soft deleted)
    const activeRestaurants = await prisma.restaurant.count({
      where: {
        deletedAt: null,
      },
    });

    // Get total users count
    const totalUsers = await prisma.user.count({
      where: {
        role: "USER",
      },
    });

    // Calculate total revenue from all orders
    const ordersWithAmount = await prisma.order.findMany({
      select: {
        amount: true,
      },
    });

    const totalRevenue = ordersWithAmount.reduce((sum, order) => {
      return sum + parseFloat(order.amount.toString());
    }, 0);

    res.json({
      totalOrders,
      activeRestaurants,
      totalUsers,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
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
    console.error("Error fetching recent orders:", error);
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
    console.error("Error fetching orders:", error);
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
    console.error("Error fetching riders:", error);
    res.status(500).json({ message: "Failed to fetch riders" });
  }
});

// GET - Comprehensive analytics for admin dashboard
router.get("/analytics", authenticate(["ADMIN"]), async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);

    // ==========================================
    // TOTAL REVENUE (All delivered order amounts)
    // ==========================================
    const allDeliveredOrders = await prisma.order.findMany({
      where: { status: 'DELIVERED' },
      select: { amount: true }
    });
    const totalRevenue = allDeliveredOrders.reduce((sum, order) => sum + Number(order.amount), 0);

    // Last month's revenue for comparison
    const lastMonthOrders = await prisma.order.findMany({
      where: {
        status: 'DELIVERED',
        createdAt: {
          gte: lastMonthStart,
          lt: lastMonthEnd
        }
      },
      select: { amount: true }
    });
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + Number(order.amount), 0);
    const revenueChange = lastMonthRevenue > 0 
      ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
      : "0.0";

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
    const ordersChange = lastMonthOrdersCount > 0
      ? ((totalOrders - lastMonthOrdersCount) / lastMonthOrdersCount * 100).toFixed(1)
      : "0.0";

    // ==========================================
    // ACTIVE USERS (Users who have placed at least one order)
    // ==========================================
    const activeUsers = await prisma.order.groupBy({
      by: ['customerId']
    });
    const activeUsersCount = activeUsers.length;

    const lastMonthActiveUsers = await prisma.order.groupBy({
      by: ['customerId'],
      where: {
        createdAt: {
          gte: lastMonthStart,
          lt: lastMonthEnd
        }
      }
    });
    const usersChange = lastMonthActiveUsers.length > 0
      ? ((activeUsersCount - lastMonthActiveUsers.length) / lastMonthActiveUsers.length * 100).toFixed(1)
      : "0.0";

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
    // ==========================================
    const monthlyRevenue = [];
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthOrders = await prisma.order.findMany({
        where: {
          status: 'DELIVERED',
          createdAt: {
            gte: monthDate,
            lt: nextMonth
          }
        },
        select: { amount: true }
      });

      const revenue = monthOrders.reduce((sum, order) => sum + Number(order.amount), 0);
      const ordersCount = monthOrders.length;
      
      // Get active users for this month
      const monthActiveUsers = await prisma.order.groupBy({
        by: ['customerId'],
        where: {
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
        users: monthActiveUsers.length
      });
    }

    res.json({
      stats: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        revenueChange: `${Number(revenueChange) >= 0 ? '+' : ''}${revenueChange}% from last month`,
        totalOrders,
        ordersChange: `${Number(ordersChange) >= 0 ? '+' : ''}${ordersChange}% from last month`,
        activeUsers: activeUsersCount,
        usersChange: `${Number(usersChange) >= 0 ? '+' : ''}${usersChange}% from last month`,
        totalRestaurantEarnings: Number(totalRestaurantEarnings.toFixed(2)),
        totalRiderEarnings: Number(totalRiderEarnings.toFixed(2))
      },
      revenueData: monthlyRevenue
    });
  } catch (error: any) {
    console.error("Get analytics error:", error);
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
    console.error("Error fetching admin accounts:", error);
    res.status(500).json({ message: "Failed to fetch admin accounts" });
  }
});

// Create new admin account
router.post("/accounts", authenticate(["ADMIN"]), async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    console.log("📝 Creating new admin account:", { email });

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      console.log("❌ Missing fields:", { firstName, lastName, email, password });
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      console.log("❌ Password too short");
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if email already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log("❌ Email already exists:", email);
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

    console.log("✅ Admin account created:", newAdmin);
    res.status(201).json(newAdmin);
  } catch (error) {
    console.error("❌ Error creating admin account:", error);
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
    console.error("Error updating admin account:", error);
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
    console.error("Error deleting admin account:", error);
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
      console.log('✅ Restaurant status email sent');
    } catch (emailError) {
      console.error('⚠️ Failed to send restaurant status email:', emailError);
    }

    res.json({ 
      message: approved ? "Restaurant approved successfully" : "Restaurant rejected",
      restaurant 
    });
  } catch (error) {
    console.error("Error updating restaurant status:", error);
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

    // Update rider approval status (you may want to add an 'approved' field to Rider model)
    // For now, we'll just use this endpoint to send emails
    // Consider adding: approved Boolean @default(false) to Rider model

    // Send approval/rejection email
    try {
      const { sendRiderStatusEmail } = await import('../config/email.config');
      await sendRiderStatusEmail({
        email: rider.email,
        riderName: `${rider.firstName} ${rider.lastName}`,
        approved: !!approved,
        rejectionReason: rejectionReason || undefined,
      });
      console.log('✅ Rider status email sent');
    } catch (emailError) {
      console.error('⚠️ Failed to send rider status email:', emailError);
    }

    res.json({ 
      message: approved ? "Rider approved successfully" : "Rider rejected",
      rider 
    });
  } catch (error) {
    console.error("Error updating rider status:", error);
    res.status(500).json({ message: "Failed to update rider status" });
  }
});

export default router;