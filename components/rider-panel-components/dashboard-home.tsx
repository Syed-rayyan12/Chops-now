"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star, TrendingUp, Package, DollarSign, Phone, Navigation, CheckCircle, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"
import { riderStats, riderOrders, riderActivity, type RiderOrder, type Activity } from "@/lib/api/rider.api"
import { useToast } from "@/hooks/use-toast"

export function DashboardHome() {
  const { toast } = useToast()
  const [stats, setStats] = useState({ activeOrders: 0, completedOrders: 0, totalEarnings: 0 })
  const [activeOrders, setActiveOrders] = useState<RiderOrder[]>([])
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
    
    // Refresh every 10 seconds
    const interval = setInterval(loadDashboardData, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      const [statsData, activeOrdersData, activityData] = await Promise.all([
        riderStats.get(),
        riderOrders.getActive(),
        riderActivity.getRecent()
      ])
      
      setStats(statsData)
      setActiveOrders(activeOrdersData.orders)
      setRecentActivity(activityData.activities)
    } catch (error: any) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNavigate = (address?: string) => {
    if (!address) {
      toast({
        title: "Error",
        description: "Delivery address not available",
        variant: "destructive",
      })
      return
    }
    
    // Open Google Maps
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    window.open(mapsUrl, '_blank')
  }

  const handleCall = (phone?: string) => {
    if (!phone) {
      toast({
        title: "Error",
        description: "Phone number not available",
        variant: "destructive",
      })
      return
    }
    
    window.location.href = `tel:${phone}`
  }

  const handleMarkDelivered = async (orderId: number) => {
    try {
      await riderOrders.markDelivered(orderId)
      toast({
        title: "Success",
        description: "Order marked as delivered",
      })
      loadDashboardData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to mark order as delivered",
        variant: "destructive",
      })
    }
  }

  const [isOnline, setIsOnline] = useState(true);

  // Map stats to display format
  const mappedStats = [
    {
      title: "Active Orders",
      value: stats.activeOrders,
      change: "Orders in progress",
      icon: Package,
      bgColor: "border border-primary",
      iconColor: "text-amber-600",
    },
    {
      title: "Orders Completed",
      value: stats.completedOrders,
      change: "Total completed",
      icon: CheckCircle,
      bgColor: "border border-primary",
      iconColor: "text-green-600",
    },
    {
      title: "Total Earnings",
      value: `£${stats.totalEarnings.toFixed(2)}`,
      change: "Total earned",
      icon: DollarSign,
      bgColor: "border border-primary",
      iconColor: "text-orange-600",
    },
    {
      title: "Delivery Status",
      value: isOnline ? "Online" : "Offline",
      change: isOnline ? "Available for orders" : "Not accepting orders",
      icon: Clock,
      bgColor: "border border-primary",
      iconColor: isOnline ? "text-green-600" : "text-gray-400",
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      READY_FOR_PICKUP: { label: "Ready", className: "bg-blue-100 text-blue-600" },
      PICKED_UP: { label: "In Transit", className: "bg-amber-100 text-amber-600" },
    }
    
    const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-600" }
    return <Badge className={`${config.className} font-medium`}>{config.label}</Badge>
  }

  // Map stats for UI only if stats exist


  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Section */}
      <div className="flex bg-secondary justify-between max-sm:gap-3  p-6 max-sm:flex-col rounded-lg">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-white">GOOD MORNING, JOHN!</h2>
          <p className="text-white text-sm">Ready to start earning today?</p>
        </div>
        <div className="flex items-center space-x-4">
          <Switch
            checked={isOnline}
            onCheckedChange={setIsOnline}
            className={isOnline ? "data-[state=checked]:bg-green-500 " : "data-[state=unchecked]:bg-white/10"}
          />
          <Label className={isOnline ? "text-white font-medium" : "text-green-700 font-medium"}>
            {isOnline ? "Online" : "Offline"}
          </Label>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mappedStats.map((stat: any) => (
          <Card key={stat.title} className="border-primary p-4 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-secondary">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 text-primary ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Orders & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Orders */}
        <Card className="bg-white p-4">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-secondary">
              <div className="flex-col flex gap-2">
                <div className="flex gap-2 items-center">
                  <span className="text-foreground">Active Orders</span>
                  <Badge className="bg-primary text-white rounded-full">{activeOrders.length}</Badge>
                </div>
                <span className="text-sm font-medium">Track all ongoing customer orders in real time</span>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 py-3">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
              </div>
            ) : activeOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No active orders</p>
              </div>
            ) : (
              activeOrders.map((order) => (
                <div key={order.id} className="p-4 border text-primary border-gray-400 bg-white rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-foreground">#{order.code}</p>
                      <p className="text-sm text-gray-400">
                        {order.restaurant?.name || 'Unknown Restaurant'} • £{order.totalAmount?.toFixed(2)}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-foreground mb-3">
                    <MapPin className="h-4 w-4 text-secondary" />
                    <span className="text-gray-400">{order.deliveryAddress || 'Address not available'}</span>
                  </div>

                  <div className="flex justify-start space-x-2">
                    <Button 
                      size="sm" 
                      className="bg-secondary cursor-pointer hover:bg-secondary/80 text-white"
                      onClick={() => handleNavigate(order.deliveryAddress)}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Navigate
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-white cursor-pointer border-secondary text-secondary hover:bg-secondary hover:text-white"
                      onClick={() => handleCall(order.phone)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-green-600 cursor-pointer hover:bg-green-700 text-white"
                      onClick={() => handleMarkDelivered(order.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Delivered
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white  p-4">
          <CardHeader>
            <CardTitle className="flex items-center space-x-4 text-secondary">
              <div className="flex flex-col gap-2">
                <span className="text-foreground">Recent Activity</span>
                <span className="text-primary font-medium text-sm">Latest Orders</span>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 ">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center py-3 px-3 mt-4 bg-white rounded-lg border border-gray-400">
                  <div className="flex items-center max-sm:flex-col max-sm:items-start space-x-3 flex-1">
                    <div className="p-2 bg-green-100 rounded-full text-primary">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-[16px]">
                        {activity.orderCode}
                      </p>
                      <p className="text-xs text-gray-400">{activity.restaurantName}</p>
                    </div>
                  </div>
                  <div className="text-center flex-1">
                    <p className="font-medium text-secondary text-[17px]">£{activity.amount.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-end flex-1">
                    <Badge variant="secondary" className="bg-green-100 text-green-600 font-medium flex items-center gap-1 mb-1">
                      <CheckCircle className="h-3 w-3" />
                      Delivered
                    </Badge>
                    <p className="text-xs text-gray-400">{new Date(activity.deliveredAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
