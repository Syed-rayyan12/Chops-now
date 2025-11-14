"use client"

import {   
  Bell, Search, User, MenuIcon, Settings, LogOut, Home, ShoppingCart, CreditCard,
  HelpCircle, Star, ChefHat
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {   
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { STORAGE_KEYS, API_CONFIG } from "@/lib/api/config"
import { MobileBottomMenu } from "./rider-menu"

// ✅ NEW IMPORT


const MenuNav = [
  { href: "/rider-dashboard", name: "Dashboard", icon: Home },
  { href: "/rider-dashboard/orders", name: "Orders", icon: ShoppingCart },
  { href: "/rider-dashboard/earnings", name: "Earnings", icon: CreditCard },
]

interface Notification {
  id: string
  message: string
  time: string
  status: "read" | "unread"
}

type RiderHeaderProps = {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  notifications: Notification[]
  onSignOut: () => void
}

export function RiderHeader({ collapsed, setCollapsed, notifications, onSignOut }: RiderHeaderProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [rider, setRider] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const unreadCount = notifications.filter((n) => n.status === "unread").length

  useEffect(() => {
    const fetchRiderData = async () => {
      try {
        const token =
          localStorage.getItem(STORAGE_KEYS.RIDER_TOKEN) ||
          localStorage.getItem("riderToken")

        if (token) {
          const response = await fetch(`${API_CONFIG.BASE_URL}/rider/me`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (response.ok) {
            const data = await response.json()
            setRider(data.rider)
          }
        }
      } catch (error) {
        console.error("Failed to load rider data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRiderData()
  }, [])

  return (
    <>
      {/* HEADER */}
      <header className="bg-background px-6 py-[23px] h-16">
        <div className="flex items-center justify-between gap-4">

          {/* Left */}
          <div className="flex items-center space-x-4">
            <div className="flex gap-2">
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

                  <SheetContent
                    side="left"
                    className="w-72 max-w-[85vw] bg-white p-4 border-r z-50"
                  >
                    <Link href="/rider-dashboard">
                      <img
                        src="/chopNow.png"
                        alt="ChopNow Logo"
                        className="mx-auto w-36 h-full px-2 object-cover"
                      />
                    </Link>

                    <div className="space-y-2 mt-4">
                      {MenuNav.map((item, idx) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                          <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
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
                          </Link>
                        )
                      })}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

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

            <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          </div>

          {/* Right */}
          <div className="flex items-center space-x-4 w-full">
            <div className="hidden lg:block relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-300 h-4 w-4" />
              <Input
                placeholder="Search orders, restaurants, users..."
                className="pl-10 w-full bg-white border text-gray-300 border-gray-200 h-10"
              />
            </div>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="relative text-foreground/60 bg-white rounded-full w-10 h-10 cursor-pointer hover:bg-white">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white border-none">
                <DropdownMenuLabel className="text-primary text-lg font-bold p-3">
                  Notifications
                </DropdownMenuLabel>

                {notifications.length <= 1 ? (
                  <DropdownMenuItem className="text-sm text-gray-500">
                    No new notifications
                  </DropdownMenuItem>
                ) : (
                  notifications.slice(1, 4).map((notification, index) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`text-foreground border-b border-gray-400 rounded-none ${
                        index < 2 ? "bg-[#DCFCE7]" : "bg-white"
                      }`}
                    >
                      <div className="py-3 px-2">
                        <p className="text-sm font-medium">{notification.message}</p>
                        <p className="text-xs">{notification.time}</p>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/admin-profile.png" alt="Admin" />
                    <AvatarFallback className="bg-secondary text-white cursor-pointer">
                      { (rider?.firstName || rider?.lastName)
                        ? `${(rider?.firstName?.[0] ?? "")}${(rider?.lastName?.[0] ?? "")}`
                            .replace(/\s+/g, "")
                            .toUpperCase()
                            .slice(0, 2)
                        : "R"
                      }
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56 border-none p-2 bg-white" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-foreground leading-none">
                      {(rider?.firstName || rider?.lastName)
                        ? `${rider?.firstName || ""} ${rider?.lastName || ""}`.trim()
                        : "Rider User"
                      }
                    </p>
                    <p className="text-xs leading-none text-secondary">
                      {rider?.email || "No email available"}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-primary/50" />

                <DropdownMenuItem asChild className="hover:bg-primary hover:text-white cursor-pointer">
                  <Link href="/rider-dashboard/profile">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-primary/50" />

                <DropdownMenuItem className="hover:bg-primary hover:text-white cursor-pointer" onClick={onSignOut}>
                  <LogOut className="h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* ✅ NEW MOBILE BOTTOM MENU */}
      <MobileBottomMenu />
    </>
  )
}
