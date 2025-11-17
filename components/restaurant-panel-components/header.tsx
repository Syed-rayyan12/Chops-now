"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { API_CONFIG } from "@/lib/api/config"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Bell } from "lucide-react"
import { getNotifications, markNotificationAsRead, type Notification } from "@/lib/api/notification.api"
import { formatDistanceToNow } from "date-fns"

export function Header() {
  const router = useRouter()
  const [restaurant, setRestaurant] = useState<any>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    loadRestaurantProfile()
    loadNotifications()
    
    // Listen for profile updates
    const handleProfileUpdate = () => {
      loadRestaurantProfile()
    }
    window.addEventListener('restaurant-profile-updated', handleProfileUpdate)
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000)
    
    return () => {
      window.removeEventListener('restaurant-profile-updated', handleProfileUpdate)
      clearInterval(interval)
    }
  }, [])

  const loadNotifications = async () => {
    try {
      const data = await getNotifications()
      setNotifications(data.notifications)
      setNotificationCount(data.unreadCount)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    }
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id)
      loadNotifications()
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const loadRestaurantProfile = async () => {
    try {
      const token = localStorage.getItem("restaurantToken")
      if (!token) {
        return
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/restaurant/profile`, {
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

          {/* Right side - Notifications & Profile */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100">
                  <Bell className="h-5 w-5 text-gray-600" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#FF6B35] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white border-gray-200 max-h-[400px] overflow-y-auto">
                <DropdownMenuLabel className="text-[#FF6B35] text-lg font-bold p-3">Notifications</DropdownMenuLabel>
                {notifications.length === 0 ? (
                  <DropdownMenuItem className="text-sm text-gray-500">
                    No new notifications
                  </DropdownMenuItem>
                ) : (
                  notifications.slice(0, 10).map((notification) => (
                    <DropdownMenuItem 
                      key={notification.id} 
                      className={`text-[#2D2D2D] border-b border-gray-200 rounded-none cursor-pointer ${!notification.isRead ? 'bg-orange-50' : 'bg-white'}`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="py-3 px-2 w-full">
                        <p className="text-sm font-bold text-[#FF6B35]">{notification.title}</p>
                        <p className="text-sm font-medium">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</p>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile */}
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
