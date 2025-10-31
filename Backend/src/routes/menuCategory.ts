import express, { Response, Request } from 'express';
import prisma from '../config/db';
import { authenticate, AuthRequest } from '../middlewares/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Helper to get absolute URL for assets using request host/proto
const assetUrl = (req: Request, relativePath: string | null | undefined): string | null => {
  if (!relativePath) return null;
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol;
  const host = req.get("host");
  const normalized = relativePath.replace(/\\/g, '/').replace(/^\/?/, '/');
  return `${proto}://${host}${normalized}`;
};

// Configure multer for menu item images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/menu-items';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'item-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// GET all categories for a restaurant (public)
router.get('/restaurant/:slug/categories', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const restaurant = await prisma.restaurant.findFirst({
      where: { slug, deletedAt: null },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const categories = await prisma.menuCategory.findMany({
      where: { restaurantId: restaurant.id },
      include: {
        menuItems: {
          orderBy: { displayOrder: 'asc' }
        }
      },
      orderBy: { displayOrder: 'asc' }
    });

    // Convert image paths to absolute URLs
    const categoriesWithUrls = categories.map((category: any) => ({
      ...category,
      menuItems: (category.menuItems as any[]).map((item: any) => ({
        ...item,
        image: assetUrl(req, item.image)
      }))
    }));

    res.json(categoriesWithUrls);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create new category
router.post('/restaurant/:slug/categories', authenticate(['RESTAURANT']), async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const { name, description, displayOrder, isActive } = req.body;

    const restaurant = await prisma.restaurant.findFirst({
      where: { slug, deletedAt: null },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check authorization: restaurant id must match token id
    if (!req.user || req.user.role !== 'RESTAURANT' || req.user.id !== restaurant.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const category = await prisma.menuCategory.create({
      data: {
        restaurantId: restaurant.id,
        name,
        description,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        isActive: isActive !== undefined ? isActive === 'true' || isActive === true : true,
      },
      include: {
        menuItems: true
      }
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH update category
router.patch('/restaurant/:slug/categories/:categoryId', authenticate(['RESTAURANT']), async (req: AuthRequest, res: Response) => {
  try {
    const { slug, categoryId } = req.params;
    const { name, description, displayOrder, isActive } = req.body;

    const restaurant = await prisma.restaurant.findFirst({
      where: { slug, deletedAt: null },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check authorization
    if (!req.user || req.user.role !== 'RESTAURANT' || req.user.id !== restaurant.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const category = await prisma.menuCategory.findFirst({
      where: {
        id: parseInt(categoryId),
        restaurantId: restaurant.id
      }
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updated = await prisma.menuCategory.update({
      where: { id: parseInt(categoryId) },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder) }),
        ...(isActive !== undefined && { isActive: isActive === 'true' || isActive === true }),
      },
      include: {
        menuItems: true
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE category
router.delete('/restaurant/:slug/categories/:categoryId', authenticate(['RESTAURANT']), async (req: AuthRequest, res: Response) => {
  try {
    const { slug, categoryId } = req.params;

    const restaurant = await prisma.restaurant.findFirst({
      where: { slug, deletedAt: null },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check authorization
    if (!req.user || req.user.role !== 'RESTAURANT' || req.user.id !== restaurant.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const category = await prisma.menuCategory.findFirst({
      where: {
        id: parseInt(categoryId),
        restaurantId: restaurant.id
      }
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Delete all menu items in this category first
    await prisma.menuItem.deleteMany({
      where: { categoryId: parseInt(categoryId) }
    });

    await prisma.menuCategory.delete({
      where: { id: parseInt(categoryId) }
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all items for a category (public)
router.get('/restaurant/:slug/categories/:categoryId/items', async (req: Request, res: Response) => {
  try {
    const { slug, categoryId } = req.params;

    const restaurant = await prisma.restaurant.findFirst({
      where: { slug, deletedAt: null },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const items = await prisma.menuItem.findMany({
      where: {
        categoryId: parseInt(categoryId),
        restaurantId: restaurant.id
      },
      orderBy: { displayOrder: 'asc' }
    });

    const itemsWithUrls = items.map((item: any) => ({
      ...item,
      image: assetUrl(req, item.image)
    }));

    res.json(itemsWithUrls);
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create new menu item
router.post('/restaurant/:slug/categories/:categoryId/items', authenticate(['RESTAURANT']), upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const { slug, categoryId } = req.params;
    const {
      name,
      description,
      price,
      category,
      isAvailable,
      allergyInfo,
      isVegetarian,
      isVegan,
      isGlutenFree,
      displayOrder
    } = req.body;

    const restaurant = await prisma.restaurant.findFirst({
      where: { slug, deletedAt: null },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check authorization
    if (!req.user || req.user.role !== 'RESTAURANT' || req.user.id !== restaurant.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const menuCategory = await prisma.menuCategory.findFirst({
      where: {
        id: parseInt(categoryId),
        restaurantId: restaurant.id
      }
    });

    if (!menuCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const item = await prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: parseInt(categoryId),
        name,
        description,
        price: parseFloat(price),
        category: category || menuCategory.name,
        image: req.file ? req.file.path : null,
        isAvailable: isAvailable !== undefined ? isAvailable === 'true' || isAvailable === true : true,
        allergyInfo,
        isVegetarian: isVegetarian === 'true' || isVegetarian === true,
        isVegan: isVegan === 'true' || isVegan === true,
        isGlutenFree: isGlutenFree === 'true' || isGlutenFree === true,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
      }
    });

    const itemWithUrl = {
      ...item,
      image: assetUrl(req, item.image)
    };

    res.status(201).json(itemWithUrl);
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH update menu item
router.patch('/restaurant/:slug/categories/:categoryId/items/:itemId', authenticate(['RESTAURANT']), upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const { slug, categoryId, itemId } = req.params;
    const {
      name,
      description,
      price,
      category,
      isAvailable,
      allergyInfo,
      isVegetarian,
      isVegan,
      isGlutenFree,
      displayOrder
    } = req.body;

    const restaurant = await prisma.restaurant.findFirst({
      where: { slug, deletedAt: null },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check authorization
    if (!req.user || req.user.role !== 'RESTAURANT' || req.user.id !== restaurant.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const item = await prisma.menuItem.findFirst({
      where: {
        id: parseInt(itemId),
        categoryId: parseInt(categoryId),
        restaurantId: restaurant.id
      }
    });

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const updated = await prisma.menuItem.update({
      where: { id: parseInt(itemId) },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(category && { category }),
        ...(req.file && { image: req.file.path }),
        ...(isAvailable !== undefined && { isAvailable: isAvailable === 'true' || isAvailable === true }),
        ...(allergyInfo !== undefined && { allergyInfo }),
        ...(isVegetarian !== undefined && { isVegetarian: isVegetarian === 'true' || isVegetarian === true }),
        ...(isVegan !== undefined && { isVegan: isVegan === 'true' || isVegan === true }),
        ...(isGlutenFree !== undefined && { isGlutenFree: isGlutenFree === 'true' || isGlutenFree === true }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder) }),
      }
    });

    const itemWithUrl = {
      ...updated,
      image: assetUrl(req, updated.image)
    };

    res.json(itemWithUrl);
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE menu item
router.delete('/restaurant/:slug/categories/:categoryId/items/:itemId', authenticate(['RESTAURANT']), async (req: AuthRequest, res: Response) => {
  try {
    const { slug, categoryId, itemId } = req.params;

    const restaurant = await prisma.restaurant.findFirst({
      where: { slug, deletedAt: null },
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check authorization
    if (!req.user || req.user.role !== 'RESTAURANT' || req.user.id !== restaurant.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const item = await prisma.menuItem.findFirst({
      where: {
        id: parseInt(itemId),
        categoryId: parseInt(categoryId),
        restaurantId: restaurant.id
      }
    });

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await prisma.menuItem.delete({
      where: { id: parseInt(itemId) }
    });

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
