// ============================================
// User API - All user-related endpoints
// ============================================

import { apiRequest } from "./client";
import { STORAGE_KEYS } from "./config";

// ============================================
// Types
// ============================================

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email?: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    role?: string;
  };
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
}

// ============================================
// Authentication
// ============================================

export const userAuth = {
  signup: (data: SignupPayload) =>
    apiRequest<AuthResponse>("/user/signup", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: true,
    }),

  login: (data: LoginPayload) =>
    apiRequest<AuthResponse>("/user/login", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: true,
    }),
};

// ============================================
// Profile Management
// ============================================

export const userProfile = {
  get: () =>
    apiRequest<{ user: UserProfile }>("/user/profile", {
      tokenKey: STORAGE_KEYS.USER_TOKEN,
    }).then((res) => res.user),

  update: (data: Partial<UserProfile>) =>
    apiRequest<{ user: UserProfile }>("/user/profile", {
      method: "PUT",
      tokenKey: STORAGE_KEYS.USER_TOKEN,
      body: JSON.stringify(data),
    }).then((res) => res.user),
};

// ============================================
// Addresses
// ============================================

export const userAddresses = {
  getAll: () =>
    apiRequest<{ addresses: any[] }>("/user/addresses", {
      tokenKey: STORAGE_KEYS.USER_TOKEN,
    }).then((res) => res.addresses || []),
};

// ============================================
// Orders
// ============================================

export const userOrders = {
  getAll: () =>
    apiRequest<{ orders: any[] }>("/user/orders", {
      tokenKey: STORAGE_KEYS.USER_TOKEN,
    }).then((res) => res.orders || []),
};

// ============================================
// Legacy Function Names (for backward compatibility)
// ============================================

export const getUserProfile = userProfile.get;
export const updateUserProfile = userProfile.update;
export const getUserAddresses = userAddresses.getAll;
export const getUserOrders = userOrders.getAll;
