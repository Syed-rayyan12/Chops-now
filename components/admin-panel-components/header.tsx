
"use client"

import {
  Bell,
  Search,
  User,
  MenuIcon,
  Settings,
  LogOut,
  BarChart3,
  LayoutDashboard,
  ShoppingBag,
  Store,
  Truck,
  Users,
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { Separator } from "../ui/separator"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"

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
}

const MenuNav = [
  { href: "/admin-dashboard", name: "Dashboard", icon: LayoutDashboard },
  { href: "/admin-dashboard/orders", name: "Orders", icon: ShoppingBag },
  { href: "/admin-dashboard/restaurants", name: "Restaurants", icon: Store },
  { href: "/admin-dashboard/users", name: "Users", icon: Users },
  { href: "/admin-dashboard/analytics", name: "Analytics", icon: BarChart3 },
  { href: "/admin-dashboard/delivery-tracking", name: "Delivery Tracking", icon: Truck },
]

export function Header({ collapsed, setCollapsed, notifications }: DashboardHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [adminUser, setAdminUser] = useState<any>(null)
  const unreadCount = notifications.filter((n) => n.status === "unread").length

  useEffect(() => {
    const user = localStorage.getItem('adminUser')
    if (user) {
      setAdminUser(JSON.parse(user))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    router.push('/admin-signin')
  }

  return (
    <header className="bg-background px-6 py-[23px] h-16">
      <div className="flex items-center justify-between gap-6">
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
                    className="text-orange-600 hover:text-orange-800 cursor-pointer hover:bg-orange-100"
                  >
                    <MenuIcon className="h-10 w-10" />
                  </Button>
                </SheetTrigger>

                {/* Sidebar content */}
                <SheetContent
                  side="left"
                  className="w-72 max-w-[85vw] bg-white p-4 border-r z-50"
                >
                   <Link href="/admin-dashboard">
                      <img
                        src="/chopNow.png"
                        alt="ChopNow Logo"
                        className="mx-auto w-36 h-full px-2 object-cover"
                      />
                    </Link>

                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-amber-500 h-4 w-4" />
                    <Input
                      placeholder="Search orders, restaurants, users..."
                      className="pl-10 w-full bg-white border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    {MenuNav.map((item, idx) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href

                      return (
                        <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start",
                              isActive && "bg-orange-100 text-primary"
                            )}
                          >
                            <Icon className="mr-2 h-4 w-4" />
                            {item.name}
                          </Button>
                          {idx < MenuNav.length - 1}
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
                className="text-primary hover:text-orange-800 cursor-pointer hover:bg-orange-100"
              >
                <MenuIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-primary font-ubuntu">Dashboard</h1>
        </div>

        {/* Right side with search, notifications & profile */}
        <div className="flex items-center space-x-4 w-full">
          {/* Search bar on desktop only */}
          <div className="hidden lg:block relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-300 h-4 w-4" />
            <Input
              placeholder="Search orders, restaurants, users..."
              className="pl-10 w-full bg-white border text-gray-300 border-gray-200 h-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="relative text-foreground/60 bg-white rounded-full w-10 h-10  cursor-pointer hover:bg-white">
                <Bell className="h-5 w-5" />
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
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/admin-profile.png" alt="Admin" />
                  <AvatarFallback className="bg-secondary text-white cursor-pointer">
                    {adminUser ? `${adminUser.firstName[0]}${adminUser.lastName[0]}` : 'AD'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 border p-2 border-none bg-white" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-foreground leading-none">
                    {adminUser ? `${adminUser.firstName} ${adminUser.lastName}` : 'Admin User'}
                  </p>
                  <p className="text-xs leading-none text-secondary">
                    {adminUser?.email || 'admin@chopnow.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-primary/50 " />
              <DropdownMenuItem
                onClick={handleLogout}
                className="hover:bg-primary hover:text-white text-foreground cursor-pointer"
              >
                <LogOut className="h-4 w-4 hover:text-white" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

