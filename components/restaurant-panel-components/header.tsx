"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut } from "lucide-react"

export function Header() {
  const router = useRouter()
  const [restaurant, setRestaurant] = useState<any>(null)

  useEffect(() => {
    loadRestaurantProfile()
    
    // Listen for profile updates
    const handleProfileUpdate = () => {
      loadRestaurantProfile()
    }
    window.addEventListener('restaurant-profile-updated', handleProfileUpdate)
    
    return () => {
      window.removeEventListener('restaurant-profile-updated', handleProfileUpdate)
    }
  }, [])

  const loadRestaurantProfile = async () => {
    try {
      const token = localStorage.getItem("restaurantToken")
      if (!token) {
        return
      }

      const response = await fetch("http://localhost:4000/api/restaurant/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const profileData = await response.json()
        setRestaurant(profileData)
        
        if (profileData?.ownerEmail) {
          localStorage.setItem("restaurantEmail", profileData.ownerEmail)
        }
      }
    } catch (error) {
      console.error("Failed to load restaurant profile:", error)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("restaurantToken")
    localStorage.removeItem("restaurantEmail")
    localStorage.removeItem("restaurantData")
    router.push("/restaurant-signIn")
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/restaurant-dashboard">
            <img
              src="/chopNow.png"
              alt="ChopNow Logo"
              className="h-12 w-auto object-contain cursor-pointer"
            />
          </Link>

          {/* Right side - Profile Dropdown */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-[#FF6B35] text-white cursor-pointer">
                      {restaurant
                        ? `${restaurant.ownerFirstName?.charAt(0) || ""}${restaurant.ownerLastName?.charAt(0) || ""}`.toUpperCase()
                        : "RU"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 border-gray-200 p-2 bg-white" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-[#2D2D2D] leading-none">
                      {restaurant ? `${restaurant.ownerFirstName || ""} ${restaurant.ownerLastName || ""}`.trim() || "Restaurant User" : "Restaurant User"}
                    </p>
                    <p className="text-xs leading-none text-gray-600">
                      {restaurant?.ownerEmail || "Loading..."}
                    </p>
                    <p className="text-xs leading-none text-[#FF6B35] font-semibold mt-1">
                      {restaurant?.name || "No restaurant name"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200" />
                <Link href="/restaurant-profile">
                  <DropdownMenuItem className="hover:bg-[#FF6B35] hover:text-white text-[#2D2D2D] cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/restaurant-dashboard">
                  <DropdownMenuItem className="hover:bg-[#FF6B35] hover:text-white text-[#2D2D2D] cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem onClick={handleSignOut} className="hover:bg-[#FF6B35] hover:text-white text-[#2D2D2D] cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
