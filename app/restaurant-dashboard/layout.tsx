// "use client"
// import { DashboardHeader } from "@/components/restaurant-panel-components/dashboard-header"
// import { DashboardSidebar } from "@/components/restaurant-panel-components/dashboard-sidebar"

// import { useState } from "react"

// type NotificationStatus = "unread" | "read"

// interface Notification {
//   id: string
//   type: "order" | "stock" | "payout"
//   message: string
//   time: string
//   status: NotificationStatus
// }

// export default function RestaurantDashboardLayout({ children }: { children: React.ReactNode }) {
//   const [collapsed, setCollapsed] = useState(false)


//   const [notifications] = useState<Notification[]>([
//     {
//       id: "1",
//       type: "order",
//       message: "New order received from John Doe",
//       time: "2 minutes ago",
//       status: "unread",
//     },
//     {
//       id: "2",
//       type: "stock",
//       message: "Low stock alert: Chicken Wings",
//       time: "15 minutes ago",
//       status: "unread",
//     },
//     {
//       id: "3",
//       type: "payout",
//       message: "Weekly payout processed",
//       time: "1 hour ago",
//       status: "read",
//     },
//   ])

//   const handleSignOut = () => {
//     console.log("Sign out clicked")
//     // Add sign out logic here
//   }

//   return (
//     <div className="min-h-screen  w-full flex">
//       {/* Sidebar */}
//       <DashboardSidebar
//         collapsed={collapsed}
//         setCollapsed={setCollapsed}
//       />

//       {/* Main Content */}
//       <div className="flex-1 sticky flex flex-col">
//         <div className="sticky top-0 z-50">

        
//         {/* Header */}
//         <DashboardHeader
//            collapsed={collapsed}
//            notifications={notifications}
//            setCollapsed={setCollapsed}
//           onSignOut={handleSignOut}
//         />
//         </div>

//         {/* Dynamic Page Content */}
//         <main className="flex-1 overflow-y-auto bg-background py-6 px-6">{children}</main>
//       </div>
//     </div>
//   )
// }

"use client"
import { DashboardHeader } from "@/components/restaurant-panel-components/dashboard-header"
import { DashboardSidebar } from "@/components/restaurant-panel-components/dashboard-sidebar"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getRestaurantBySlug } from "@/lib/api/restaurant.api";
import { isRestaurantSetupComplete } from "@/lib/utils"

type NotificationStatus = "unread" | "read"

interface Notification {
  id: string
  type: "order" | "stock" | "payout"
  message: string
  time: string
  status: NotificationStatus
}

export default function RestaurantDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [locked, setLocked] = useState<boolean>(true)

  // Re-check setup status on navigation or when triggered by custom event
  useEffect(() => {
    async function checkAuthAndSetup() {
      const token = localStorage.getItem("restaurantToken")
      const slug = localStorage.getItem("restaurantSlug")

      if (!token) {
        router.push("/restaurant-signIn")
        setIsChecking(false)
        return
      }

      setIsAuthenticated(true)

      // If we have a slug, check restaurant setup status
      if (slug) {
        try {
          // Fetch latest restaurant to determine completeness
          const latest = await getRestaurantBySlug(slug)
          console.log("🔍 Layout checking setup status:", latest)
          if (latest) {
            // Store restaurant data for future use
            localStorage.setItem("restaurantData", JSON.stringify(latest))
            const complete = isRestaurantSetupComplete(latest)
            console.log("✅ Setup complete?", complete)
            setLocked(!complete)

            // If not complete, force settings page
            if (!complete && pathname !== "/restaurant-dashboard/settings") {
              console.log("⚠️ Setup incomplete, redirecting to settings")
              router.replace("/restaurant-dashboard/settings")
            } else if (complete) {
              console.log("🎉 Setup complete! Dashboard unlocked")
            }
          } else {
            // If API failed to return restaurant, keep it locked
            setLocked(true)
            if (pathname !== "/restaurant-dashboard/settings") {
              router.replace("/restaurant-dashboard/settings")
            }
          }
        } catch (e) {
          console.error("❌ Error checking setup:", e)
          // On any fetch error, keep authenticated but locked
          setLocked(true)
          if (pathname !== "/restaurant-dashboard/settings") {
            router.replace("/restaurant-dashboard/settings")
          }
        } finally {
          setIsChecking(false)
        }
      } else {
        // No slug yet, allow access but keep locked until slug is available
        setIsAuthenticated(true)
        setLocked(true)
        setIsChecking(false)
      }
    }

    checkAuthAndSetup()

    // Listen for custom event to re-check after settings save
    const handleSetupUpdate = () => {
      console.log("🔄 Setup update event received, re-checking...")
      checkAuthAndSetup()
    }
    window.addEventListener("restaurant-setup-updated", handleSetupUpdate)

    return () => {
      window.removeEventListener("restaurant-setup-updated", handleSetupUpdate)
    }
  }, [router, pathname])

  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      type: "order",
      message: "New order received from John Doe",
      time: "2 minutes ago",
      status: "unread",
    },
    {
      id: "2",
      type: "stock",
      message: "Low stock alert: Chicken Wings",
      time: "15 minutes ago",
      status: "unread",
    },
    {
      id: "3",
      type: "payout",
      message: "Weekly payout processed",
      time: "1 hour ago",
      status: "read",
    },
  ])

  const handleSignOut = () => {
    localStorage.removeItem("restaurantToken")
    localStorage.removeItem("restaurantEmail")
    localStorage.removeItem("restaurantSlug")
    localStorage.removeItem("restaurantData")
    router.push("/restaurant-signIn")
  }

  // Show loading while checking auth
  if (isChecking) {
    return null
  }

  // Only render if authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* Sidebar - fixed and full height */}
      <div className="hidden lg:block fixed top-0 left-0 h-screen">
        <DashboardSidebar collapsed={collapsed} setCollapsed={setCollapsed} locked={locked} />
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 min-h-screen w-full ${
          collapsed ? "lg:ml-20" : "lg:ml-[17rem]"
        }`}
      >
        {/* Navbar - fixed at top */}
        <div className="sticky top-0 z-50">
          <DashboardHeader
            collapsed={collapsed}
            notifications={notifications}
            setCollapsed={setCollapsed}
            onSignOut={handleSignOut}
          />
        </div>

        {/* Scrollable main content only */}
        <main className="flex-1 overflow-y-auto bg-background py-6 px-6">
          {children}
        </main>
      </div>
    </div>
  )
}
