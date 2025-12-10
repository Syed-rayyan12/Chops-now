// ============================================
// Contact API - Contact form submission
// ============================================

import { API_CONFIG } from "./config";

// ============================================
// Types
// ============================================

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
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
    console.log("📤 Submitting contact form...", data);
    
    const url = `${API_CONFIG.BASE_URL}/contact/submit`;
    console.log("🌐 Contact API URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log("📥 Response status:", response.status);

    const result = await response.json();
    console.log("📦 Response data:", result);

    return result;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error("❌ Contact form submission error:", error);
    
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
