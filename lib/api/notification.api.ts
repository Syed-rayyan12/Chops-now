import { apiRequest } from "./client";
import { STORAGE_KEYS } from "./config";

export type NotificationType = "ORDER_STATUS" | "SUPPORT_MESSAGE" | "SYSTEM_ALERT" | "PAYMENT" | "DELIVERY";

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  recipientRole: string;
  recipientId: number | null;
  isRead: boolean;
  metadata: string | null;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

export interface CreateNotificationDto {
  type: NotificationType;
  title: string;
  message: string;
  recipientRole: string;
  recipientId?: number;
  metadata?: Record<string, any>;
}

// Get all notifications for current user
export async function getNotifications(): Promise<NotificationsResponse> {
  const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) || 
                localStorage.getItem(STORAGE_KEYS.RESTAURANT_TOKEN) || 
                localStorage.getItem(STORAGE_KEYS.RIDER_TOKEN);
  
  return apiRequest<NotificationsResponse>("/notification", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Mark notification as read
export async function markNotificationAsRead(id: number): Promise<Notification> {
  const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) || 
                localStorage.getItem(STORAGE_KEYS.RESTAURANT_TOKEN) || 
                localStorage.getItem(STORAGE_KEYS.RIDER_TOKEN);
  
  return apiRequest<Notification>(`/notification/${id}/read`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(): Promise<{ message: string }> {
  const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) || 
                localStorage.getItem(STORAGE_KEYS.RESTAURANT_TOKEN) || 
                localStorage.getItem(STORAGE_KEYS.RIDER_TOKEN);
  
  return apiRequest<{ message: string }>("/notification/read-all", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Delete notification
export async function deleteNotification(id: number): Promise<{ message: string }> {
  const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) || 
                localStorage.getItem(STORAGE_KEYS.RESTAURANT_TOKEN) || 
                localStorage.getItem(STORAGE_KEYS.RIDER_TOKEN);
  
  return apiRequest<{ message: string }>(`/notification/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Create notification (admin only)
export async function createNotification(data: CreateNotificationDto): Promise<Notification> {
  const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
  
  return apiRequest<Notification>("/notification", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

// Submit support message (creates admin notification)
export async function submitSupportMessage(subject: string, message: string): Promise<{ message: string }> {
  const token = localStorage.getItem(STORAGE_KEYS.RESTAURANT_TOKEN);
  
  return apiRequest<{ message: string }>("/restaurant/support", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subject, message }),
  });
}
