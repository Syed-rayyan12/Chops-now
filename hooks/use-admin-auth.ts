"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { STORAGE_KEYS } from "@/lib/api/config"
import { clearRoleCookie } from "@/lib/auth-cookie"
import { logger } from "@/lib/logger";

interface AdminUser {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
}

export const useAdminAuth = () => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN)
      const userStr = localStorage.getItem("adminUser")

      if (!token) {
        logger.debug("❌ No admin token found - redirecting to login")
        router.push("/admin-signin")
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      // Verify token is not expired
      const tokenPayload = parseJwt(token)
      if (tokenPayload && tokenPayload.exp) {
        const isExpired = Date.now() >= tokenPayload.exp * 1000
        if (isExpired) {
          logger.debug("❌ Admin token expired - redirecting to login")
          logout()
          return
        }
      }

      // Token is valid
      setIsAuthenticated(true)
      
      if (userStr) {
        try {
          setAdminUser(JSON.parse(userStr))
        } catch (e) {
          logger.error("Failed to parse admin user:", e)
        }
      }
    } catch (error) {
      logger.error("Auth check error:", error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN)
    localStorage.removeItem("adminUser")
    clearRoleCookie()
    setIsAuthenticated(false)
    setAdminUser(null)
    router.push("/admin-signin")
  }

  return {
    isAuthenticated,
    isLoading,
    adminUser,
    logout,
    checkAuth,
  }
}

// Helper function to parse JWT token
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    logger.error("Failed to parse JWT:", error)
    return null
  }
}
