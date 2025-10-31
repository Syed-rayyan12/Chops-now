"use client"
import { MenuManagementSection } from '@/components/restaurant-panel-components/menu-management-section'
import React, { useState, useEffect } from 'react'

const Page = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Show loader for 2 seconds before displaying content
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-secondary"></div>
          <p className="mt-4 text-lg font-medium text-secondary">Loading menu management...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Categories Section */}
     
      
      {/* Menu Items Section */}
      <MenuManagementSection />
    </div>
  )
}

export default Page