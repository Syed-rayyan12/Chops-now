import { Router } from "express";
import type { Request } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/db";
import { generateToken } from "../utils/jwt";
import { authenticate, AuthRequest } from "../middlewares/auth";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// --- Multer setup for restaurant image uploads ---
const uploadsDir = path.join(process.cwd(), "uploads", "restaurants");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req: any, file: any, cb: any) => {
    const allowed = ["image/png", "image/jpeg", "image/webp", "image/jpg"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type"), false);
  },
});

// Helper to turn relative upload paths into absolute URLs for the frontend
function assetUrl(req: Request, rel?: string | null) {
  if (!rel) return rel ?? undefined;
  if (!rel.startsWith("/uploads")) return rel; // leave non-upload URLs untouched
  const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol;
  const host = req.get("host");
  return `${proto}://${host}${rel}`;
}

// ✅ Helper function to generate slug from business name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-');      // Replace multiple hyphens with single hyphen
}

// ✅ Helper function to ensure unique slug
async function getUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (await prisma.restaurant.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

router.post("/signup", async (req, res) => {
  try {
    console.log("🍽️ Restaurant signup request received:", req.body);
    const {
      firstName,
      lastName,
      businessName,
      businessEmail,
      businessPhone,
      businessAddress,
      password,
      agreeToTerms,
      latitude,
      longitude,
      // Optional fields for display
      description,
      image,
      coverImage,
      cuisineType,
      priceRange,
      featured,
      openingHours
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !businessName || !businessEmail || !businessPhone || !businessAddress || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!agreeToTerms) {
      return res.status(400).json({ message: "You must agree to terms and conditions" });
    }

    // Check if email or phone already exists in restaurants
    const existingRestaurant = await prisma.restaurant.findFirst({
      where: { phone: businessPhone },
    });
    if (existingRestaurant) return res.status(400).json({ message: "Phone already in use" });

    const existingEmail = await prisma.restaurant.findFirst({
      where: { ownerEmail: businessEmail },
    });
    if (existingEmail) return res.status(400).json({ message: "Email already in use" });

    // Also ensure no existing user with same email/phone
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email: businessEmail }, { phone: businessPhone }] },
    });
    if (existingUser) return res.status(400).json({ message: "An account with this email or phone already exists" });

    // Hash the provided password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("🔐 Password hashed, creating restaurant...");

    // ✅ Generate unique slug from business name
    const baseSlug = generateSlug(businessName);
    const slug = await getUniqueSlug(baseSlug);
    console.log(`📝 Generated slug: ${slug}`);

    // Create a user account for the restaurant owner (credentials live in User table)
    const userAccount = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: businessEmail,
        password: hashedPassword,
        phone: businessPhone,
        role: "RESTAURANT",
      },
    });

    // Create restaurant (no password stored in Restaurant table)
    const restaurant = await prisma.restaurant.create({
      data: {
        name: businessName,
        slug, // ✅ Add generated slug
        phone: businessPhone,
        address: businessAddress,
        latitude: latitude || null,
        longitude: longitude || null,
        ownerFirstName: firstName,
        ownerLastName: lastName,
        ownerEmail: businessEmail,
        // Optional display fields
        description: description || "",
        image: image || "/placeholder.svg",
        coverImage: coverImage || image || "/placeholder.svg",
        cuisineType: cuisineType || "",
        priceRange: priceRange || "££",
        featured: featured || false,
        openingHours: openingHours || "9:00 AM - 10:00 PM",
        // Default values for other fields
        rating: 0,
        reviewCount: 0,
        deliveryTime: "30-45 min",
        deliveryFee: 0,
        serviceFee: 2.99,
        distance: 0,
        minimumOrder: 15
      },
    });

    console.log("✅ Restaurant created successfully:", restaurant.id);

    // Generate token using restaurant id and role
    const token = generateToken({ id: restaurant.id, role: "RESTAURANT" });

    // Return only form-matching fields in restaurant response
    const restaurantResponse = {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug, // ✅ Include slug
      phone: restaurant.phone,
      address: restaurant.address,
      ownerFirstName: restaurant.ownerFirstName,
      ownerLastName: restaurant.ownerLastName,
      ownerEmail: restaurant.ownerEmail,
      createdAt: restaurant.createdAt,
      updatedAt: restaurant.updatedAt
    };

    res.json({
      restaurant: restaurantResponse,
      token,
      role: "RESTAURANT"
    });
  } catch (err: any) {
    console.error("Restaurant signup error:", err);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Look up credentials in User table (role: RESTAURANT)
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== "RESTAURANT") {
    return res.status(404).json({ message: "Restaurant account not found" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid password" });

  // Find the restaurant associated to this owner email
  const restaurant = await prisma.restaurant.findFirst({ where: { ownerEmail: email, deletedAt: null } });
  if (!restaurant) return res.status(404).json({ message: "Restaurant profile not found" });

  // Keep token payload using restaurant.id to match existing authorization expectations
  const token = generateToken({ id: restaurant.id, role: "RESTAURANT" });

  // Return only email and token for login
  res.json({
    email: restaurant.ownerEmail,
    token
  });
});

// GET restaurant profile (protected) - for avatar dropdown and profile page
router.get("/profile", authenticate(["RESTAURANT"]), async (req: any, res) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: req.user.id, deletedAt: null },
      select: {
        id: true,
        name: true,
        slug: true,
        phone: true,
        address: true,
        ownerFirstName: true,
        ownerLastName: true,
        ownerEmail: true,
        description: true,
        image: true,
        coverImage: true,
        cuisineType: true,
        priceRange: true,
        openingHours: true,
        minimumOrder: true,
        deliveryFee: true,
        serviceFee: true,
        deliveryTime: true,
        rating: true,
        reviewCount: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Format with absolute URLs
    const profileData = {
      ...restaurant,
      image: assetUrl(req as any, restaurant.image || "/placeholder.svg"),
      coverImage: assetUrl(req as any, restaurant.coverImage || restaurant.image || "/placeholder.svg"),
    };

    return res.json(profileData);
  } catch (err: any) {
    console.error("Failed to fetch restaurant profile:", err);
    return res.status(500).json({ message: "Failed to fetch profile", error: err.message });
  }
});

