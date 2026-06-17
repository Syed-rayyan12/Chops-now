// ============================================
// Newsletter API - Subscription
// ============================================

import { API_CONFIG } from "./config";
import { logger } from "@/lib/logger";

// ============================================
// Types
// ============================================

export interface NewsletterSubscriptionData {
  email: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
}

// ============================================
// API Functions
// ============================================

/**
 * Subscribe to newsletter
 * Sends subscriber email to backend for notification
 */
export async function submitNewsletterSubscription(
  data: NewsletterSubscriptionData
): Promise<NewsletterResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    logger.debug("📤 Submitting newsletter subscription...", data);

    const url = `${API_CONFIG.BASE_URL}/newsletter/subscribe`;
    logger.debug("🌐 Newsletter API URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    logger.debug("📥 Response status:", response.status);

    const result = await response.json();
    logger.debug("📦 Response data:", result);

    return result;
  } catch (error: any) {
    clearTimeout(timeoutId);
    logger.error("❌ Newsletter subscription error:", error);

    if (error.name === "AbortError") {
      return {
        success: false,
        message: "Request timed out. Please try again.",
      };
    }

    return {
      success: false,
      message: error.message || "Network error. Please check your connection and try again.",
    };
  }
}
