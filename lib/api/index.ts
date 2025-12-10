// ============================================
// API Index - Central export point for all API modules
// ============================================

// Export all from individual API modules
export * from "./user.api";
export * from "./rider.api";

// Admin API - exclude conflicting exports
export {
  // Types
  type AdminLoginPayload,
  type AdminAuthResponse,
  type AnalyticsStats,
  type MonthlyRevenueData,
  type AnalyticsResponse,
  // Functions
  adminAuth,
  getAdminRestaurants,
  getAdminUsers,
  getAdminRiders,
  getAdminStats,
  getAdminRecentOrders,
  getAdminOrders,
  getAdminAnalytics,
  loginAdmin,
  // Exclude: getUserOrders, getRestaurantOrders (conflicts with order.api)
} from "./admin.api";

export * from "./restaurant.api";

// Order API - exclude conflicting exports
export {
  // Types
  type OrderItem,
  type CreateOrderPayload,
  type Order,
  type OrderItemDetail,
  type OrderStats,
  type Earnings,
  // Functions
  customerOrders,
  restaurantOrders,
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getRestaurantStats,
  getRestaurantEarnings,
  // Exclude: getRestaurantOrders (conflicts with admin.api)
} from "./order.api";

export * from "./contact.api";

// Export utilities
export * from "./client";
export * from "./config";
