import { apiRequest } from "./client";
import { STORAGE_KEYS } from "./config";

export interface OrderItem {
  menuItemId?: number;
  quantity: number;
  price: number;
  name?: string;
  title: string;
}

export interface CreateOrderPayload {
  restaurantId: number;
  items: OrderItem[];
  deliveryAddress: string;
  deliveryInstructions?: string;
  paymentMethod?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerLatitude?: number;
  customerLongitude?: number;
}

export interface Order {
  id: number;
  code: string;
  customerId: number;
  restaurantId: number;
  riderId?: number | null;
  status: 'PENDING' | 'PREPARING' | 'READY_FOR_PICKUP' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED';
  subTotal: number;
  deliveryFee: number;
  tip: number;
  riderPayout: number;
  amount: number;
  distanceKm?: number | null;
  customerLatitude?: number | null;
  customerLongitude?: number | null;
  deliveryAddress?: string;
  assignedAt?: string | null;
  pickedUpAt?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
  updatedAt: string;
  addressId?: number | null;
  items: OrderItemDetail[];
  restaurant?: any;
  customer?: any;
  rider?: any;
  address?: any;
}

export interface OrderItemDetail {
  id: number;
  orderId: number;
  title: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export interface OrderStats {
  pendingOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export interface Earnings {
  today: number;
  weekly: number;
}

// ============================================
// Customer Order APIs
// ============================================

export const customerOrders = {
  create: (data: CreateOrderPayload) =>
    apiRequest<{ message: string; order: Order }>("/user/orders", {
      method: "POST",
      tokenKey: STORAGE_KEYS.USER_TOKEN,
      body: JSON.stringify(data),
    }),

  getMyOrders: () =>
    apiRequest<{ orders: Order[] }>("/user/orders", {
      tokenKey: STORAGE_KEYS.USER_TOKEN,
    }),

  getById: (orderId: number) =>
    apiRequest<{ order: Order }>(`/user/orders/${orderId}`, {
      tokenKey: STORAGE_KEYS.USER_TOKEN,
    }),
};

// ============================================
// Restaurant Order APIs
// ============================================

export const restaurantOrders = {
  getAll: (slug: string, status?: string) => {
    const query = status ? `?status=${status}` : "";
    return apiRequest<{ orders: Order[] }>(`/restaurant/${slug}/orders${query}`, {
      tokenKey: STORAGE_KEYS.RESTAURANT_TOKEN,
    });
  },

  updateStatus: (slug: string, orderId: number, status: string) =>
    apiRequest<{ order: Order }>(`/restaurant/${slug}/orders/${orderId}`, {
      method: "PATCH",
      tokenKey: STORAGE_KEYS.RESTAURANT_TOKEN,
      body: JSON.stringify({ status }),
    }),

  getStats: (slug: string) =>
    apiRequest<{ stats: OrderStats }>(`/restaurant/${slug}/stats`, {
      tokenKey: STORAGE_KEYS.RESTAURANT_TOKEN,
    }),

  getEarnings: (slug: string) =>
    apiRequest<{ earnings: Earnings }>(`/restaurant/${slug}/earnings`, {
      tokenKey: STORAGE_KEYS.RESTAURANT_TOKEN,
    }),

  acceptOrder: (slug: string, orderId: number) =>
    apiRequest<{ message: string; order: Order }>(`/restaurant/${slug}/orders/${orderId}/accept`, {
      method: "PATCH",
      tokenKey: STORAGE_KEYS.RESTAURANT_TOKEN,
    }),

  markReady: (slug: string, orderId: number) =>
    apiRequest<{ message: string; order: Order }>(`/restaurant/${slug}/orders/${orderId}/ready`, {
      method: "PATCH",
      tokenKey: STORAGE_KEYS.RESTAURANT_TOKEN,
    }),

  cancelOrder: (slug: string, orderId: number) =>
    apiRequest<{ message: string; order: Order }>(`/restaurant/${slug}/orders/${orderId}/cancel`, {
      method: "PATCH",
      tokenKey: STORAGE_KEYS.RESTAURANT_TOKEN,
    }),
};

// Backward-compatible exports
export const createOrder = customerOrders.create;
export const getMyOrders = customerOrders.getMyOrders;
export const getOrderById = customerOrders.getById;
export const getRestaurantOrders = restaurantOrders.getAll;
export const updateOrderStatus = restaurantOrders.updateStatus;
export const getRestaurantStats = restaurantOrders.getStats;
export const getRestaurantEarnings = restaurantOrders.getEarnings;
