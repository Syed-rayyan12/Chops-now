// ============================================
// API Configuration - Single Source of Truth
// ============================================

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api",
  TIMEOUT: 30000,
} as const;

export const STORAGE_KEYS = {
  USER_TOKEN: "token",
  USER_EMAIL: "userEmail",
  RESTAURANT_TOKEN: "restaurantToken",
  RESTAURANT_EMAIL: "restaurantEmail",
  RIDER_TOKEN: "riderToken",
  ADMIN_TOKEN: "adminToken",
} as const;
