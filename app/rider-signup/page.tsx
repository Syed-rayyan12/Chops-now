"use client"

import RiderSignup from '@/components/rider-panel-components/rider-signup'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const page = () => {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token")
    const riderData = localStorage.getItem("riderData")
    
    if (token && riderData) {
      // Redirect to dashboard if already logged in
      router.push("/rider-dashboard")
    }
  }, [router])

  return (
    <div>
       <RiderSignup/>
    </div>
  )
}

export default page
