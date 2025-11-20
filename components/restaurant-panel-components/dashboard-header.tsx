// "use client"

// import { Bell, Search, User, MenuIcon, Settings, LogOut, BarChart3, LayoutDashboard, ShoppingBag, Store, Truck, Users, ChefHat, CreditCard, HelpCircle, Home, ShoppingCart, Star } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   Sheet,
//   SheetContent,
//   SheetTrigger,
// } from "@/components/ui/sheet"
// import { useState } from "react"
// import { Separator } from "../ui/separator"
// import { cn } from "@/lib/utils"
// import { usePathname } from "next/navigation"
// import Link from "next/link"

// const MenuNav = [
//   { href: "/restaurant-dashboard/overview", name: "Overview", icon: Home },
//   { href: "/restaurant-dashboard/orders", name: "Orders", icon: ShoppingCart },
//   { href: "/restaurant-dashboard/menu-management", name: "Menu Management", icon: ChefHat },
//   { href: "/restaurant-dashboard/earning-payment", name: "Earnings & Payments", icon: CreditCard },
//   { href: "/restaurant-dashboard/reviews-rating", name: "Reviews & Ratings", icon: Star },
//   { href: "/restaurant-dashboard/support", name: "Support", icon: HelpCircle },
// ]

// interface Notification {
//   id: string
//   message: string
//   time: string
//   status: "read" | "unread"
// }
// type DashboardHeaderProps = {
//   collapsed: boolean
//   setCollapsed: (collapsed: boolean) => void
//   notifications: Notification[]
//   onSignOut: () => void
// }

// export function DashboardHeader({ collapsed, setCollapsed, onSignOut,notifications }: DashboardHeaderProps) {
//   const pathname = usePathname()
//   const [mobileOpen, setMobileOpen] = useState(false)
//   const unreadCount = notifications.filter((n) => n.status === "unread").length

//   return (
//     <header className="bg-background border-b border-orange-200 px-6 py-[13px]  h-16">
//       <div className="flex items-center justify-between">
//         {/* Left side with toggle & title */}
//         <div className="flex items-center space-x-4">
//           <div className="flex gap-2">
//             {/* Mobile: open Sheet */}
//             <div className="lg:hidden">
//               <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
//                 <SheetTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="text-orange-600 hover:text-orange-800 cursor-pointer hover:bg-orange-100"
//                   >
//                     <MenuIcon className="h-4 w-4" />
//                   </Button>
//                 </SheetTrigger>

//                 {/* Sidebar content */}
//                 <SheetContent
//                   side="left"
//                   className="w-72 max-w-[85vw] bg-white p-4 border-r z-50"
//                 >
//                   <h2 className="text-lg font-semibold text-orange-800 mb-4">
//                     Menu
//                   </h2>
//                   <div className="space-y-2">
//                     {MenuNav.map((item, idx) => {
//                       const Icon = item.icon
//                       const isActive = pathname === item.href

//                       return (
//                         <Link key={item.href} href={item.href}>
//                           <Button
//                             variant="ghost"
//                             className={cn(
//                               "w-full justify-start",
//                               isActive && "bg-orange-100 text-orange-700"
//                             )}
//                           >
//                             <Icon className="mr-2 h-4 w-4" />
//                             {item.name}
//                           </Button>
//                           {idx < MenuNav.length - 1 && <Separator />}
//                         </Link>
//                       )
//                     })}
//                   </div>
//                 </SheetContent>
//               </Sheet>
//             </div>

//             {/* Desktop: toggle collapsed state */}
//             <div className="hidden lg:block">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setCollapsed(!collapsed)}
//                 className="text-orange-600 hover:text-orange-800 cursor-pointer hover:bg-orange-100"
//               >
//                 <MenuIcon className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>

//           <h1 className="text-2xl font-bold text-secondary">Dashboard</h1>
//         </div>

