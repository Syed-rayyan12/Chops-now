"use client"

import { useEffect } from "react"
import { syncRoleCookie } from "@/lib/auth-cookie"

// Mirrors the active role from localStorage into the `cn_role` cookie on load
// and on cross-tab storage changes. This keeps the middleware edge-guard in
// sync for sessions that predate the cookie or were changed in another tab,
// so already-logged-in users are not bounced to a sign-in page. Renders nothing.
export function RoleCookieSync() {
  useEffect(() => {
    syncRoleCookie()
    const onStorage = () => syncRoleCookie()
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  return null
}
