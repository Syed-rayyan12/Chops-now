"use client"

import RestaurantSignup from '@/components/restaurant-panel-components/restaurant-signup'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Page = () => {
  const router = useRouter()
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

  // Show loading while checking auth status
  if (isChecking) {
    return null
  }

  return (
    <>
        <RestaurantSignup/>  
    </>
  )
}

export default Page
