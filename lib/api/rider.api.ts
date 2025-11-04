// ============================================
// Rider API - All rider-related endpoints
// ============================================

import { apiRequest } from "./client";
import { STORAGE_KEYS } from "./config";

// ============================================
// Types
// ============================================

export interface RiderSignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  vehicleType?: string;
  vehicleNumber?: string;
}

export interface RiderLoginPayload {
  email: string;
  password: string;
}

export interface RiderAuthResponse {
  token: string;
  email?: string;
  rider?: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    vehicleType?: string;
    vehicleNumber?: string;
  };
}

export interface RiderStats {
  activeOrders: number;
  completedOrders: number;
  totalEarnings: number;
}

export interface RiderOrder {
  id: number;
  code: string;
  status: string;
  subTotal?: number;
  deliveryFee?: number;
  tip?: number;
  totalAmount: number;
  riderPayout?: number;
  distanceKm?: number;
  deliveryAddress?: string;
  phone?: string;
  items?: any[];
  restaurant?: {
    id: number;
    name: string;
    address?: string;
    phone?: string;
    image?: string;
  };
  createdAt: string;
  updatedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
}

export interface Activity {
  id: number;
  orderCode: string;
  status: string;
  amount: number;
  restaurantName: string;
  deliveredAt: string;
}

// ============================================
// Authentication
// ============================================

export const riderAuth = {
  signup: (data: RiderSignupPayload) =>
    apiRequest<RiderAuthResponse>("/rider/signup", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: true,
    }),

  login: (data: RiderLoginPayload) =>
    apiRequest<RiderAuthResponse>("/rider/login", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: true,
    }),
};

// ============================================
// Rider Stats & Orders
// ============================================

export const riderStats = {
  get: () =>
    apiRequest<RiderStats>("/rider/stats", {
      tokenKey: STORAGE_KEYS.RIDER_TOKEN,
    }),
};

export const riderOrders = {
  getAvailable: () =>
    apiRequest<{ orders: RiderOrder[] }>("/rider/orders/available", {
      tokenKey: STORAGE_KEYS.RIDER_TOKEN,
    }),

  getActive: () =>
    apiRequest<{ orders: RiderOrder[] }>("/rider/orders/active", {
      tokenKey: STORAGE_KEYS.RIDER_TOKEN,
    }),

  getCompleted: () =>
    apiRequest<{ orders: RiderOrder[] }>("/rider/orders/completed", {
      tokenKey: STORAGE_KEYS.RIDER_TOKEN,
    }),

  acceptDelivery: (orderId: number) =>
    apiRequest<{ message: string; order: RiderOrder }>(`/rider/orders/${orderId}/accept`, {
      method: "PATCH",
      tokenKey: STORAGE_KEYS.RIDER_TOKEN,
    }),

  markDelivered: (orderId: number) =>
    apiRequest<{ message: string; order: RiderOrder }>(`/rider/orders/${orderId}/deliver`, {
      method: "PATCH",
      tokenKey: STORAGE_KEYS.RIDER_TOKEN,
    }),
};

export const riderActivity = {
  getRecent: () =>
    apiRequest<{ activities: Activity[] }>("/rider/activity/recent", {
      tokenKey: STORAGE_KEYS.RIDER_TOKEN,
    }),
};

// ============================================
// Rider Status
// ============================================

export const riderStatus = {
  toggleOnline: (isOnline: boolean) =>
    apiRequest<{ message: string; rider: any }>("/rider/toggle-online", {
      method: "PATCH",
      body: JSON.stringify({ isOnline }),
      tokenKey: STORAGE_KEYS.RIDER_TOKEN,
    }),

  getProfile: () =>
    apiRequest<{ rider: any }>("/rider/me", {
      tokenKey: STORAGE_KEYS.RIDER_TOKEN,
    }),
};

// ============================================
// Legacy Function Names (for backward compatibility)
// ============================================

export const registerRider = riderAuth.signup;
export const loginRider = riderAuth.login;
