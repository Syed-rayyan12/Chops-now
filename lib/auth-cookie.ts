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
// The role the user most recently logged in as. Used so a stale token left over
// from another role can't override the active session when deriving the cookie.
const ACTIVE_ROLE_KEY = "cn_active_role";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days, matches JWT expiry

export type AppRole = "ADMIN" | "RESTAURANT" | "RIDER" | "USER";

// Token key per role.
const ROLE_TOKEN_KEYS: Record<AppRole, string> = {
  ADMIN: STORAGE_KEYS.ADMIN_TOKEN,
  RESTAURANT: STORAGE_KEYS.RESTAURANT_TOKEN,
  RIDER: STORAGE_KEYS.RIDER_TOKEN,
  USER: STORAGE_KEYS.USER_TOKEN,
};

// All localStorage keys owned by each role, purged when switching roles so a
// previous session's token/profile can't linger and misroute the new login.
const ROLE_DATA_KEYS: Record<AppRole, string[]> = {
  ADMIN: [STORAGE_KEYS.ADMIN_TOKEN, "adminUser"],
  RESTAURANT: [
    STORAGE_KEYS.RESTAURANT_TOKEN,
    STORAGE_KEYS.RESTAURANT_EMAIL,
    "restaurantSlug",
    "restaurantData",
  ],
  RIDER: [STORAGE_KEYS.RIDER_TOKEN, "riderEmail", "riderData"],
  USER: [STORAGE_KEYS.USER_TOKEN, STORAGE_KEYS.USER_EMAIL],
};

const ALL_ROLES: AppRole[] = ["ADMIN", "RESTAURANT", "RIDER", "USER"];

// Write only the cookie. Internal helper used by both the login path and the
// passive sync path.
function writeRoleCookie(role: AppRole): void {
  if (typeof document === "undefined") return;
  document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
}

// Called at login/OAuth for the role the user just authenticated as. Records the
// active role, purges every OTHER role's tokens/data so only one session exists,
// and writes the role cookie. Destructive by design: logging in as one role ends
// any other role's session in this browser.
export function setRoleCookie(role: AppRole): void {
  if (typeof window !== "undefined") {
    const ls = window.localStorage;
    for (const other of ALL_ROLES) {
      if (other === role) continue;
      for (const key of ROLE_DATA_KEYS[other]) ls.removeItem(key);
    }
    ls.setItem(ACTIVE_ROLE_KEY, role);
  }
  writeRoleCookie(role);
}

export function clearRoleCookie(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(ACTIVE_ROLE_KEY);
  }
  if (typeof document === "undefined") return;
  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

// Passive sync (runs on load and cross-tab storage events). Derives the active
// role WITHOUT destroying tokens. It prefers the explicitly recorded active role
// (as long as that role's token is still present), and only falls back to single-
// token detection for legacy sessions that predate the active-role marker. This
// prevents a stale token from another role — higher in the old precedence list —
// from silently overwriting the role the user actually logged in as.
export function syncRoleCookie(): void {
  if (typeof window === "undefined") return;
  const ls = window.localStorage;

  const active = ls.getItem(ACTIVE_ROLE_KEY) as AppRole | null;
  if (active && ROLE_TOKEN_KEYS[active] && ls.getItem(ROLE_TOKEN_KEYS[active])) {
    writeRoleCookie(active);
    return;
  }

  // Legacy fallback: no active-role marker. Use whichever single token exists.
  let role: AppRole | null = null;
  if (ls.getItem(STORAGE_KEYS.ADMIN_TOKEN)) role = "ADMIN";
  else if (ls.getItem(STORAGE_KEYS.RESTAURANT_TOKEN)) role = "RESTAURANT";
  else if (ls.getItem(STORAGE_KEYS.RIDER_TOKEN)) role = "RIDER";
  else if (ls.getItem(STORAGE_KEYS.USER_TOKEN)) role = "USER";

  if (role) writeRoleCookie(role);
  else clearRoleCookie();
}
