"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getAdminRecentOrders } from "@/lib/api/admin.api"
import { logger } from "@/lib/logger";

interface RecentOrder {
  id: string;
  orderId?: string;
  customer: string;
  customerEmail?: string;
  restaurant?: string;
  amount: number;
  status?: string;
  items: number;
  time?: string;
  date?: string;
}

export function RecentSales() {
  const [orders, setOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecentOrders()
  }, [])

  const loadRecentOrders = async () => {
    try {
      setLoading(true)
      const data = await getAdminRecentOrders(10)
      setOrders(data)
    } catch (error) {
      logger.error("Failed to load recent orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (fullName: string) => {
    if (!fullName) return "U"
    const parts = fullName.trim().split(" ")
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    return parts[0]?.[0]?.toUpperCase() || "U"
  }

  const getItemsLabel = (items: number) => {
    if (!items || items === 0) return "No items"
    return `${items} item${items !== 1 ? "s" : ""}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
        No recent orders
      </div>
    )
  }

  return (
    <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <table className="w-full">
        <tbody>
          {orders.map((order, idx) => (
            <tr key={order.id ?? idx} className="border-b border-gray-200 last:border-0">
              <td className="py-2 pr-2 w-10">
                <Avatar className="h-8 w-8 text-white">
                  <AvatarFallback className="bg-secondary text-[10px]">
                    {getInitials(order.customer || "")}
                  </AvatarFallback>
                </Avatar>
              </td>
              <td className="py-2 pr-2">
                <p className="text-xs font-medium leading-none text-primary truncate max-w-[80px]">
                  {order.customer || "Guest"}
                </p>
              </td>
              <td className="py-2 pr-2 text-[11px] text-gray-400 max-w-[120px]">
                <span className="truncate block">{getItemsLabel(order.items)}</span>
              </td>
              <td className="py-2 text-right font-medium text-primary text-xs whitespace-nowrap">
                £{Number(order.amount).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
