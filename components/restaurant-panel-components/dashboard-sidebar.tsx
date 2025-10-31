"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ChefHat,
  Home,
  ShoppingCart,
  CreditCard,
  Star,
  HelpCircle,
  Settings as SettingsIcon,
} from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"

const navigation = [
  { href: "/restaurant-dashboard", name: "Overview", icon: Home },
  { href: "/restaurant-dashboard/orders", name: "Orders", icon: ShoppingCart },
  { href: "/restaurant-dashboard/menu-management", name: "Menu Management", icon: ChefHat },
  { href: "/restaurant-dashboard/earning-payment", name: "Earnings & Payments", icon: CreditCard },
  { href: "/restaurant-dashboard/review-rating", name: "Reviews & Ratings", icon: Star },
  { href: "/restaurant-dashboard/support", name: "Support", icon: HelpCircle },
  { href: "/restaurant-dashboard/settings", name: "Settings", icon: SettingsIcon },
]

export function DashboardSidebar({ collapsed, setCollapsed, locked = false }: { collapsed: boolean, setCollapsed: (v: boolean) => void, locked?: boolean }) {
  const pathname = usePathname()

  const NavItems = () => (
    <nav className="flex-1 p-3 overflow-y-auto bg-white rounded-2xl">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        const isSettings = item.href === "/restaurant-dashboard/settings"
        const isDisabled = locked && !isSettings
        return (
          <Link
            key={item.href}
            href={isDisabled ? "/restaurant-dashboard/settings" : item.href}
            onClick={isDisabled ? (e) => { e.preventDefault() } : undefined}
            title={isDisabled ? "Complete setup to access" : undefined}
            className={cn(
              "flex items-center px-2 py-3 text-sm font-medium rounded-lg transition-colors",
              isActive
                ? "bg-secondary text-white"
                : "text-foreground ",
              isDisabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="ml-3">{item.name}</span>}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "fixed hidden lg:flex lg:flex-col top-4 left-4 h-[calc(100vh-2rem)] z-50 bg-white border-secondary/50 rounded-2xl transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-center px-4 border-b border-secondary/70">
            <div className="">

              {!collapsed && (
                <div className="flex flex-col justify-center">
                  <Link href="/restaurant-dashboard">
                      <img
                        src="/chopNow.png"
                        alt="ChopNow Logo"
                        className="mx-auto w-36 h-full px-2 object-cover"
                      />
                    </Link>
                </div>
              )}

              {collapsed && (
                <>
                  <div className="flex flex-col ">
                    <ChefHat className="text-secondary" />
                  </div>
                </>
              )}
            </div>
          </div>
          <NavItems />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetContent side="left" className="p-0 w-64">
          <SheetHeader className="border-b border-secondary/70 p-4">
            <SheetTitle className="flex items-center space-x-2">
              <ChefHat className="h-6 w-6 text-secondary" />
              <span className="text-lg font-bold text-secondary">ChopNow Restaurant</span>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full">
            <NavItems />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
