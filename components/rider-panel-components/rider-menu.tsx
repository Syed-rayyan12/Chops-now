"use client"

import Link from "next/link"
import { Home, ShoppingCart, CreditCard } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MobileBottomMenu() {
  const pathname = usePathname()

  const items = [
    { href: "/rider-dashboard", label: "Overview", icon: Home },
    { href: "/rider-dashboard/orders", label: "Orders", icon: ShoppingCart },
    { href: "/rider-dashboard/earnings", label: "Earnings", icon: CreditCard },
  ]

  return (
    <div
      className="
        fixed bottom-0 left-0 right-0
        bg-white border-t shadow-lg
        flex justify-around items-center
        py-2
        sm:hidden
        z-[999]
      "
    >
      {items.map((item) => {
        const Icon = item.icon
        const active = pathname === item.href
        return (
          <Link key={item.href} href={item.href} className="flex flex-col items-center">
            <Icon
              className={cn(
                "h-5 w-5",
                active ? "text-primary" : "text-gray-400"
              )}
            />
            <span
              className={cn(
                "text-[11px] font-medium",
                active ? "text-primary" : "text-gray-400"
              )}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
