"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RiderLogin } from "@/components/rider-panel-components/rider-login"
import { RestaurantSignIn } from "@/components/restaurant-panel-components/restaurant-signIn"

const Page = () => {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token")
    const email = localStorage.getItem("email")
    
    if (token && email) {
      // Already logged in, redirect to settings
      router.push("/restaurant-dashboard/settings")
    } else {
      setIsChecking(false)
    }
  }, [router])

  const handleLogin = () => {
    setIsLoggedIn(true)
    router.push("/restaurant-dashboard/settings") // Navigate to settings page after login
  }

  // Show loading while checking auth status
  if (isChecking) {
    return null
  }

  if (!isLoggedIn) {
    return <RestaurantSignIn onLogin={handleLogin} />
  }

  return null
}

export default Page;
