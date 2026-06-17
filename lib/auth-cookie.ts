// ============================================
// Role cookie - edge-guard signal for middleware
// ============================================
// Tokens live in localStorage (not readable by Next.js middleware), so we
// mirror the *role* into a lightweight, non-sensitive cookie. middleware.ts
// uses it to redirect unauthenticated visitors away from dashboards before
// any UI renders. This is defence-in-depth only — the backend `authenticate`
// middleware remains the real authority. The cookie is forgeable (like the
// token in localStorage), so never trust it for actual authorization.

import { STORAGE_KEYS } from "./api/config";

export const ROLE_COOKIE = "cn_role";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days, matches JWT expiry

export type AppRole = "ADMIN" | "RESTAURANT" | "RIDER" | "USER";

export function setRoleCookie(role: AppRole): void {
  if (typeof document === "undefined") return;
  document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
}

export function clearRoleCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

// Derive the active role from whichever token is present in localStorage and
// mirror it into the cookie. Used as a safety net so sessions that predate the
// cookie (or were opened in another tab) get a cookie on their next page load.
export function syncRoleCookie(): void {
  if (typeof window === "undefined") return;
  const ls = window.localStorage;
  let role: AppRole | null = null;
  if (ls.getItem(STORAGE_KEYS.ADMIN_TOKEN)) role = "ADMIN";
  else if (ls.getItem(STORAGE_KEYS.RESTAURANT_TOKEN)) role = "RESTAURANT";
  else if (ls.getItem(STORAGE_KEYS.RIDER_TOKEN)) role = "RIDER";
  else if (ls.getItem(STORAGE_KEYS.USER_TOKEN)) role = "USER";

  if (role) setRoleCookie(role);
  else clearRoleCookie();
}
