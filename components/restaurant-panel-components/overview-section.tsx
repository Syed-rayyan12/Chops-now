"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, Package, CheckCircle, CircleX, PoundSterlingIcon } from "lucide-react"
import { restaurantOrders } from "@/lib/api/order.api"
import type { Order, OrderStats, Earnings } from "@/lib/api/order.api"

export function OverviewSection() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<OrderStats>({
    pendingOrders: 0,
    inProgressOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  })
  const [earnings, setEarnings] = useState<Earnings>({
    today: 0,
    weekly: 0,
  })
  const [loading, setLoading] = useState(true)
  const [restaurantName, setRestaurantName] = useState("Restaurant")

  useEffect(() => {
    const restaurantSlug = localStorage.getItem("restaurantSlug")
    const restaurantData = localStorage.getItem("restaurantData")
    
    if (restaurantData) {
      try {
        const parsed = JSON.parse(restaurantData)
        setRestaurantName(parsed.name || "Restaurant")
      } catch (e) {
        console.error("Error parsing restaurant data:", e)
      }
    }

    let pollId: any
    if (restaurantSlug) {
      // initial load
      loadDashboardData(restaurantSlug)
      // lightweight polling to reflect new orders/stats without manual refresh
      const POLL_MS = 8000
      pollId = setInterval(() => {
        if (document.hidden) return
        loadDashboardData(restaurantSlug)
      }, POLL_MS)
    }

    return () => {
      if (pollId) clearInterval(pollId)
    }
  }, [])

  const loadDashboardData = async (slug: string) => {
    try {
      setLoading(true)
      const [statsData, earningsData, ordersData] = await Promise.all([
        restaurantOrders.getStats(slug),
        restaurantOrders.getEarnings(slug),
        restaurantOrders.getAll(slug),
      ])
      setStats(statsData.stats)
      setEarnings(earningsData.earnings)
      setOrders(ordersData.orders)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const orderStatsConfig = [
    {
      title: "Pending Orders",
      count: stats.pendingOrders,
      icon: Clock,
      iconWrapper: "border border-primary flex justify-center items-center w-8 h-8 rounded-full",
      iconColor: "text-primary",
    },
    {
      title: "In Progress",
      count: stats.inProgressOrders,
      icon: Package,
      iconWrapper: "border border-primary  flex justify-center items-center w-8 h-8 rounded-full",
      iconColor: "text-primary",
    },
    {
      title: "Completed",
      count: stats.completedOrders,
      icon: CheckCircle,
      iconWrapper: "border border-primary flex justify-center items-center w-8 h-8 rounded-full",
      iconColor: "text-primary",
    },
    {
      title: "Cancelled",
      count: stats.cancelledOrders,
      icon: CircleX,
      iconWrapper: "border border-primary flex justify-center items-center w-8 h-8 rounded-full",
      iconColor: "text-primary",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-secondary rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold font-ubuntu mb-2">
          WELCOME BACK, <span className="text-2xl font-bold font-ubuntu mb-2 uppercase">{restaurantName}!</span>
        </h2>
        <p className="text-white font-ubuntu text-sm">Here's what's happening with your restaurant today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {orderStatsConfig.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="border-primary/50 p-4 bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-secondary">
                  {stat.title}
                </CardTitle>
                <div className={stat.iconWrapper}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {loading ? "..." : stat.count}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 border-primary/50 bg-white">
          <CardContent className="flex justify-between items-center space-y-4">
            <div className="flex flex-col gap-2 pt-6 justify-center">
              <span className="text-lg font-bold text-foreground">Today's Earnings</span>
              <span className="text-sm font-medium text-secondary">
                {loading ? "Loading..." : `£${earnings.today.toFixed(2)}`}
              </span>
            </div>   
            <div className="bg-secondary w-12 h-12 flex justify-center items-center rounded-full">
              <PoundSterlingIcon className="h-6 w-6 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/50 p-4 bg-white">
          <CardContent className="flex justify-between items-center space-y-4">
            <div className="flex flex-col gap-2 pt-6 justify-center">
              <span className="text-lg font-bold text-foreground">Weekly Earnings</span>
              <span className="text-sm font-medium text-secondary">
                {loading ? "Loading..." : `£${earnings.weekly.toFixed(2)}`}
              </span>
            </div>   
            <div className="bg-secondary w-12 h-12 flex justify-center items-center rounded-full">
              <PoundSterlingIcon className="h-6 w-6 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/50 p-4 bg-white">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Orders</CardTitle>
          <CardDescription className="text-primary">Latest orders from customers</CardDescription>
        </CardHeader>
        <CardContent className="mt-4">
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No orders yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border border-gray-400 rounded-lg p-4 h-12">
                  <TableHead className="px-4 py-2 text-foreground font-bold font-ubuntu text-[16px]">Order ID</TableHead>
                  <TableHead className="px-4 py-2 text-foreground font-bold font-ubuntu text-[16px]">Customer</TableHead>
                  <TableHead className="px-4 py-2 text-foreground font-bold font-ubuntu text-[16px]">Items</TableHead>
                  <TableHead className="px-4 py-2 text-foreground font-bold font-ubuntu text-[16px]">Status</TableHead>
                  <TableHead className="px-4 py-2 text-foreground font-bold font-ubuntu text-[16px] text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.slice(0, 5).map((order) => (
                  <TableRow key={order.id} className="border-b border-gray-400">
                    <TableCell className="px-4 py-2 text-center">
                      {order.code}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {order.items.length} item(s)
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-2 text-right">
                      £{Number(order.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
