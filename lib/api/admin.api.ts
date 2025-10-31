// ============================================
// Admin API - All admin-related endpoints
// ============================================

import { apiRequest } from "./client";
import { STORAGE_KEYS } from "./config";

// ============================================
// Types
// ============================================

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminAuthResponse {
  token: string;
  role?: string;
  admin?: {
    id: number;
    email: string;
    role: string;
  };
}

// ============================================
// Authentication
// ============================================

export const adminAuth = {
  login: (data: AdminLoginPayload) =>
    apiRequest<AdminAuthResponse>("/admin/login", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: true,
    }),
};

// ============================================
// Restaurant Management
// ============================================

export const getAdminRestaurants = (params?: { search?: string; status?: string }) => {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append("search", params.search);
  if (params?.status) queryParams.append("status", params.status);
  
  const queryString = queryParams.toString();
  return apiRequest<any[]>(`/admin/restaurants${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN)}`,
    },
  });
};

// ============================================
// User Management
// ============================================

export const getAdminUsers = (params?: { search?: string; status?: string }) => {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append("search", params.search);
  if (params?.status) queryParams.append("status", params.status);
  
  const queryString = queryParams.toString();
  return apiRequest<any[]>(`/admin/users${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN)}`,
    },
  });
};

// ============================================
// Dashboard Stats
// ============================================

export const getAdminStats = () => {
  return apiRequest<{
    totalOrders: number;
    activeRestaurants: number;
    totalUsers: number;
    totalRevenue: number;
  }>("/admin/stats", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN)}`,
    },
  });
};

export const getAdminRecentOrders = (limit?: number) => {
  const queryString = limit ? `?limit=${limit}` : "";
  return apiRequest<any[]>(`/admin/recent-orders${queryString}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN)}`,
    },
  });
};

export const getAdminOrders = (params?: { search?: string; status?: string; sortBy?: string; sortOrder?: string }) => {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append("search", params.search);
  if (params?.status) queryParams.append("status", params.status);
  if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  
  const queryString = queryParams.toString();
  return apiRequest<{ orders: any[]; stats: any }>(`/admin/orders${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN)}`,
    },
  });
};

// ============================================
// Legacy Function Names (for backward compatibility)
// ============================================

export const loginAdmin = adminAuth.login;
