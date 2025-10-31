import { Router } from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import prisma from "../config/db";
import { authenticate } from "../middlewares/auth";

const router = Router();

const ADMIN_EMAIL = "admin@chopnow.com";
const ADMIN_PASSWORD = "admin123"; // hardcoded

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken({ email, role: "ADMIN" });
  res.json({
    token,
    user: {
      id: 1,
      firstName: "Admin",
      lastName: "User",
      email: ADMIN_EMAIL,
      role: "ADMIN"
    }
  });
});

// Get all users for admin panel with optional search and status filtering
router.get("/users", authenticate(["ADMIN"]), async (req, res) => {
  try {
    const { search, status } = req.query;

    const where: any = {};

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
    const transformedRestaurants = restaurants.map((restaurant: any) => ({
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
      revenue: 0, // Placeholder - can be calculated from orders
      joinDate: restaurant.createdAt.toISOString().split('T')[0],
      deliveryTime: restaurant.deliveryTime,
      commission: 15, // Placeholder
      image: restaurant.image || "/restaurant-placeholder.png",
      description: restaurant.description || `Restaurant owned by ${restaurant.ownerFirstName} ${restaurant.ownerLastName}`.trim(),
      openingHours: "11:00 AM - 10:00 PM", // Placeholder
      minimumOrder: parseFloat(restaurant.minimumOrder.toString()) || 15.0,
    }));

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

export default router;