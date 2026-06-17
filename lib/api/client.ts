// ============================================
// API Client - Reusable HTTP Request Handler
// ============================================

import { API_CONFIG } from "./config";
import { logger } from "../logger";
import { clearRoleCookie } from "../auth-cookie";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
  tokenKey?: string;
  skipAuth?: boolean;
}

/**
 * Centralized API request handler
 * Handles authentication, errors, and JSON parsing
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, tokenKey, skipAuth, headers, ...fetchOptions } = options;

  // Get token from options or localStorage
  let authToken = token;
  if (!authToken && tokenKey && typeof window !== "undefined") {
    authToken = localStorage.getItem(tokenKey) || undefined;
  }

  // Build headers
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (authToken && !skipAuth) {
    requestHeaders["Authorization"] = `Bearer ${authToken}`;
  }

  // Make request
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
    });

    // Parse response
    let data = null;
    try {
      data = await response.json();
    } catch {
      // Response might not be JSON
    }

    // Handle errors
    if (!response.ok) {
      // Handle 401 Unauthorized (expired/invalid token)
      if (response.status === 401) {
        // Check which token is being used and clear it
        if (tokenKey) {
          if (typeof window !== "undefined") {
            localStorage.removeItem(tokenKey);
            clearRoleCookie();

            // Also clear admin user data if it's an admin token
            if (tokenKey === "adminToken") {
              localStorage.removeItem("adminUser");
            }
          }
        }

        // Redirect to appropriate login page based on token type
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;

          if (currentPath.includes("/admin")) {
            window.location.href = "/admin-signin";
          } else if (currentPath.includes("/restaurant")) {
            window.location.href = "/restaurant-signIn";
          } else if (currentPath.includes("/rider")) {
            window.location.href = "/rider-signIn";
          } else {
            window.location.href = "/user-signIn";
          }
        }
      }

      throw new ApiError(
        data?.message || `Request failed with status ${response.status}`,
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    logger.error("API request failed:", error instanceof Error ? error.message : error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Helper for FormData requests (file uploads)
 */
export async function apiRequestFormData<T>(
  endpoint: string,
  formData: FormData,
  options: RequestOptions = {}
): Promise<T> {
  const { token, tokenKey, ...fetchOptions } = options;

  let authToken = token;
  if (!authToken && tokenKey && typeof window !== "undefined") {
    authToken = localStorage.getItem(tokenKey) || undefined;
  }

  const requestHeaders: Record<string, string> = {};
  if (authToken) {
    requestHeaders["Authorization"] = `Bearer ${authToken}`;
  }

  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
      body: formData,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new ApiError(
        data?.message || `Request failed with status ${response.status}`,
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Helper to get auth token from localStorage
 */
export function getToken(tokenKey: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(tokenKey);
}

/**
 * Helper to set auth token in localStorage
 */
export function setToken(tokenKey: string, token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(tokenKey, token);
  }
}

/**
 * Helper to remove auth token from localStorage
 */
export function removeToken(tokenKey: string): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(tokenKey);
  }
}
