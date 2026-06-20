"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Check, X, MoreHorizontal, MapPin, Navigation } from "lucide-react"
import { restaurantOrders } from "@/lib/api/order.api"
import type { Order as ApiOrder } from "@/lib/api/order.api"
import { API_CONFIG } from "@/lib/api/config"
import { useDashboardSearch } from "@/lib/dashboard-search-context"
import { logger } from "@/lib/logger";

interface Rider {
  id: number
  firstName: string
  lastName: string
  // distanceKm is computed by the backend (/nearby-riders), already within 5km.
  distanceKm: number
  vehicle?: string | null
}

export function OrdersSection() {
  const { query: searchQuery } = useDashboardSearch()
  const [activeOrderTab, setActiveOrderTab] = useState("new")
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [riders, setRiders] = useState<Rider[]>([])
  const [restaurantLocation, setRestaurantLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [showRidersCard, setShowRidersCard] = useState(false)

  // Prevent duplicate/rapid fetches
  const ordersLoadingRef = useRef(false)
  const ordersLastFetchRef = useRef(0)

  useEffect(() => {
    const restaurantSlug = localStorage.getItem("restaurantSlug")
    if (!restaurantSlug) return

    // Initial load with 2s delay
    loadOrders(restaurantSlug, true)
    loadRestaurantLocation(restaurantSlug)
    loadAvailableRiders()

    // Poll so newly placed customer orders (and nearby riders) appear without a
    // manual reload. BroadcastChannel below only covers same-browser updates, not
    // orders placed by customers elsewhere. loadOrders throttles to >=2s internally.
    const interval = setInterval(() => {
      loadOrders(restaurantSlug)
      loadAvailableRiders()
    }, 15000)

    // Cross-tab updates via BroadcastChannel
    const channel = new BroadcastChannel("chop-restaurant-updates")
    const onMessage = (evt: MessageEvent) => {
      const msg = evt.data as any
      if (msg?.type === "orderUpdated" && msg?.slug === restaurantSlug) {
        loadOrders(restaurantSlug)
      }
    }
    channel.addEventListener("message", onMessage)

    return () => {
      clearInterval(interval)
      channel.removeEventListener("message", onMessage)
      channel.close()
    }
  }, [])

  const loadOrders = async (slug: string, isInitial = false) => {
    const now = Date.now()
    if (ordersLoadingRef.current) return
    if (now - ordersLastFetchRef.current < 2000) return

    try {
      ordersLoadingRef.current = true
      setLoading(true)

      // Show orange loader for 2s on initial load
      if (isInitial) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }

      const data = await restaurantOrders.getAll(slug)
      setOrders(data.orders)
    } catch (error) {
      logger.error("Failed to load orders:", error)
    } finally {
      setLoading(false)
      setInitialLoad(false)
      ordersLoadingRef.current = false
      ordersLastFetchRef.current = Date.now()
    }
  }

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    const restaurantSlug = localStorage.getItem("restaurantSlug")
    if (!restaurantSlug) return

    try {
      if (newStatus === "PREPARING") {
        await restaurantOrders.acceptOrder(restaurantSlug, orderId)
      } else if (newStatus === "READY_FOR_PICKUP") {
        await restaurantOrders.markReady(restaurantSlug, orderId)
      } else if (newStatus === "CANCELLED") {
        await restaurantOrders.cancelOrder(restaurantSlug, orderId)
      }

      await loadOrders(restaurantSlug)

      // Notify other tabs/pages
      try {
        const channel = new BroadcastChannel("chop-restaurant-updates")
        channel.postMessage({ type: "orderUpdated", slug: restaurantSlug })
        channel.close()
      } catch { }
    } catch (error) {
      logger.error("Failed to update order status:", error)
    }
  }

  const loadRestaurantLocation = async (slug: string) => {
    try {
      const token = localStorage.getItem("restaurantToken")
      const response = await fetch(`${API_CONFIG.BASE_URL}/restaurant/${slug}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        logger.debug("📍 Restaurant data received:", data)
        if (data.restaurant?.latitude && data.restaurant?.longitude) {
          setRestaurantLocation({ 
            latitude: data.restaurant.latitude, 
            longitude: data.restaurant.longitude 
          })
          logger.debug("✅ Restaurant location set:", { 
            latitude: data.restaurant.latitude, 
            longitude: data.restaurant.longitude 
          })
        } else {
          logger.warn("⚠️ Restaurant location not available in response")
        }
      }
    } catch (error) {
      logger.error("Failed to load restaurant location:", error)
    }
  }

  const loadAvailableRiders = async () => {
    try {
      const token = localStorage.getItem("restaurantToken")
      const slug = localStorage.getItem("restaurantSlug")
      if (!token || !slug) return
      // Use the scoped nearby-riders endpoint: it enforces restaurant ownership and
      // returns only approved, online riders within 5km, pre-sorted by distanceKm.
      const response = await fetch(`${API_CONFIG.BASE_URL}/restaurant/${slug}/nearby-riders`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setRiders(data.riders || [])
      } else {
        // e.g. 400 when the restaurant has no location set.
        setRiders([])
      }
    } catch (error) {
      logger.error("Failed to load nearby riders:", error)
    }
  }

  // Local filter driven by the dashboard header search ("Search orders, menu items…").
  // Matches order code, customer name, or item titles.
  const matchesSearch = (order: ApiOrder) => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    const customer = `${(order as any).customer?.firstName ?? ""} ${(order as any).customer?.lastName ?? ""} ${(order as any).customerName ?? ""}`
    const items = (order.items ?? []).map((it: any) => it.title ?? it.name ?? "").join(" ")
    return (
      order.code?.toLowerCase().includes(q) ||
      customer.toLowerCase().includes(q) ||
      items.toLowerCase().includes(q)
    )
  }

  const getOrdersByStatus = (status: "pending" | "in-progress" | "completed" | "cancelled") => {
    const byStatus = orders.filter((order) => {
      if (status === "pending") return order.status === "PENDING"
      if (status === "in-progress")
        return order.status === "PREPARING" || order.status === "READY_FOR_PICKUP" || order.status === "PICKED_UP"
      if (status === "completed") return order.status === "DELIVERED"
      if (status === "cancelled") return order.status === "CANCELLED"
      return false
    })
    return byStatus.filter(matchesSearch)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short'
    })
  }

  const formatOrderCode = (code: string) => {
    // Split code by hyphens and display in two lines
    // Example: ORD-1234567890-123 becomes "ORD-1234567890" and "123"
    const parts = code.split('-')
    if (parts.length >= 3) {
      return (
        <div className="flex flex-col">
          <span>{parts[0]}-{parts[1]}</span>
          <span>{parts[2]}</span>
        </div>
      )
    }
    return <span>{code}</span>
  }

  return (
    <>
      {initialLoad ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-secondary"></div>
            <p className="mt-4 text-lg font-medium text-secondary">Loading orders...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="bg-secondary rounded-lg p-6 text-white flex-1">
              <h2 className="text-2xl font-bold font-ubuntu mb-2">ORDERS</h2>
              <p className="text-white font-ubuntu text-sm">View, Manage, and Update Orders Easily</p>
            </div>

          </div>
          <div className="flex justify-end mb-3">
          <Button
            onClick={() => setShowRidersCard(!showRidersCard)}
            className="ml-0 sm:ml-4 bg-primary text-white rounded-lg hover:bg-primary/90 text-xs sm:text-sm px-3 sm:px-4 py-2"
            >
            <Navigation className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            {showRidersCard ? "Hide" : "View"} Available Riders
          </Button>
            </div>
          {/* Available Riders Card */}
          {showRidersCard && (
            <Card className="mb-6 border-primary/50 bg-white p-4">
              <CardHeader className="">
                <CardTitle className="text-primary font-ubuntu flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Available Riders Near You
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {!restaurantLocation ? (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="mx-auto h-12 w-12 mb-2 text-gray-400" />
                    <p>Restaurant location not available</p>
                    <p className="text-sm">Please update your restaurant location in settings</p>
                  </div>
                ) : riders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No riders available at the moment</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Riders are already approved, online, within 5km, and sorted
                        by distance by the /nearby-riders endpoint. */}
                    {riders.map(rider => (
                      <div key={rider.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-foreground">{rider.firstName} {rider.lastName}</h4>
                            <Badge className="bg-green-100 text-green-700">Online</Badge>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-2xl font-bold text-primary">{rider.distanceKm.toFixed(2)}</span>
                            <span className="text-xs text-gray-500">km away</span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-2">
                          <Navigation className="h-4 w-4 mr-1 text-secondary" />
                          <span>Distance from your restaurant</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Tabs value={activeOrderTab} onValueChange={setActiveOrderTab} className="">
            <TabsList className="gap-2 flex overflow-x-auto lg:justify-between w-full text-white">
              <TabsTrigger
                value="new"
                className="text-gray-400 border bg-white border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
              >
                New Orders
              </TabsTrigger>
              <TabsTrigger
                value="progress"
                className="text-gray-400 border bg-white border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
              >
                In Progress
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="text-gray-400 border bg-white border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
              >
                Completed
              </TabsTrigger>
              <TabsTrigger
                value="cancelled"
                className="text-gray-400 border bg-white border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
              >
                Cancelled
              </TabsTrigger>
            </TabsList>

            <TabsContent value="new">
              <Card className="border-primary/50 p-4 bg-white">

                <CardContent>
                  <div className="overflow-x-auto">
                    <Table className="min-w-[900px]">
                      <TableHeader>
                        <TableRow className="border border-gray-400 rounded-lg p-4">
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Order ID</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Customer</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Address</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Distance</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Items</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Amount</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Order Time</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Status</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                            <p className="mt-2 text-sm text-muted-foreground">Loading orders...</p>
                          </TableCell>
                        </TableRow>
                      ) : getOrdersByStatus("pending").length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                            No pending orders
                          </TableCell>
                        </TableRow>
                      ) : (
                        getOrdersByStatus("pending").map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium text-foreground text-xs sm:text-sm px-2 sm:px-4">{formatOrderCode(order.code)}</TableCell>
                            <TableCell className="text-gray-400 text-xs sm:text-sm px-2 sm:px-4">
                              {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "N/A"}
                            </TableCell>
                            <TableCell className="text-gray-400 max-w-[150px] sm:max-w-[200px] truncate text-xs sm:text-sm px-2 sm:px-4">
                              {order.deliveryAddress || order.address?.address || "N/A"}
                            </TableCell>
                            <TableCell className="text-gray-400 text-xs sm:text-sm px-2 sm:px-4">
                              {order.distanceKm ? `${Number(order.distanceKm).toFixed(1)} km` : "N/A"}
                            </TableCell>
                            <TableCell className="text-gray-400 text-xs sm:text-sm px-2 sm:px-4">
                              {order.items.slice(0, 2).map((item, idx) => (
                                <div key={idx}>{item.title} x{item.qty}</div>
                              ))}
                              {order.items.length > 2 && <div className="text-[10px] sm:text-xs">+{order.items.length - 2} more</div>}
                            </TableCell>
                            <TableCell className="text-secondary text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">£{Number(order.amount).toFixed(2)}</TableCell>
                            <TableCell className="text-gray-400 text-xs sm:text-sm px-2 sm:px-4">{formatDate(order.createdAt)}</TableCell>
                            <TableCell className="px-2 sm:px-4">
                              <Badge className="bg-amber-100 text-amber-700 text-[10px] sm:text-xs">{order.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white border border-gray-300">
                                  <DropdownMenuItem className="hover:bg-gray-100 p-2" onClick={() => handleStatusUpdate(order.id, "PREPARING")}>
                                    <Check className="mr-2 h-4 w-4 text-green-600" />
                                    <span className="text-foreground">Accept Order</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="hover:bg-gray-100 p-2" onClick={() => handleStatusUpdate(order.id, "CANCELLED")}>
                                    <X className="mr-2 h-4 w-4 text-red-600" />
                                    <span className="text-foreground">Reject Order</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress">
              <Card className="border-primary/50 p-4 bg-white">

                <CardContent>
                  <div className="overflow-x-auto">
                    <Table className="min-w-[900px]">
                      <TableHeader>
                        <TableRow className="border border-gray-400 rounded-lg p-4">
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Order ID</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Customer</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Address</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Distance</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Items</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Amount</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Order Time</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Status</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                            <p className="mt-2 text-sm text-muted-foreground">Loading orders...</p>
                          </TableCell>
                        </TableRow>
                      ) : getOrdersByStatus("in-progress").length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                            No orders in progress
                          </TableCell>
                        </TableRow>
                      ) : (
                        getOrdersByStatus("in-progress").map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium text-foreground text-xs sm:text-sm px-2 sm:px-4">{formatOrderCode(order.code)}</TableCell>
                            <TableCell className="text-gray-400 text-xs sm:text-sm px-2 sm:px-4">
                              {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "N/A"}
                            </TableCell>
                            <TableCell className="text-gray-400 max-w-[150px] sm:max-w-[200px] truncate text-xs sm:text-sm px-2 sm:px-4">
                              {order.deliveryAddress || order.address?.address || "N/A"}
                            </TableCell>
                            <TableCell className="text-gray-400 text-xs sm:text-sm px-2 sm:px-4">
                              {order.distanceKm ? `${Number(order.distanceKm).toFixed(1)} km` : "N/A"}
                            </TableCell>
                            <TableCell className="text-gray-400 text-xs sm:text-sm px-2 sm:px-4">
                              {order.items.slice(0, 2).map((item, idx) => (
                                <div key={idx}>{item.title} x{item.qty}</div>
                              ))}
                              {order.items.length > 2 && <div className="text-[10px] sm:text-xs">+{order.items.length - 2} more</div>}
                            </TableCell>
                            <TableCell className="text-secondary text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">£{Number(order.amount).toFixed(2)}</TableCell>
                            <TableCell className="text-gray-400 text-xs sm:text-sm px-2 sm:px-4">{formatDate(order.createdAt)}</TableCell>
                            <TableCell className="px-2 sm:px-4">
                              <Badge className="bg-blue-100 text-blue-800 text-[10px] sm:text-xs">{order.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white border border-gray-300">
                                  {order.status === "PREPARING" && (
                                    <DropdownMenuItem className="hover:bg-gray-100 p-2" onClick={() => handleStatusUpdate(order.id, "READY_FOR_PICKUP")}>
                                      <Check className="mr-2 h-4 w-4 text-green-600" />
                                      <span className="text-foreground">Mark Ready for Pickup</span>
                                    </DropdownMenuItem>
                                  )}
                                  {order.status === "READY_FOR_PICKUP" && (
                                    <DropdownMenuItem disabled>
                                      <span className="text-gray-400">Waiting for Rider</span>
                                    </DropdownMenuItem>
                                  )}
                                  {order.status === "PICKED_UP" && (
                                    <DropdownMenuItem disabled>
                                      <span className="text-gray-400">Out for Delivery</span>
                                    </DropdownMenuItem>
                                  )}
                                  {order.status !== "PICKED_UP" && (
                                    <DropdownMenuItem className="hover:bg-gray-100 p-2" onClick={() => handleStatusUpdate(order.id, "CANCELLED")}>
                                      <X className="mr-2 h-4 w-4 text-red-600" />
                                      <span className="text-foreground">Cancel Order</span>
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed">
              <Card className="border-primary/50 p-4 bg-white">

                <CardContent>
                  <div className="overflow-x-auto">
                    <Table className="min-w-full">
                      <TableHeader>
                        <TableRow className="border border-gray-400 rounded-lg p-4">
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Order ID</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Customer</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Address</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Distance</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Items</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Amount</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Order Time</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Status</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                            <p className="mt-2 text-sm text-muted-foreground">Loading orders...</p>
                          </TableCell>
                        </TableRow>
                      ) : getOrdersByStatus("completed").length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                            No completed orders
                          </TableCell>
                        </TableRow>
                      ) : (
                        getOrdersByStatus("completed").map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium text-foreground text-xs sm:text-sm px-2 sm:px-4">{formatOrderCode(order.code)}</TableCell>
                            <TableCell className="text-gray-400">
                              {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "N/A"}
                            </TableCell>
                            <TableCell className="text-gray-400 max-w-[200px] truncate">
                              {order.deliveryAddress || order.address?.address || "N/A"}
                            </TableCell>
                            <TableCell className="text-gray-400">
                              {order.distanceKm ? `${Number(order.distanceKm).toFixed(1)} km` : "N/A"}
                            </TableCell>
                            <TableCell className="text-gray-400">
                              {order.items.slice(0, 2).map((item, idx) => (
                                <div key={idx}>{item.title} x{item.qty}</div>
                              ))}
                              {order.items.length > 2 && <div className="text-xs">+{order.items.length - 2} more</div>}
                            </TableCell>
                            <TableCell className="text-secondary">£{Number(order.amount).toFixed(2)}</TableCell>
                            <TableCell className="text-gray-400">{formatDate(order.createdAt)}</TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800">{order.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-gray-400 text-sm">Completed</span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cancelled">
              <Card className="border-primary/50 p-4 bg-white">

                <CardContent>
                  <div className="overflow-x-auto">
                    <Table className="min-w-full">
                      <TableHeader>
                        <TableRow className="border border-gray-400 rounded-lg p-4">
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Order ID</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Customer</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Address</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Distance</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Items</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Amount</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Order Time</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Status</TableHead>
                          <TableHead className="text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap px-2 sm:px-4">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                            <p className="mt-2 text-sm text-muted-foreground">Loading orders...</p>
                          </TableCell>
                        </TableRow>
                      ) : getOrdersByStatus("cancelled").length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                            No cancelled orders
                          </TableCell>
                        </TableRow>
                      ) : (
                        getOrdersByStatus("cancelled").map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium text-foreground text-xs sm:text-sm px-2 sm:px-4">{formatOrderCode(order.code)}</TableCell>
                            <TableCell className="text-gray-400">
                              {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "N/A"}
                            </TableCell>
                            <TableCell className="text-gray-400 max-w-[200px] truncate">
                              {order.deliveryAddress || order.address?.address || "N/A"}
                            </TableCell>
                            <TableCell className="text-gray-400">
                              {order.distanceKm ? `${Number(order.distanceKm).toFixed(1)} km` : "N/A"}
                            </TableCell>
                            <TableCell className="text-gray-400">
                              {order.items.slice(0, 2).map((item, idx) => (
                                <div key={idx}>{item.title} x{item.qty}</div>
                              ))}
                              {order.items.length > 2 && <div className="text-xs">+{order.items.length - 2} more</div>}
                            </TableCell>
                            <TableCell className="text-secondary">£{Number(order.amount).toFixed(2)}</TableCell>
                            <TableCell className="text-gray-400">{formatDate(order.createdAt)}</TableCell>
                            <TableCell>
                              <Badge className="bg-red-100 text-red-800">{order.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-gray-400 text-sm">Cancelled</span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </>
  )
}
