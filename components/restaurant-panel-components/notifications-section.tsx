"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Package, DollarSign } from "lucide-react"

type NotificationStatus = "unread" | "read"

interface Notification {
  id: string
  type: "order" | "stock" | "payout"
  message: string
  time: string
  status: NotificationStatus
}

interface NotificationsSectionProps {
  notifications: Notification[]
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
}

export function NotificationsSection({ notifications, setNotifications }: NotificationsSectionProps) {
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, status: "read" as NotificationStatus } : notif)),
    )
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`border-orange-200 bg-white ${notification.status === "unread" ? "bg-white" : ""}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-full ${
                    notification.type === "order"
                      ? "bg-orange-100 text-orange-600"
                      : notification.type === "stock"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                  }`}
                >
                  {notification.type === "order" && <ShoppingCart className="h-4 w-4" />}
                  {notification.type === "stock" && <Package className="h-4 w-4" />}
                  {notification.type === "payout" && <DollarSign className="h-4 w-4" />}
                </div>
                <div>
                  <p className="font-medium">{notification.message}</p>
                  <p className="text-sm text-gray-500">{notification.time}</p>
                </div>
              </div>
              {notification.status === "unread" && (
                <Button size="sm" variant="outline" onClick={() => markNotificationAsRead(notification.id)}>
                  Mark as Read
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
