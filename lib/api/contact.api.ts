// ============================================
// Contact API - Contact form submission
// ============================================

import { apiRequest } from "./client";

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
  try {
    const response = await apiRequest<ContactResponse>("/contact/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      skipAuth: true, // No authentication needed for contact form
    });

    return response;
  } catch (error: any) {
    console.error("Contact form submission error:", error);
    return {
      success: false,
      message: error.message || "Network error. Please check your connection and try again.",
    };
  }
}
