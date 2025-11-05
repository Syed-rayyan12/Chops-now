// ============================================
// API Configuration - Single Source of Truth
// ============================================

const getBaseUrl = () => {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL must be set in .env.local or deployment platform!');
  }
  return process.env.NEXT_PUBLIC_API_URL;
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
