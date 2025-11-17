"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getAdminRecentOrders } from "@/lib/api/admin.api"

interface RecentOrder {
  id: number;
  code: string;
  customer?: {
    firstName: string;
    lastName: string;
  };
  items: Array<{
    title: string;
    qty: number;
  }>;
  amount: number;
  createdAt: string;
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
      console.error("Failed to load recent orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return "U"
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  const getOrderItems = (items: Array<{ title: string; qty: number }>) => {
    if (items.length === 0) return "No items"
    if (items.length === 1) return `${items[0].title} x${items[0].qty}`
    if (items.length === 2) return `${items[0].title}, ${items[1].title}`
    return `${items[0].title} +${items.length - 1} more`
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
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-200 last:border-0">
              <td className="py-2 pr-2 w-10">
                <Avatar className="h-8 w-8 text-white">
                  <AvatarFallback className="bg-secondary text-[10px]">
                    {getInitials(order.customer?.firstName, order.customer?.lastName)}
                  </AvatarFallback>
                </Avatar>
              </td>
              <td className="py-2 pr-2">
                <p className="text-xs font-medium leading-none text-primary truncate max-w-[80px]">
                  {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "Guest"}
                </p>
              </td>
              <td className="py-2 pr-2 text-[11px] text-gray-400 max-w-[120px]">
                <span className="truncate block">{getOrderItems(order.items)}</span>
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