//         {/* Right side with search, notifications & profile */}
//         <div className="flex items-center space-x-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-amber-500 h-4 w-4" />
//             <Input
//               placeholder="Search orders, restaurants, users..."
//               className="pl-10 w-full border-secondary/50"
//             />
//           </div>

         

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="sm" className="relative text-secondary/60 hover:text-secondary hover:bg-secondary/10">
//                 <Bell className="h-5 w-5" />
//                 {unreadCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                     {unreadCount}
//                   </span>
//                 )}
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-80 border border-secondary">
//               {notifications.length === 0 ? (
//                 <DropdownMenuItem className="p-3 text-sm text-gray-500">
//                   No new notifications
//                 </DropdownMenuItem>
//               ) : (
//                 notifications.slice(0, 3).map((notification) => (
//                   <DropdownMenuItem key={notification.id} className="p-3">
//                     <div className="space-y-1">
//                       <p className="text-sm font-medium">{notification.message}</p>
//                       <p className="text-xs text-gray-500">{notification.time}</p>
//                     </div>
//                   </DropdownMenuItem>
//                 ))
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//                 <Avatar className="h-8 w-8">
//                   <AvatarImage src="/admin-profile.png" alt="Admin" />
//                   <AvatarFallback className="bg-orange-100 text-secondary">
//                     AD
//                   </AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-56" align="end" forceMount>
//               <DropdownMenuLabel className="font-normal">
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium leading-none">Admin User</p>
//                   <p className="text-xs leading-none text-muted-foreground">
//                     admin@chopnow.com
//                   </p>
//                 </div>
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>
//                 <User className="h-4 w-4" />
//                 <span>Profile</span>
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <Settings className="h-4 w-4" />
//                 <span>Settings</span>
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>
//                 <LogOut className="h-4 w-4" />
//                 <span>Log out</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </header>
//   )
// } 


"use client"

