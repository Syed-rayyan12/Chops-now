// ============================================
// Contact API - Contact form submission
// ============================================

import { API_CONFIG } from "./config";
import { logger } from "@/lib/logger";

// ============================================
// Types
// ============================================

export interface ContactFormData {
  firstName: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

// ============================================
// API Functions
// ============================================

/**
 * Submit contact form
 * Sends contact form data to backend which emails all company accounts
 */
export async function submitContactForm(data: ContactFormData): Promise<ContactResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    logger.debug("📤 Submitting contact form...", data);
    
    const url = `${API_CONFIG.BASE_URL}/contact/submit`;
    logger.debug("🌐 Contact API URL:", url);

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
    logger.error("❌ Contact form submission error:", error);
    
    if (error.name === 'AbortError') {
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
