// ============================================
// API Configuration - Single Source of Truth
// ============================================

const getBaseUrl = () => {
  // Use environment variable for production or fallback to localhost
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // In production a missing API URL silently breaks every request with
  // confusing CORS errors — surface it loudly instead of hiding it.
  if (process.env.NODE_ENV === "production") {
    console.error(
      "[config] NEXT_PUBLIC_API_URL is not set in production. API calls will fail."
    );
  }

  // Fallback to localhost for local development only.
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

/**
 * Build an Authorization header from a token in localStorage.
 * Returns an empty object on the server or when no token is present,
 * so it can be safely spread into a fetch headers object.
 */
export function authHeader(tokenKey: string): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem(tokenKey);
  return token ? { Authorization: `Bearer ${token}` } : {};
}