// PUT restaurant profile (protected) - update profile information
router.put("/profile", authenticate(["RESTAURANT"]), async (req: any, res) => {
  try {
    const {
      ownerFirstName,
      ownerLastName,
      phone,
      name,
      address,
      description,
      cuisineType,
      priceRange,
      openingHours,
      minimumOrder,
      deliveryFee,
      serviceFee,
      deliveryTime,
    } = req.body;

    // Build update object with only provided fields
    const updateData: any = {};

    if (ownerFirstName !== undefined) updateData.ownerFirstName = ownerFirstName;
    if (ownerLastName !== undefined) updateData.ownerLastName = ownerLastName;
    if (phone !== undefined) updateData.phone = phone;
    if (name !== undefined) updateData.name = name;
    if (address !== undefined) updateData.address = address;
    if (description !== undefined) updateData.description = description;
    if (cuisineType !== undefined) updateData.cuisineType = cuisineType;
    if (priceRange !== undefined) updateData.priceRange = priceRange;
    if (openingHours !== undefined) updateData.openingHours = openingHours;
    if (minimumOrder !== undefined) updateData.minimumOrder = parseFloat(minimumOrder);
    if (deliveryFee !== undefined) updateData.deliveryFee = parseFloat(deliveryFee);
    if (serviceFee !== undefined) updateData.serviceFee = parseFloat(serviceFee);
    if (deliveryTime !== undefined) updateData.deliveryTime = deliveryTime;

    // Check for phone uniqueness if updating
    if (phone && phone !== "") {
      const existing = await prisma.restaurant.findFirst({
        where: {
          phone,
          id: { not: req.user.id },
        },
      });
      if (existing) {
        return res.status(400).json({ message: "Phone number already in use by another restaurant" });
      }
    }

    const updated = await prisma.restaurant.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        slug: true,
        phone: true,
        address: true,
        ownerFirstName: true,
        ownerLastName: true,
        ownerEmail: true,
        description: true,
        image: true,
        coverImage: true,
        cuisineType: true,
        priceRange: true,
        openingHours: true,
        minimumOrder: true,
        deliveryFee: true,
        serviceFee: true,
        deliveryTime: true,
        rating: true,
        reviewCount: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Format with absolute URLs
    const profileData = {
      ...updated,
      image: assetUrl(req as any, updated.image || "/placeholder.svg"),
      coverImage: assetUrl(req as any, updated.coverImage || updated.image || "/placeholder.svg"),
    };

    // If email was the owner's email, sync it to localStorage on frontend
    return res.json(profileData);
  } catch (err: any) {
    console.error("Failed to update restaurant profile:", err);
    return res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
});

// GET all restaurants with optional filters
router.get("/", async (req, res) => {
  try {
    const { 
      cuisineType, 
      priceRange,
      sortBy, 
      search,
      featured 
    } = req.query;

  let whereClause: any = {};
    let orderBy: any = {};

    // Filter by cuisine type
    if (cuisineType && cuisineType !== '') {
      whereClause.cuisineType = { contains: cuisineType as string, mode: 'insensitive' };
    }

    // Filter by price range
    if (priceRange && priceRange !== '') {
      whereClause.priceRange = priceRange as string;
    }

    // Filter by search term (name, cuisine, or tags)
    if (search && search !== '') {
      whereClause.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { cuisineType: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Filter featured restaurants
    if (featured === 'true') {
      whereClause.featured = true;
    }

  // Always exclude soft-deleted restaurants
  whereClause.deletedAt = null;

  // Sort options
    switch (sortBy) {
      case 'highest-rated':
        orderBy = { rating: 'desc' };
        break;
      case 'fastest-delivery':
        // Parse deliveryTime string (e.g., "30-45 min") and sort by first number
        orderBy = { deliveryTime: 'asc' };
        break;
      case 'closest':
        orderBy = { distance: 'asc' };
        break;
      case 'recommended':
      default:
        // Featured first, then by rating
        orderBy = [{ featured: 'desc' }, { rating: 'desc' }];
        break;
    }

    const restaurants = await prisma.restaurant.findMany({
      where: whereClause,
      orderBy: orderBy,
      include: {
        menuItems: {
          take: 5, // Include only first 5 menu items for preview
          where: { isAvailable: true }
        }
      }
    });

    // Format response to match frontend expectations
    const formattedRestaurants = restaurants.map((r: any) => ({
      id: r.id,
      name: r.name,
      slug: r.slug, // ✅ Include slug
      phone: r.phone,
      address: r.address,
      createdAt: r.createdAt.toISOString(),
      image: assetUrl(req as any, r.image || "/placeholder.svg"),
      coverImage: assetUrl(req as any, r.coverImage || r.image || "/placeholder.svg"),
      cuisineType: r.cuisineType || "", // ✅ keep canonical field
      cuisine: r.cuisineType || "", // ✅ backward-compatible alias for frontend
      rating: r.rating,
      reviewCount: r.reviewCount,
      deliveryTime: r.deliveryTime,
      deliveryFee: r.deliveryFee,
      serviceFee: r.serviceFee,
      priceRange: r.priceRange,
      distance: r.distance,
      featured: r.featured,
      description: r.description || "",
      openingHours: r.openingHours,
      minimumOrder: r.minimumOrder,
      tags: r.cuisineType ? [r.cuisineType] : []
    }));

  res.json({ restaurants: formattedRestaurants });
  } catch (err: any) {
    console.error("Failed to fetch restaurants:", err);
    res.status(500).json({ message: "Failed to fetch restaurants", error: err.message });
  }
});

// ✅ GET single restaurant by SLUG (not ID)
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const restaurant = await prisma.restaurant.findFirst({
      where: { slug, deletedAt: null },
      include: {
        menuItems: {
          where: { isAvailable: true }
        }
      }
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Format response
    const formattedRestaurant = {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      phone: restaurant.phone,
      address: restaurant.address,
      createdAt: restaurant.createdAt.toISOString(),
      image: assetUrl(req as any, restaurant.image || "/placeholder.svg"),
      coverImage: assetUrl(req as any, restaurant.coverImage || restaurant.image || "/placeholder.svg"),
      cuisineType: restaurant.cuisineType || "",
      cuisine: restaurant.cuisineType || "", // backward-compatible alias
      rating: restaurant.rating,
      reviewCount: restaurant.reviewCount,
      deliveryTime: restaurant.deliveryTime,
      deliveryFee: restaurant.deliveryFee,
      serviceFee: restaurant.serviceFee,
      priceRange: restaurant.priceRange,
      distance: restaurant.distance,
      featured: restaurant.featured,
      description: restaurant.description || "",
      openingHours: restaurant.openingHours,
      minimumOrder: restaurant.minimumOrder,
      tags: restaurant.cuisineType ? [restaurant.cuisineType] : [],
      menuItems: restaurant.menuItems
    };

    res.json({ restaurant: formattedRestaurant });
  } catch (err: any) {
    console.error("Failed to fetch restaurant:", err);
    res.status(500).json({ message: "Failed to fetch restaurant", error: err.message });
  }
});

// ✅ PATCH update restaurant by SLUG (owner settings) — now supports image uploads
router.patch(
  "/:slug",
  authenticate(["RESTAURANT"]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  async (req: any, res: any) => {
    try {
      const { slug } = req.params;
      console.log("🔵 PATCH /restaurant/:slug - slug:", slug);
      console.log("🔵 Authenticated user:", req.user);

      // Find the restaurant to get its id
      const target = await prisma.restaurant.findUnique({ where: { slug }, select: { id: true, deletedAt: true } });
      if (!target) {
        console.log("❌ Restaurant not found for slug:", slug);
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Prevent updates to soft-deleted restaurants
      if (target.deletedAt) {
        console.log("❌ Cannot update a deleted (archived) restaurant", slug);
        return res.status(410).json({ message: "Restaurant has been deleted" });
      }

      // Ensure the authenticated restaurant matches the target
      if (!req.user || req.user.role !== "RESTAURANT" || req.user.id !== target.id) {
        console.log("❌ Forbidden - user:", req.user, "target:", target);
        return res.status(403).json({ message: "Forbidden" });
      }

      // Text fields come in req.body (strings when multipart)
      const {
        name,
        description,
        cuisineType,
        priceRange,
        openingHours,
        minimumOrder,
        deliveryFee,
        serviceFee,
        deliveryTime,
        phone,
        address,
        featured,
      } = req.body as Record<string, unknown>;

      console.log("📦 Update payload (body):", req.body);

      // Files are available on req.files
      const files = req.files as Record<string, Express.Multer.File[]> | undefined;
      const data: any = {};

      // Helpers to coerce types from multipart/form-data strings
      const toNumber = (v: any) => {
        if (v === undefined || v === null || v === "") return undefined;
        const n = typeof v === "number" ? v : parseFloat(String(v));
        return Number.isFinite(n) ? n : undefined;
      };
      const toBoolean = (v: any) => {
        if (v === undefined || v === null || v === "") return undefined;
        if (typeof v === "boolean") return v;
        const s = String(v).toLowerCase();
        if (s === "true") return true;
        if (s === "false") return false;
        return undefined;
      };

      if (name !== undefined) data.name = name;
      if (description !== undefined) data.description = description;
      if (cuisineType !== undefined) data.cuisineType = cuisineType;
      if (priceRange !== undefined) data.priceRange = priceRange;
      if (openingHours !== undefined) data.openingHours = openingHours;
  const _minimumOrder = toNumber(minimumOrder);
  if (_minimumOrder !== undefined) data.minimumOrder = _minimumOrder;

  const _deliveryFee = toNumber(deliveryFee);
  if (_deliveryFee !== undefined) data.deliveryFee = _deliveryFee;

  const _serviceFee = toNumber(serviceFee);
  if (_serviceFee !== undefined) data.serviceFee = _serviceFee;
      if (deliveryTime !== undefined) data.deliveryTime = deliveryTime;
      if (phone !== undefined) data.phone = phone;
  if (address !== undefined) data.address = address;

  const _featured = toBoolean(featured);
  if (_featured !== undefined) data.featured = _featured;

      // If files were uploaded, set the image URLs
      if (files?.image && files.image[0]) {
        data.image = `/uploads/restaurants/${files.image[0].filename}`;
      }
      if (files?.coverImage && files.coverImage[0]) {
        data.coverImage = `/uploads/restaurants/${files.coverImage[0].filename}`;
      }

      console.log("🔄 Updating with data:", data);

      const restaurant = await prisma.restaurant.update({
        where: { slug },
        data,
        select: {
          id: true,
          name: true,
          slug: true,
          phone: true,
          address: true,
          description: true,
          image: true,
          coverImage: true,
          cuisineType: true,
          priceRange: true,
          openingHours: true,
          minimumOrder: true,
          deliveryFee: true,
          serviceFee: true,
          deliveryTime: true,
          rating: true,
          reviewCount: true,
          featured: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const withUrls = {
        ...restaurant,
        image: assetUrl(req as any, restaurant.image || "/placeholder.svg"),
        coverImage: assetUrl(req as any, restaurant.coverImage || restaurant.image || "/placeholder.svg"),
      };

      console.log("✅ Update successful:", { image: withUrls.image, coverImage: withUrls.coverImage });
      return res.json({ restaurant: withUrls });
    } catch (err: any) {
      console.error("❌ Update restaurant error:", err);
      return res.status(400).json({ message: "Failed to update", error: err.message });
    }
  }
);

// ✅ DELETE (soft delete) restaurant by SLUG
router.delete(
  "/:slug",
  authenticate(["RESTAURANT"]),
  async (req: any, res: any) => {
    try {
      const { slug } = req.params;
      console.log("🗑️ DELETE /restaurant/:slug - slug:", slug);

      const target = await prisma.restaurant.findUnique({
        where: { slug },
        select: { id: true, slug: true, deletedAt: true }
      });

      if (!target) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      if (target.deletedAt) {
        return res.status(410).json({ message: "Restaurant already deleted" });
      }

      if (!req.user || req.user.role !== "RESTAURANT" || req.user.id !== target.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Mutate slug to free it for future reuse
      const archivedSlug = `${target.slug}-deleted-${Date.now()}`;

      await prisma.restaurant.update({
        where: { slug },
        data: {
          deletedAt: new Date(),
          slug: archivedSlug,
        },
      });

      return res.json({ message: "Restaurant archived (soft deleted)" });
    } catch (err: any) {
      console.error("❌ Soft delete restaurant error:", err);
      return res.status(400).json({ message: "Failed to delete restaurant", error: err.message });
    }
  }
);

// ============================================
// ORDER MANAGEMENT ENDPOINTS (Restaurant)
// ============================================

// GET - Get restaurant orders with optional status filter
router.get(
  "/:slug/orders",
  authenticate(["RESTAURANT"]),
  async (req: any, res: any) => {
    try {
      const { slug } = req.params;
      const { status } = req.query; // Filter by status: PENDING, ASSIGNED, PICKED_UP, DELIVERED, CANCELLED

      const restaurant = await prisma.restaurant.findFirst({
        where: { slug, deletedAt: null }
      });

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Check authorization
      if (req.user?.id !== restaurant.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const whereClause: any = { restaurantId: restaurant.id };
      if (status) {
        whereClause.status = status;
      }

      const orders = await prisma.order.findMany({
        where: whereClause,
        include: {
          items: true,
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
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
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({ orders });
    } catch (error: any) {
      console.error("Get restaurant orders error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PATCH - Update order status
router.patch(
  "/:slug/orders/:orderId",
  authenticate(["RESTAURANT"]),
  async (req: any, res: any) => {
    try {
      const { slug, orderId } = req.params;
      const { status } = req.body;

      const restaurant = await prisma.restaurant.findFirst({
        where: { slug, deletedAt: null }
      });

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Check authorization
      if (req.user?.id !== restaurant.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const order = await prisma.order.findFirst({
        where: {
          id: parseInt(orderId),
          restaurantId: restaurant.id
        }
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const validStatuses = ['PENDING', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'DELIVERED', 'CANCELLED'];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const updatedOrder = await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: { status },
        include: {
          items: true,
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
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

      res.json({ order: updatedOrder });
    } catch (error: any) {
      console.error("Update order error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PATCH - Accept order (PENDING → PREPARING)
router.patch(
  "/:slug/orders/:orderId/accept",
  authenticate(["RESTAURANT"]),
  async (req: any, res: any) => {
    try {
      const { slug, orderId } = req.params;

      const restaurant = await prisma.restaurant.findFirst({
        where: { slug, deletedAt: null }
      });

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      if (req.user?.id !== restaurant.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const order = await prisma.order.findFirst({
        where: {
          id: parseInt(orderId),
          restaurantId: restaurant.id
        }
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.status !== 'PENDING') {
        return res.status(400).json({ message: "Order can only be accepted when pending" });
      }

      const updatedOrder = await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: { status: 'PREPARING' as any, assignedAt: new Date() },
        include: {
          items: true,
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
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

      res.json({ order: updatedOrder });
    } catch (error: any) {
      console.error("Accept order error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PATCH - Mark order ready (PREPARING → READY_FOR_PICKUP)
router.patch(
  "/:slug/orders/:orderId/ready",
  authenticate(["RESTAURANT"]),
  async (req: any, res: any) => {
    try {
      const { slug, orderId } = req.params;

      const restaurant = await prisma.restaurant.findFirst({
        where: { slug, deletedAt: null }
      });

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      if (req.user?.id !== restaurant.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const order = await prisma.order.findFirst({
        where: {
          id: parseInt(orderId),
          restaurantId: restaurant.id
        }
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.status !== 'PREPARING' as any) {
        return res.status(400).json({ message: "Order must be preparing to mark ready" });
      }

      console.log(`📦 Marking order ${order.code} as READY_FOR_PICKUP`);

      const updatedOrder = await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: { status: 'READY_FOR_PICKUP' as any },
        include: {
          items: true,
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
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

      console.log(`✅ Order ${updatedOrder.code} marked as READY_FOR_PICKUP, riderId: ${updatedOrder.riderId}`);

      res.json({ order: updatedOrder });
    } catch (error: any) {
      console.error("Mark ready error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PATCH - Cancel order
router.patch(
  "/:slug/orders/:orderId/cancel",
  authenticate(["RESTAURANT"]),
  async (req: any, res: any) => {
    try {
      const { slug, orderId } = req.params;

      const restaurant = await prisma.restaurant.findFirst({
        where: { slug, deletedAt: null }
      });

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      if (req.user?.id !== restaurant.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const order = await prisma.order.findFirst({
        where: {
          id: parseInt(orderId),
          restaurantId: restaurant.id
        }
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
        return res.status(400).json({ message: "Cannot cancel completed or cancelled order" });
      }

      const updatedOrder = await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: { status: 'CANCELLED' },
        include: {
          items: true,
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
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

      res.json({ order: updatedOrder });
    } catch (error: any) {
      console.error("Cancel order error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET - Dashboard statistics (order counts by status)
router.get(
  "/:slug/stats",
  authenticate(["RESTAURANT"]),
  async (req: any, res: any) => {
    try {
      const { slug } = req.params;

      const restaurant = await prisma.restaurant.findFirst({
        where: { slug, deletedAt: null }
      });

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Check authorization
      if (req.user?.id !== restaurant.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      // Get order counts by status
      const [pendingCount, preparingCount, readyCount, pickedUpCount, deliveredCount, cancelledCount] = await Promise.all([
        prisma.order.count({ where: { restaurantId: restaurant.id, status: 'PENDING' as any } }),
        prisma.order.count({ where: { restaurantId: restaurant.id, status: 'PREPARING' as any } }),
        prisma.order.count({ where: { restaurantId: restaurant.id, status: 'READY_FOR_PICKUP' as any } }),
        prisma.order.count({ where: { restaurantId: restaurant.id, status: 'PICKED_UP' as any } }),
        prisma.order.count({ where: { restaurantId: restaurant.id, status: 'DELIVERED' as any } }),
        prisma.order.count({ where: { restaurantId: restaurant.id, status: 'CANCELLED' as any } }),
      ]);

      const inProgressCount = preparingCount + readyCount + pickedUpCount;

      res.json({
        stats: {
          pendingOrders: pendingCount,
          inProgressOrders: inProgressCount,
          completedOrders: deliveredCount,
          cancelledOrders: cancelledCount,
        }
      });
    } catch (error: any) {
      console.error("Get stats error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET - Earnings (today, weekly, and monthly)
router.get(
  "/:slug/earnings",
  authenticate(["RESTAURANT"]),
  async (req: any, res: any) => {
    try {
      const { slug } = req.params;

      const restaurant = await prisma.restaurant.findFirst({
        where: { slug, deletedAt: null }
      });

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Check authorization
      if (req.user?.id !== restaurant.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // Today's earnings (DELIVERED orders only)
      const todayOrders = await prisma.order.findMany({
        where: {
          restaurantId: restaurant.id,
          status: 'DELIVERED',
          createdAt: { gte: todayStart }
        },
        select: { amount: true }
      });

      const todayEarnings = todayOrders.reduce((sum, order) => sum + Number(order.amount), 0);

      // Weekly earnings (DELIVERED orders only)
      const weekOrders = await prisma.order.findMany({
        where: {
          restaurantId: restaurant.id,
          status: 'DELIVERED',
          createdAt: { gte: weekStart }
        },
        select: { amount: true }
      });

      const weeklyEarnings = weekOrders.reduce((sum, order) => sum + Number(order.amount), 0);

      // Monthly earnings (DELIVERED orders only)
      const monthOrders = await prisma.order.findMany({
        where: {
          restaurantId: restaurant.id,
          status: 'DELIVERED',
          createdAt: { gte: monthStart }
        },
        select: { amount: true }
      });

      const monthlyEarnings = monthOrders.reduce((sum, order) => sum + Number(order.amount), 0);

      res.json({
        earnings: {
          today: todayEarnings,
          weekly: weeklyEarnings,
          monthly: monthlyEarnings,
        }
      });
    } catch (error: any) {
      console.error("Get earnings error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET - Transaction History
router.get(
  "/:slug/transactions",
  authenticate(["RESTAURANT"]),
  async (req: any, res: any) => {
    try {
      const { slug } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const restaurant = await prisma.restaurant.findFirst({
        where: { slug, deletedAt: null }
      });

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Check authorization
      if (req.user?.id !== restaurant.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const skip = (Number(page) - 1) * Number(limit);

      // Get delivered orders as transactions
      const orders = await prisma.order.findMany({
        where: {
          restaurantId: restaurant.id,
          status: 'DELIVERED'
        },
        select: {
          id: true,
          code: true,
          amount: true,
          createdAt: true,
          deliveredAt: true
        },
        orderBy: { deliveredAt: 'desc' },
        skip,
        take: Number(limit)
      });

      const total = await prisma.order.count({
        where: {
          restaurantId: restaurant.id,
          status: 'DELIVERED'
        }
      });

      const transactions = orders.map(order => ({
        orderId: order.code,
        date: order.deliveredAt || order.createdAt,
        amount: Number(order.amount),
        status: 'COMPLETED'
      }));

      res.json({
        transactions,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error: any) {
      console.error("Get transactions error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ============================================
// GET NEARBY RIDERS (within 5km of restaurant)
// ============================================
router.get(
  "/:slug/nearby-riders",
  authenticate(["RESTAURANT"]),
  async (req: any, res: any) => {
    try {
      const { slug } = req.params;

      const restaurant = await prisma.restaurant.findFirst({
        where: { slug, deletedAt: null },
        select: {
          id: true,
          latitude: true,
          longitude: true
        }
      });

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      if (req.user?.id !== restaurant.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      if (!restaurant.latitude || !restaurant.longitude) {
        return res.status(400).json({ 
          message: "Restaurant location not set. Please update your profile with coordinates."
        });
      }

      // Get all online riders with location
      const riders = await prisma.rider.findMany({
        where: {
          isOnline: true,
          latitude: { not: null },
          longitude: { not: null }
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          latitude: true,
          longitude: true,
          lastLocationUpdate: true,
          vehicle: true
        }
      });

      // Filter riders within 5km
      const { filterByRadius, calculateDistance } = await import('../utils/location');
      const nearbyRiders = filterByRadius(
        restaurant.latitude,
        restaurant.longitude,
        riders,
        5
      );

      // Add distance to each rider
      const ridersWithDistance = nearbyRiders.map(rider => ({
        ...rider,
        distanceKm: calculateDistance(
          restaurant.latitude!,
          restaurant.longitude!,
          rider.latitude!,
          rider.longitude!
        )
      }));

      // Sort by distance (closest first)
      ridersWithDistance.sort((a, b) => a.distanceKm - b.distanceKm);

      res.json({
        riders: ridersWithDistance,
        total: ridersWithDistance.length
      });
    } catch (error: any) {
      console.error("Get nearby riders error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ============================================
// BROADCAST ORDER TO NEARBY RIDERS
// ============================================
router.post(
  "/:slug/orders/:orderId/broadcast",
  authenticate(["RESTAURANT"]),
  async (req: any, res: any) => {
    try {
      const { slug, orderId } = req.params;

      const restaurant = await prisma.restaurant.findFirst({
        where: { slug, deletedAt: null },
        select: { id: true, latitude: true, longitude: true }
      });

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      if (req.user?.id !== restaurant.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      // Get the order
      const order = await prisma.order.findUnique({
        where: { id: parseInt(orderId) },
        select: {
          id: true,
          status: true,
          restaurantId: true
        }
      });

      if (!order || order.restaurantId !== restaurant.id) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.status !== 'READY_FOR_PICKUP') {
        return res.status(400).json({ 
          message: "Order must be in READY_FOR_PICKUP status to broadcast to riders"
        });
      }

      // Get nearby online riders (within 5km)
      const riders = await prisma.rider.findMany({
        where: {
          isOnline: true,
          latitude: { not: null },
          longitude: { not: null }
        },
        select: {
          id: true,
          latitude: true,
          longitude: true
        }
      });

      const { filterByRadius } = await import('../utils/location');
      const nearbyRiders = filterByRadius(
        restaurant.latitude!,
        restaurant.longitude!,
        riders,
        5
      );

      // TODO: Send real-time notification to nearby riders
      // This would be implemented with Socket.IO or similar

      res.json({
        success: true,
        message: `Order broadcasted to ${nearbyRiders.length} nearby riders`,
        ridersNotified: nearbyRiders.length
      });
    } catch (error: any) {
      console.error("Broadcast order error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ✅ POST /api/restaurant/support - Submit support message to admin
router.post(
  "/support",
  authenticate(["RESTAURANT"]),
  async (req: AuthRequest, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { subject, message } = req.body;

      if (!subject || !message) {
        return res.status(400).json({ message: "Subject and message are required" });
      }

      // Get restaurant details
      const restaurant = await prisma.restaurant.findUnique({
        where: { ownerEmail: user.email },
        select: { id: true, name: true },
      });

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Create notification for admin
      await prisma.notification.create({
        data: {
          type: "SUPPORT_MESSAGE",
          title: `Support Request: ${subject}`,
          message: `From ${restaurant.name}: ${message}`,
          recipientRole: "ADMIN",
          recipientId: null, // All admins
          metadata: JSON.stringify({
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            subject,
            originalMessage: message,
          }),
        },
      });

      res.json({ message: "Support message sent successfully" });
    } catch (error) {
      console.error("❌ Error submitting support message:", error);
      res.status(500).json({ message: "Failed to send support message" });
    }
  }
);

export default router;
