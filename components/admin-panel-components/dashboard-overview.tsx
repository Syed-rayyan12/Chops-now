"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { ShoppingBag, Store, Users, DollarSign, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { getAdminStats, getAdminRecentOrders } from "@/lib/api/admin.api"
import { Loader } from "@/components/ui/loader"

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Delivered
        </Badge>
      )
    case "preparing":
      return (
        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
          <Clock className="w-3 h-3 mr-1" />
          Preparing
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    case "ready_for_pickup":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <Clock className="w-3 h-3 mr-1" />
          Ready
        </Badge>
      )
    case "picked_up":
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
          <Clock className="w-3 h-3 mr-1" />
          Picked Up
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function DashboardOverview() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeRestaurants: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setOrdersLoading(true)

      // Fetch stats and recent orders in parallel
      const [statsData, ordersData] = await Promise.all([
        getAdminStats(),
        getAdminRecentOrders(5),
      ])

      setStats(statsData)
      setRecentOrders(ordersData)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
      setOrdersLoading(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  const statsCards = [
    {
      title: "Total Orders",
      value: loading ? "..." : stats.totalOrders.toLocaleString(),
      change: "+12.5%",
      icon: ShoppingBag,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Active Restaurants",
      value: loading ? "..." : stats.activeRestaurants.toLocaleString(),
      change: "+3.2%",
      icon: Store,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "Total Users",
      value: loading ? "..." : stats.totalUsers.toLocaleString(),
      change: "+8.1%",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Revenue",
      value: loading ? "..." : `£${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "+15.3%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Section */}
      <div className="bg-secondary rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold font-ubuntu mb-2">WELCOME BACK ADMIN!</h2>
        <p className="text-white font-ubuntu text-sm">Here's what's happening with ChopNow today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title} className=" bg-white shadow-none py-2 px-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-secondary">{stat.title}</CardTitle>
              <div className="p-2 rounded-full border border-primary">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className=" bg-white shadow-none p-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground font-ubuntu  pb-1">Recent Orders</CardTitle>
              <CardDescription className="text-secondary/80">Latest orders from your platform</CardDescription>
            </div>
            <Button className="bg-secondary rounded-xl text-white hover:bg-secondary cursor-pointer">
              View All Orders
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader size="lg" />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No orders yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-primary/20 hover:bg-gray-50">
                      <td className="p-4 text-center text-foreground font-bold font-ubuntu">{order.orderId}</td>
                      <td className="p-4 text-sm text-primary font-ubuntu">{order.customer}</td>
                      <td className="p-4 text-sm font-medium font-ubuntu text-gray-400">{order.restaurant}</td>
                      <td className="p-4 text-sm font-ubuntu text-gray-400">{formatTimeAgo(order.time)}</td>
                      <td className="p-4 text-right font-semibold text-secondary font-ubuntu">£{order.amount.toFixed(2)}</td>
                      <td className="p-4 text-right">{getStatusBadge(order.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
