// ============================================
// API Configuration - Single Source of Truth
// ============================================

export const API_CONFIG = {
  // Use NEXT_PUBLIC_API_URL from .env.local, fallback to old name, then default
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 
            process.env.NEXT_PUBLIC_API_BASE || 
            "http://localhost:4000/api",
  TIMEOUT: 30000,
  // Optional: API Key for additional security (can be enabled later)
  API_KEY: process.env.NEXT_PUBLIC_API_KEY,
} as const;

export const STORAGE_KEYS = {
  USER_TOKEN: "token",
  USER_EMAIL: "userEmail",
  RESTAURANT_TOKEN: "restaurantToken",
  RESTAURANT_EMAIL: "restaurantEmail",
  RIDER_TOKEN: "riderToken",
  ADMIN_TOKEN: "adminToken",
} as const;
