"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RiderLogin } from "@/components/rider-panel-components/rider-login"

const Page = () => {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token")
    const riderData = localStorage.getItem("riderData")
    
    if (token && riderData) {
      // Redirect to dashboard if already logged in
      router.push("/rider-dashboard")
    }
  }, [router])

  return <RiderLogin />
}

export default Page
