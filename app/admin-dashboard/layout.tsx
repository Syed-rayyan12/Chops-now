

"use client"
import { useState } from "react"
import { Sidebar } from "@/components/admin-panel-components/sidebar"
import { Header } from "@/components/admin-panel-components/header"

type NotificationStatus = "unread" | "read"

interface Notification {
  id: string
  type: "order" | "stock" | "payout"
  message: string
  time: string
  status: NotificationStatus
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

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
    {
      id: "4",
      type: "order",
      message: "New order received from Jane Smith",
      time: "5 minutes ago",
      status: "unread",
    },
  ])

  return (
    <div className="min-h-screen w-full flex">
      {/* Sidebar - fixed for desktop */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 min-h-screen  w-full ${
          collapsed ? "lg:ml-20" : "lg:ml-[17rem]"
        }`}
      >
        {/* Header - fixed at top */}
        <div className="sticky top-0 z-50">
          <Header
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            notifications={notifications}
          />
        </div>

        {/* Dynamic Page Content (scroll only here) */}
        <main className="flex-1 overflow-y-auto bg-background py-6 px-6">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar (Sheet or Overlay logic) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

