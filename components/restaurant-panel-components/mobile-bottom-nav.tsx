"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingCart, ChefHat, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/restaurant-dashboard",
    icon: Home,
    label: "Overview"
  },
  {
    href: "/restaurant-dashboard/orders",
    icon: ShoppingCart,
    label: "Orders"
  },
  {
    href: "/restaurant-dashboard/menu-management",
    icon: ChefHat,
    label: "Menu"
  },
  {
    href: "/restaurant-dashboard/settings",
    icon: Settings,
    label: "Settings"
  }
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden">
      <nav className="flex items-center justify-around h-16 max-w-screen px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon className={cn(
                "h-6 w-6",
                isActive && "stroke-[2.5]"
              )} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
