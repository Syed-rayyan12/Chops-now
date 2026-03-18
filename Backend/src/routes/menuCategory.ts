import express, { Response, Request } from 'express';
import prisma from '../config/db';
import { authenticate, AuthRequest } from '../middlewares/auth';
import multer from 'multer';
import path from 'path';
import { uploadToR2, deleteFromR2 } from '../config/r2';

const router = express.Router();

// Helper to resolve image URLs - R2 URLs are already absolute
const resolveImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  // R2 URLs are already absolute
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Legacy local uploads - return as-is (will need migration)
  return url;
};

// Configure multer with memory storage for R2 uploads
const upload = multer({
  storage: multer.memoryStorage(),
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

    // Convert image paths to URLs
    const categoriesWithUrls = categories.map((category: any) => ({
      ...category,
      menuItems: (category.menuItems as any[]).map((item: any) => {
        let images: (string | null)[] = [];
        if (item.image) {
          try {
            const imagePaths = JSON.parse(item.image);
            images = Array.isArray(imagePaths) ? imagePaths.map((p: string) => resolveImageUrl(p)) : [resolveImageUrl(item.image)];
          } catch {
            images = [resolveImageUrl(item.image)];
          }
        }
        return {
          ...item,
          image: images[0] || null,
          images: images
        };
      })
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

    const itemsWithUrls = items.map((item: any) => {
      let images: (string | null)[] = [];
      if (item.image) {
        try {
          const imagePaths = JSON.parse(item.image);
          images = Array.isArray(imagePaths) ? imagePaths.map((p: string) => resolveImageUrl(p)) : [resolveImageUrl(item.image)];
        } catch {
          images = [resolveImageUrl(item.image)];
        }
      }
      return {
        ...item,
        image: images[0] || null,
        images: images
      };
    });

    res.json(itemsWithUrls);
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create new menu item
router.post('/restaurant/:slug/categories/:categoryId/items', authenticate(['RESTAURANT']), upload.array('images', 5), async (req: AuthRequest, res: Response) => {
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

    // Upload images to R2
    let imageUrls: string[] = [];
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      const files = req.files as Express.Multer.File[];
      for (const file of files) {
        const url = await uploadToR2(file.buffer, file.originalname, 'menu-items');
        imageUrls.push(url);
      }
    }

    const item = await prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: parseInt(categoryId),
        name,
        description,
        price: parseFloat(price),
        category: category || menuCategory.name,
        image: imageUrls.length > 0 ? JSON.stringify(imageUrls) : null,
        isAvailable: isAvailable !== undefined ? isAvailable === 'true' || isAvailable === true : true,
        allergyInfo,
        isVegetarian: isVegetarian === 'true' || isVegetarian === true,
        isVegan: isVegan === 'true' || isVegan === true,
        isGlutenFree: isGlutenFree === 'true' || isGlutenFree === true,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
      }
    });

    // Parse images array
    let images: (string | null)[] = [];
    if (item.image) {
      try {
        const imagePaths = JSON.parse(item.image);
        images = Array.isArray(imagePaths) ? imagePaths.map((p: string) => resolveImageUrl(p)) : [resolveImageUrl(item.image)];
      } catch {
        images = [resolveImageUrl(item.image)];
      }
    }

    const itemWithUrl = {
      ...item,
      image: images[0] || null,
      images: images
    };

    res.status(201).json(itemWithUrl);
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH update menu item
router.patch('/restaurant/:slug/categories/:categoryId/items/:itemId', authenticate(['RESTAURANT']), upload.array('images', 5), async (req: AuthRequest, res: Response) => {
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

    // Upload new images to R2 if provided
    let newImageData: Record<string, any> = {};
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      const files = req.files as Express.Multer.File[];
      const imageUrls: string[] = [];
      for (const file of files) {
        const url = await uploadToR2(file.buffer, file.originalname, 'menu-items');
        imageUrls.push(url);
      }
      newImageData.image = JSON.stringify(imageUrls);

      // Clean up old images from R2
      if (item.image) {
        try {
          const oldPaths = JSON.parse(item.image);
          const oldUrls = Array.isArray(oldPaths) ? oldPaths : [item.image];
          for (const oldUrl of oldUrls) {
            if (oldUrl && oldUrl.startsWith('https://')) {
              await deleteFromR2(oldUrl);
            }
          }
        } catch {}
      }
    }

    const updated = await prisma.menuItem.update({
      where: { id: parseInt(itemId) },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(category && { category }),
        ...newImageData,
        ...(isAvailable !== undefined && { isAvailable: isAvailable === 'true' || isAvailable === true }),
        ...(allergyInfo !== undefined && { allergyInfo }),
        ...(isVegetarian !== undefined && { isVegetarian: isVegetarian === 'true' || isVegetarian === true }),
        ...(isVegan !== undefined && { isVegan: isVegan === 'true' || isVegan === true }),
        ...(isGlutenFree !== undefined && { isGlutenFree: isGlutenFree === 'true' || isGlutenFree === true }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder) }),
      }
    });

    // Parse images array
    let images: (string | null)[] = [];
    if (updated.image) {
      try {
        const imagePaths = JSON.parse(updated.image);
        images = Array.isArray(imagePaths) ? imagePaths.map((p: string) => resolveImageUrl(p)) : [resolveImageUrl(updated.image)];
      } catch {
        images = [resolveImageUrl(updated.image)];
      }
    }

    const itemWithUrl = {
      ...updated,
      image: images[0] || null,
      images: images
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
