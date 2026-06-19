// ============================================
// User API - All user-related endpoints
// ============================================

import { apiRequest, apiRequestFormData } from "./client";
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
  address?: string | null;
  image?: string | null;
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

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  /** New profile picture to upload to R2. */
  imageFile?: File | null;
  /** Clear the existing profile picture. */
  removeImage?: boolean;
}

export const userProfile = {
  get: () =>
    apiRequest<{ user: UserProfile }>("/user/profile", {
      tokenKey: STORAGE_KEYS.USER_TOKEN,
    }).then((res) => res.user),

  // Sent as multipart/form-data so the photo is uploaded to R2 (stored as a
  // URL) instead of being inlined as a base64 blob in the database.
  update: (data: UpdateProfilePayload) => {
    const form = new FormData();
    if (data.firstName !== undefined) form.append("firstName", data.firstName);
    if (data.lastName !== undefined) form.append("lastName", data.lastName);
    if (data.email !== undefined) form.append("email", data.email);
    if (data.phone !== undefined) form.append("phone", data.phone ?? "");
    if (data.address !== undefined) form.append("address", data.address ?? "");
    if (data.imageFile) {
      form.append("image", data.imageFile);
    } else if (data.removeImage) {
      // Empty value signals explicit removal to the backend.
      form.append("image", "");
    }

    return apiRequestFormData<{ user: UserProfile }>("/user/profile", form, {
      method: "PUT",
      tokenKey: STORAGE_KEYS.USER_TOKEN,
    }).then((res) => res.user);
  },
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
