// ============================================
// Safe localStorage helpers
// ============================================
// Corrupted localStorage values (truncated JSON, manual tampering) otherwise
// throw from JSON.parse during render and white-screen the page. These helpers
// always return a fallback instead of throwing.

import { logger } from "./logger";

/** Parse a JSON string, returning `fallback` on any error. */
export function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  if (value == null) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (e) {
    logger.warn("safeJsonParse: invalid JSON, using fallback", e);
    return fallback;
  }
}

/** Read and JSON-parse a localStorage key, returning `fallback` on any error. */
export function getJsonItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  return safeJsonParse(window.localStorage.getItem(key), fallback);
}
