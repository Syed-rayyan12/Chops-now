// ============================================
// API Configuration - Single Source of Truth
// ============================================

const getBaseUrl = () => {
  // Use environment variable for production or fallback to localhost
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Fallback to localhost for development
  return "http://localhost:4000/api";
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: 30000,
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
