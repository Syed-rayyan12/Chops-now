// ============================================
// Restaurant API - All restaurant-related endpoints
// ============================================

import { apiRequest, apiRequestFormData } from "./client";
import { STORAGE_KEYS } from "./config";

// ============================================
// Types
// ============================================

export interface RestaurantSignupPayload {
  firstName: string;
  lastName: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  password: string;
  agreeToTerms?: boolean;
  description?: string;
  image?: string;
  coverImage?: string;
  cuisineType?: string;
  priceRange?: string;
  featured?: boolean;
  openingHours?: string;
}

export interface RestaurantLoginPayload {
  email: string;
  password: string;
}

export interface RestaurantAuthResponse {
  token: string;
  email?: string;
  restaurant?: {
    id: number;
    name: string;
    phone: string;
    address: string;
    ownerFirstName: string;
    ownerLastName: string;
    ownerEmail: string;
    slug?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  role?: string;
}

export interface RestaurantProfile {
  id: number;
  name: string;
  phone: string;
  address: string;
  latitude?: number;
  longitude?: number;
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  slug?: string;
  description?: string;
  cuisineType?: string;
  priceRange?: string;
  openingHours?: string;
  minimumOrder?: number;
  deliveryFee?: number;
  serviceFee?: number;
  deliveryTime?: string;
  image?: string;
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

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
  id: number;
  restaurantId: number;
  categoryId?: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  allergyInfo?: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type RestaurantUpdatePayload = {
  name?: string;
  description?: string;
  image?: string;
  coverImage?: string;
  cuisineType?: string;
  priceRange?: string;
  openingHours?: string;
  minimumOrder?: number;
  deliveryFee?: number;
  serviceFee?: number;
  deliveryTime?: string;
  phone?: string;
  address?: string;
};

// ============================================
// Authentication
// ============================================

export const restaurantAuth = {
  signup: (data: RestaurantSignupPayload) =>
    apiRequest<RestaurantAuthResponse>("/restaurant/signup", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: true,
    }),

  login: (data: RestaurantLoginPayload) =>
    apiRequest<RestaurantAuthResponse>("/restaurant/login", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: true,
    }),
};

// ============================================
// Profile Management
// ============================================

export const restaurantProfile = {
  get: () =>
    apiRequest<RestaurantProfile>("/restaurant/profile", {
      tokenKey: STORAGE_KEYS.RESTAURANT_TOKEN,
    }),

  update: (data: {
    ownerFirstName?: string;
    ownerLastName?: string;
    phone?: string;
    name?: string;
    address?: string;
    description?: string;
    cuisineType?: string;
    priceRange?: string;
    openingHours?: string;
    minimumOrder?: number;
    deliveryFee?: number;
    serviceFee?: number;
    deliveryTime?: string;
  }) =>
    apiRequest<RestaurantProfile>("/restaurant/profile", {
      method: "PUT",
      tokenKey: STORAGE_KEYS.RESTAURANT_TOKEN,
      body: JSON.stringify(data),
    }),
};

// ============================================
// Public Restaurant Data
// ============================================

