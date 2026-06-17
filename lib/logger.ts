// ============================================
// Logger - dev-gated console wrapper
// ============================================
// debug/warn are silenced in production builds; error always prints.
// Use this instead of raw console.* so production logs stay clean and
// sensitive data never leaks into the browser console.

const isDev = process.env.NODE_ENV !== "production";

export const logger = {
  debug: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    console.error(...args);
  },
};
