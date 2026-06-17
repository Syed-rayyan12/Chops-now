// ============================================
// Logger - dev-gated console wrapper (backend)
// ============================================
// debug/warn are silenced in production; error always prints.
// Use this instead of raw console.* so production logs stay clean and
// secrets (passwords, tokens, request bodies) never leak to stdout.

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