export const restaurantPublic = {
  getAll: (params?: {
    cuisineType?: string;
    priceRange?: string;
    sortBy?: string;
    search?: string;
    featured?: boolean;
  }) => {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/restaurant?${queryString}` : "/restaurant";

    return apiRequest<{ restaurants: any[] }>(endpoint, { skipAuth: true })
      .then((res) => res.restaurants || [])
      .catch(() => []);
  },

  getBySlug: (slug: string) =>
    apiRequest<{ restaurant: any }>(`/restaurant/${slug}`, { skipAuth: true })
      .then((res) => res.restaurant)
      .catch(() => null),
};

// ============================================
// Restaurant Settings (Dashboard)
// ============================================

export const restaurantSettings = {
  update: (slug: string, payload: RestaurantUpdatePayload) =>
    apiRequest<{ restaurant: any }>(`/restaurant/${slug}`, {
      method: "PATCH",
      tokenKey: STORAGE_KEYS.RESTAURANT_TOKEN,
      body: JSON.stringify(payload),
    }).then((res) => res.restaurant),

  updateWithForm: (slug: string, formData: FormData) =>
    apiRequestFormData<{ restaurant: any }>(
      `/restaurant/${slug}`,
      formData,
      {
        method: "PATCH",
        tokenKey: STORAGE_KEYS.RESTAURANT_TOKEN,
      }
    ).then((res) => res.restaurant),

  delete: (slug: string) =>
    apiRequest<{ message: string }>(`/restaurant/${slug}`, {
      method: "DELETE",
      tokenKey: STORAGE_KEYS.RESTAURANT_TOKEN,
    }),
};

// ============================================
// Menu Categories
// ============================================

export const menuCategories = {
  getAll: (slug: string) =>
    apiRequest<MenuCategory[]>(`/restaurant/${slug}/categories`, {
      tokenKey: STORAGE_KEYS.RESTAURANT_TOKEN,
    }),

  create: (
    slug: string,
    data: {
      name: string;
      description?: string;
      displayOrder?: number;
      isActive?: boolean;
    }
  ) =>
    apiRequest<MenuCategory>(`/restaurant/${slug}/categories`, {
      method: "POST",
      tokenKey: STORAGE_KEYS.RESTAURANT_TOKEN,
      body: JSON.stringify(data),
    }),

  update: (
    slug: string,
    categoryId: number,
    data: {
      name?: string;
      description?: string;
      displayOrder?: number;
      isActive?: boolean;
    }
  ) =>
    apiRequest<MenuCategory>(`/restaurant/${slug}/categories/${categoryId}`, {
      method: "PATCH",
      tokenKey: STORAGE_KEYS.RESTAURANT_TOKEN,
      body: JSON.stringify(data),
    }),

  delete: (slug: string, categoryId: number) =>
    apiRequest<{ message: string }>(
      `/restaurant/${slug}/categories/${categoryId}`,
      {
        method: "DELETE",
        tokenKey: STORAGE_KEYS.RESTAURANT_TOKEN,
      }
    ),
};

// ============================================
// Menu Items
// ============================================

export const menuItems = {
  // Get all items across all categories for a restaurant
  getAll: async (slug: string): Promise<MenuItem[]> => {
    const categories = await menuCategories.getAll(slug);
    const allItems: MenuItem[] = [];

    for (const category of categories) {
      if (category.menuItems && category.menuItems.length > 0) {
        allItems.push(...category.menuItems);
      }
    }

    return allItems;
  },

  // Get items for a specific category
  getByCategory: (slug: string, categoryId: number) =>
    apiRequest<MenuItem[]>(
      `/restaurant/${slug}/categories/${categoryId}/items`,
      {
        tokenKey: STORAGE_KEYS.RESTAURANT_TOKEN,
      }
    ),

  create: (slug: string, formData: FormData) => {
    const categoryId = formData.get("categoryId");
    if (!categoryId) {
      return Promise.reject(new Error("Category ID is required"));
    }
    return apiRequestFormData<MenuItem>(
      `/restaurant/${slug}/categories/${categoryId}/items`,
      formData,
      {
        method: "POST",
        tokenKey: STORAGE_KEYS.RESTAURANT_TOKEN,
      }
    );
  },

  update: (slug: string, itemId: number, formDataOrPayload: FormData | any) => {
    // If it's a plain object (like { isAvailable: true }), convert to JSON request
    if (!(formDataOrPayload instanceof FormData)) {
      // For simple updates, we need to get the item's categoryId first
      // For now, we'll require categoryId in the payload
      const { categoryId, ...data } = formDataOrPayload;
      if (!categoryId) {
        return Promise.reject(new Error("Category ID is required for updates"));
      }
      return apiRequest<MenuItem>(
        `/restaurant/${slug}/categories/${categoryId}/items/${itemId}`,
        {
          method: "PATCH",
          tokenKey: STORAGE_KEYS.RESTAURANT_TOKEN,
          body: JSON.stringify(data),
        }
      );
    }

    // FormData case
    const categoryId = formDataOrPayload.get("categoryId");
    if (!categoryId) {
      return Promise.reject(new Error("Category ID is required"));
    }
    return apiRequestFormData<MenuItem>(
      `/restaurant/${slug}/categories/${categoryId}/items/${itemId}`,
      formDataOrPayload,
      {
        method: "PATCH",
        tokenKey: STORAGE_KEYS.RESTAURANT_TOKEN,
      }
    );
  },

  delete: (slug: string, itemId: number, categoryId: number) =>
    apiRequest<{ message: string }>(
      `/restaurant/${slug}/categories/${categoryId}/items/${itemId}`,
      {
        method: "DELETE",
        tokenKey: STORAGE_KEYS.RESTAURANT_TOKEN,
      }
    ),
};

// ============================================
// Public Menu (Customer View)
// ============================================

export const publicMenu = {
  getCategoriesWithItems: (slug: string) =>
    apiRequest<MenuCategory[]>(`/restaurant/${slug}/categories`, {
      skipAuth: true,
    }),
};

// ============================================
// Legacy Function Names (for backward compatibility)
// ============================================

export const registerRestaurant = restaurantAuth.signup;
export const loginRestaurant = restaurantAuth.login;
export const getRestaurantProfile = restaurantProfile.get;
export const updateRestaurantProfile = restaurantProfile.update;
export const getAllRestaurants = restaurantPublic.getAll;
export const getRestaurantBySlug = restaurantPublic.getBySlug;
export const updateRestaurantBySlug = restaurantSettings.update;
export const updateRestaurantBySlugForm = restaurantSettings.updateWithForm;
export const deleteRestaurantBySlug = restaurantSettings.delete;
export const getMenuCategories = menuCategories.getAll;
export const createMenuCategory = menuCategories.create;
export const updateMenuCategory = menuCategories.update;
export const deleteMenuCategory = menuCategories.delete;
export const getMenuItems = menuItems.getAll;
export const createMenuItem = menuItems.create;
export const updateMenuItem = menuItems.update;
export const deleteMenuItem = menuItems.delete;
export const getPublicCategoriesWithItems = publicMenu.getCategoriesWithItems;
