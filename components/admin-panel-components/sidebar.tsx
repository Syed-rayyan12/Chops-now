"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, ShoppingBag, Store, Users, ChefHat, BarChart3, Truck, Settings, LogOut,
  MenuIcon,
  CreditCard,
  HelpCircle,
  Home,
  ShoppingCart,
  Star,
  HomeIcon,
  Bike,
  Briefcase,
  FileText
} from "lucide-react"

import {
  Sheet, SheetContent, SheetHeader, SheetTitle
} from "@/components/ui/sheet"

const navigation = [
  { href: "/admin-dashboard", name: "Overview", icon: HomeIcon },
  { href: "/admin-dashboard/orders", name: "Orders", icon: ShoppingCart },
  { href: "/admin-dashboard/users", name: "User Management", icon: ChefHat },
  { href: "/admin-dashboard/restaurants", name: "Restaurant Management", icon: CreditCard },
  { href: "/admin-dashboard/riders", name: "Rider Management", icon: Bike },
  { href: "/admin-dashboard/jobs", name: "Job Management", icon: Briefcase },
  { href: "/admin-dashboard/applications", name: "Applications", icon: FileText },
  { href: "/admin-dashboard/admin-accounts", name: "Admin Accounts", icon: Users },
  { href: "/admin-dashboard/analytics", name: "Analytics", icon: Star },
]


export function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (v: boolean) => void }) {
  const pathname = usePathname()

  const NavItems = () => (
    <nav className="flex-1 p-3 overflow-y-auto bg-white rounded-2xl">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-2 py-3 text-sm font-medium rounded-lg transition-colors",
              isActive
                ? "bg-secondary text-white"
                : "text-foreground "
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="ml-3">{item.name}</span>}
          </Link>
        )
      })}
    </nav>
  )

  // const BottomActions = () => (
  //   <div className="border-t border-orange-200 p-4 space-y-1">
  //     <Button
  //       variant="ghost"
  //       className="w-full justify-start text-amber-700 hover:bg-orange-50 hover:text-orange-800"
  //     >
  //       <LogOut className="h-5 w-5 flex-shrink-0" />
  //       {!collapsed && <span className="ml-3">Log Out</span>}
  //     </Button>
  //   </div>
  // )

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
            {/* <ChefHat className="text-secondary rounded-lg"/> */}
            <div className="">

              {!collapsed && (
                <div className="flex flex-col justify-center">
                  <Link href="/admin-dashboard">
                  <img
                    src="/chopNow.png"
                    alt="ChopNow Logo"
                    className="mx-auto w-36 h-full px-2 object-cover"
                  />
                  </Link>
                  {/* <span className="text-secondary text-lg font-bold">ChopNow</span>
                <span className="text-xs text-secondary/70">Admin Panel</span> */}
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

            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="text-orange-600 hover:text-orange-800 hover:bg-orange-100"
            >
              <MenuIcon className="h-4 w-4" />
            </Button> */}
          </div>
          <NavItems />
          {/* <BottomActions /> */}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetContent side="left" className="p-0 w-64">
          <SheetHeader className="border-b border-secondary/70 p-4">
            <SheetTitle className="flex items-center space-x-2">
              <ChefHat className="h-6 w-6 text-secondary" />
              <span className="text-lg font-bold text-secondary">ChopNow Admin</span>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full">
            <NavItems />
            {/* <BottomActions /> */}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
