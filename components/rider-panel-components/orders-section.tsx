"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Phone, Navigation, Package, CheckCircle, Timer, AlertCircle } from "lucide-react"
import { riderOrders, type RiderOrder } from "@/lib/api/rider.api"
import { useToast } from "@/hooks/use-toast"
import { useDashboardSearch } from "@/lib/dashboard-search-context"
import { logger } from "@/lib/logger";

export function OrdersSection() {
  const { toast } = useToast()
  const { query: searchQuery } = useDashboardSearch()
  const [availableOrders, setAvailableOrders] = useState<RiderOrder[]>([])
  const [activeOrders, setActiveOrders] = useState<RiderOrder[]>([])
  const [completedOrders, setCompletedOrders] = useState<RiderOrder[]>([])
  const [loading, setLoading] = useState(true)
  // The backend gates available orders behind the rider being online and returns
  // 403 { offline: true } otherwise. We track that so the Available tab can show a
  // "go online" hint instead of an error, while active/completed still load.
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    loadOrders()
    
    // Refresh every 10 seconds
    const interval = setInterval(loadOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadOrders = async () => {
    // Load each list independently. Available orders require the rider to be
    // online, so an offline 403 there must NOT prevent active/completed (which a
    // rider needs even after going offline to finish accepted deliveries) from
    // loading. allSettled keeps one rejection from sinking the others.
    const [availableRes, activeRes, completedRes] = await Promise.allSettled([
      riderOrders.getAvailable(),
      riderOrders.getActive(),
      riderOrders.getCompleted(),
    ])

    if (availableRes.status === "fulfilled") {
      setAvailableOrders(availableRes.value.orders || [])
      setIsOffline(false)
    } else {
      const err = availableRes.reason
      if (err?.statusCode === 403 && err?.data?.offline) {
        // Expected when offline — not an error. Clear the list and flag offline.
        setAvailableOrders([])
        setIsOffline(true)
      } else {
        logger.error("Failed to load available orders:", err)
      }
    }

    if (activeRes.status === "fulfilled") {
      setActiveOrders(activeRes.value.orders || [])
    }
    if (completedRes.status === "fulfilled") {
      setCompletedOrders(completedRes.value.orders || [])
    }

    // Only surface a real failure if the must-have lists failed.
    if (activeRes.status === "rejected" || completedRes.status === "rejected") {
      logger.error(
        "Failed to load orders:",
        activeRes.status === "rejected" ? activeRes.reason : (completedRes as PromiseRejectedResult).reason
      )
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      })
    }

    setLoading(false)
  }

  const handleAcceptOrder = async (orderId: number) => {
    try {
      await riderOrders.acceptDelivery(orderId)
      toast({
        title: "Success",
        description: "Order accepted! Ready for pickup.",
      })
      loadOrders()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to accept order",
        variant: "destructive",
      })
    }
  }

  const handleMarkDelivered = async (orderId: number) => {
    try {
      await riderOrders.markDelivered(orderId)
      toast({
        title: "Success",
        description: "Order marked as delivered! 🎉",
      })
      loadOrders()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to mark order as delivered",
        variant: "destructive",
      })
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`
    return date.toLocaleDateString()
  }

  // Local filter driven by the dashboard header search ("Search orders, restaurants…").
  const matchesSearch = (order: RiderOrder) => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    return Boolean(
      order.code?.toLowerCase().includes(q) ||
      order.restaurant?.name?.toLowerCase().includes(q)
    )
  }
  const filteredAvailable = availableOrders.filter(matchesSearch)
  const filteredActive = activeOrders.filter(matchesSearch)
  const filteredCompleted = completedOrders.filter(matchesSearch)

  return (
    <div className="">
      <div className="mb-6 bg-secondary p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-white">ORDERS</h1>
        <p className="text-white text-sm">Manage your deliveries</p>
      </div>

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList className="gap-2 flex overflow-x-auto lg:justify-between w-full text-white">
          <TabsTrigger value="available" className="text-gray-400 border bg-white border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 cursor-pointer data-[state=active]:text-primary">
            Available ({filteredAvailable.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="text-gray-400 border bg-white border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 cursor-pointer data-[state=active]:text-primary">
            Active ({filteredActive.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-gray-400 border bg-white border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 cursor-pointer data-[state=active]:text-primary">
            Completed ({filteredCompleted.length})
          </TabsTrigger>
        </TabsList>

        {/* AVAILABLE ORDERS - Ready for Pickup */}
        <TabsContent value="available">
          <Card className="p-4 bg-white">
            <CardHeader>
              <h1 className="font-bold font-ubuntu text-foreground">Available Orders</h1>
              <p className="text-sm">Orders ready for pickup from restaurants</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                </div>
              ) : isOffline ? (
                <div className="text-center py-8 text-gray-400">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>You're offline</p>
                  <p className="text-xs mt-1">Go online from your dashboard to see available orders</p>
                </div>
              ) : filteredAvailable.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No available orders</p>
                  <p className="text-xs mt-1">Check back soon for new deliveries</p>
                </div>
              ) : (
                filteredAvailable.map((order) => (
                  <div key={order.id} className="border border-gray-400 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-foreground">{order.code}</h3>
                        <p className="text-sm text-gray-400">{order.restaurant?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-secondary">£{order.totalAmount?.toFixed(2)}</p>
                        <Badge className="bg-yellow-100 text-yellow-800 mt-1">Ready for Pickup</Badge>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-secondary flex-shrink-0" />
                        <span className="text-gray-600">
                          <strong>Pickup:</strong> {order.restaurant?.address || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-gray-600">
                          <strong>Delivery:</strong> {order.deliveryAddress || 'Address not available'}
                        </span>
                      </div>
                      {(order.riderPayout ?? 0) > 0 && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Package className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-gray-600">
                            <strong>Your earnings:</strong> <span className="text-green-600 font-semibold">£{order.riderPayout?.toFixed(2)}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-secondary cursor-pointer hover:bg-secondary/80 text-white"
                        onClick={() => handleAcceptOrder(order.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept Delivery
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-secondary text-secondary hover:bg-secondary hover:text-white"
                        onClick={() => handleCall(order.restaurant?.phone)}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACTIVE ORDERS - Currently Delivering */}
        <TabsContent value="active">
          <Card className="p-4 bg-white">
            <CardHeader>
              <h1 className="font-bold font-ubuntu text-foreground">Active Deliveries</h1>
              <p className="text-sm">Orders you're currently delivering</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                </div>
              ) : filteredActive.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No active deliveries</p>
                  <p className="text-xs mt-1">Accept orders from the Available tab</p>
                </div>
              ) : (
                filteredActive.map((order) => (
                  <div key={order.id} className="border border-primary rounded-lg p-4 bg-blue-50/30">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-foreground">{order.code}</h3>
                        <p className="text-sm text-gray-400">{order.restaurant?.name}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">In Transit</Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-secondary flex-shrink-0" />
                        <span className="text-gray-600">{order.deliveryAddress || 'Address not available'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-secondary flex-shrink-0" />
                        <span className="text-gray-600">{order.phone || 'Phone not available'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Package className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-600">
                          Total: <strong className="text-secondary">£{order.totalAmount?.toFixed(2)}</strong> • 
                          Earnings: <strong className="text-green-600">£{order.riderPayout?.toFixed(2)}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-secondary cursor-pointer hover:bg-secondary/80 text-white"
                        onClick={() => handleNavigate(order.deliveryAddress)}
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Navigate
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-secondary text-secondary hover:bg-secondary hover:text-white"
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
        </TabsContent>

        {/* COMPLETED ORDERS */}
        <TabsContent value="completed">
          <Card className="p-4 bg-white">
            <CardHeader>
              <h1 className="font-bold font-ubuntu text-foreground">Completed Deliveries</h1>
              <p className="text-sm">Your delivery history</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                </div>
              ) : filteredCompleted.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No completed deliveries yet</p>
                  <p className="text-xs mt-1">Complete your first delivery to see it here</p>
                </div>
              ) : (
                filteredCompleted.map((order) => (
                  <div key={order.id} className="border border-gray-400 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-foreground">{order.code}</h3>
                        <p className="text-sm text-gray-400">{order.restaurant?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">+£{order.riderPayout?.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">{order.deliveredAt ? formatDate(order.deliveredAt) : 'Recently'}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-primary" />
                        <span className="text-sm text-gray-600">
                          Total: <span className="text-secondary font-medium">£{order.totalAmount?.toFixed(2)}</span>
                        </span>
                      </div>
                      <Badge className="bg-green-100 text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Delivered
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
