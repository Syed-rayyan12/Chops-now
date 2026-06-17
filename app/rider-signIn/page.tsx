"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { RiderLogin } from "@/components/rider-panel-components/rider-login"
import { STORAGE_KEYS } from "@/lib/api/config"

const Page = () => {
  const router = useRouter()

  useEffect(() => {
    // Check if rider is already logged in
    const token = localStorage.getItem(STORAGE_KEYS.RIDER_TOKEN)
    if (token) {
      router.push("/rider-dashboard")
    }
  }, [router])

  return <RiderLogin />
}

export default Page