import {
  Bell, Search, User, MenuIcon, Settings, LogOut, ChefHat, CreditCard,
  HelpCircle, Home, ShoppingCart, Star, Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { API_CONFIG } from "@/lib/api/config"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { Separator } from "../ui/separator"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { MobileBottomNav } from "./mobile-bottom-nav"

const MenuNav = [
  { href: "/restaurant-dashboard", name: "Overview", icon: Home },
  { href: "/restaurant-dashboard/orders", name: "Orders", icon: ShoppingCart },
  { href: "/restaurant-dashboard/menu-management", name: "Menu Management", icon: ChefHat },
  { href: "/restaurant-dashboard/earning-payment", name: "Earnings & Payments", icon: CreditCard },
  { href: "/restaurant-dashboard/review-rating", name: "Reviews & Ratings", icon: Star },
  { href: "/restaurant-dashboard/support", name: "Support", icon: HelpCircle },
]

interface Notification {
  id: string
  message: string
  time: string
  status: "read" | "unread"
}

type DashboardHeaderProps = {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  notifications: Notification[]
  onSignOut: () => void
}

export function DashboardHeader({ collapsed, setCollapsed, onSignOut, notifications }: DashboardHeaderProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [restaurant, setRestaurant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const unreadCount = notifications.filter((n) => n.status === "unread").length

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
        setLoading(false)
        return
      }

      // Fetch profile from API
      const response = await fetch(`${API_CONFIG.BASE_URL}/restaurant/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const profileData = await response.json()
        setRestaurant(profileData)
        
        // Keep localStorage email in sync
        if (profileData?.ownerEmail) {
          localStorage.setItem("restaurantEmail", profileData.ownerEmail)
        }
      }
    } catch (error) {
      console.error("Failed to load restaurant profile:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <header className="bg-background px-3 sm:px-6 py-3 sm:py-[23px] min-h-[60px] sm:h-16">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left side with toggle & title */}
        <div className="flex items-center space-x-4">
          <div className="flex gap-2">
            {/* Mobile: open Sheet */}
            <div className="lg:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary cursor-pointer hover:bg-orange-100"
                  >
                    <MenuIcon className="h-4 w-4 text-primary" />
                  </Button>
                </SheetTrigger>

                {/* Sidebar content */}
                <SheetContent
                  side="left"
                  className="w-72 max-w-[85vw] bg-white p-4 border-r z-50"
                >
                  <Link href="/restaurant-dashboard">
                      <img
                        src="/chopNow.png"
                        alt="ChopNow Logo"
                        className="mx-auto w-36 h-full px-2 object-cover"
                      />
                    </Link>

                  {/* Search only in mobile menu */}
                  {/* <div className="relative mb-4 sm:hidden">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-amber-500 h-4 w-4" />
                    <Input
                      placeholder="Search orders, restaurants, users..."
                      className="pl-10 w-ful border border-primary/50"
                    />
                  </div> */}

                  <div className="space-y-2">
                    {MenuNav.map((item, idx) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href

                      return (
                        <Link key={item.href} href={item.href} onClick={()=> setMobileOpen(false)}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start",
                              isActive && "bg-orange-100 text-secondary"
                            )}
                          >
                            <Icon className="mr-2 h-4 w-4" />
                            {item.name}
                          </Button>
                          {idx < MenuNav.length - 1 }
                        </Link>
                      )
                    })}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop: toggle collapsed state */}
            <div className="hidden lg:block">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCollapsed(!collapsed)}
                className="text-orange-600 hover:text-orange-800 cursor-pointer hover:bg-orange-100"
              >
                <MenuIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <h1 className="text-lg sm:text-2xl font-bold text-primary hidden sm:block">Dashboard</h1>
        </div>

        {/* Right side with search (hidden on small screens), notifications & profile */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1 sm:w-full justify-end">
          {/* Search bar on desktop only */}
          <div className="hidden lg:block relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-300 h-4 w-4" />
            <Input
              placeholder="Search orders, restaurants, users..."
              className="pl-10 w-full bg-white border text-gray-300 border-gray-200 h-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="relative text-foreground/60 bg-white rounded-full w-9 h-9 sm:w-10 sm:h-10 cursor-pointer hover:bg-white p-0">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80  bg-white border-none border">
              <DropdownMenuLabel className="text-primary text-lg font-bold p-3">Notifications</DropdownMenuLabel>

              {notifications.length <= 1 ? (
                <DropdownMenuItem className="text-sm text-gray-500">
                  No new notifications
                </DropdownMenuItem>
              ) : (
                notifications.slice(0, 3).map((notification, index) => (
                  <DropdownMenuItem key={notification.id} className={`text-foreground border-b border-gray-400 rounded-none ${index < 2 ? 'bg-[#DCFCE7]' : 'bg-white'}`}>
                    <div className="py-3 px-2">

                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs">{notification.time}</p>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

         
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full p-0">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage src="/admin-profile.png" alt="Admin" />
                  <AvatarFallback className="bg-secondary text-white  cursor-pointer">
                      {restaurant
                          ? `${restaurant.ownerFirstName?.charAt(0) || ""}${restaurant.ownerLastName?.charAt(0) || ""}`.toUpperCase()
                          : "RU"}
                    </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 border border-none p-2 bg-white" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-foreground leading-none">
                    {restaurant ? `${restaurant.ownerFirstName || ""} ${restaurant.ownerLastName || ""}`.trim() || "Restaurant User" : "Restaurant User"}
                  </p>
                  <p className="text-xs leading-none text-secondary">
                    {restaurant?.ownerEmail || "No email available"}
                  </p>
                  <p className="text-xs leading-none text-secondary font-semibold mt-1">
                    {restaurant?.name || "No restaurant name"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-primary/50" />
              <Link href="/restaurant-profile">
                <DropdownMenuItem className="hover:bg-primary hover:text-white text-foreground cursor-pointer">
                  <User className="h-4 w-4" />
                  <span className="text-foreground">Profile</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator className="bg-primary/50" />
              <DropdownMenuItem onClick={onSignOut} className="hover:bg-primary hover:text-white text-foreground cursor-pointer">
                <LogOut className="h-4 w-4 hover:text-white" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </header>
  )
}

