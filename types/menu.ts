// types/menu.ts
export interface MenuCategory {
  id: number;
  restaurantId: number;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  menuItems?: MenuItem[];
}

export interface MenuItem {
  id: number; // Changed from string to match database
  restaurantId: number;
  categoryId?: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  images?: string[]; // Multiple images support
  isAvailable: boolean;
  allergyInfo?: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  // Legacy field for backwards compatibility
  available?: boolean;
  allergy?: string;
}