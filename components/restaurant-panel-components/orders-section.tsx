"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Check, X, MoreHorizontal } from "lucide-react"
import { restaurantOrders } from "@/lib/api/order.api"
import type { Order as ApiOrder } from "@/lib/api/order.api"

export function OrdersSection() {
  const [activeOrderTab, setActiveOrderTab] = useState("new")
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)

  // Prevent duplicate/rapid fetches
  const ordersLoadingRef = useRef(false)
  const ordersLastFetchRef = useRef(0)

  useEffect(() => {
    const restaurantSlug = localStorage.getItem("restaurantSlug")
    if (!restaurantSlug) return

    // Initial load with 2s delay
    loadOrders(restaurantSlug, true)

    // Cross-tab updates via BroadcastChannel only
    const channel = new BroadcastChannel("chop-restaurant-updates")
    const onMessage = (evt: MessageEvent) => {
      const msg = evt.data as any
      if (msg?.type === "orderUpdated" && msg?.slug === restaurantSlug) {
        loadOrders(restaurantSlug)
      }
    }
    channel.addEventListener("message", onMessage)

    return () => {
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
      console.error("Failed to load orders:", error)
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
      } catch {}
    } catch (error) {
      console.error("Failed to update order status:", error)
    }
  }

  const getOrdersByStatus = (status: "pending" | "in-progress" | "completed" | "cancelled") => {
    if (status === "pending") {
      return orders.filter((order) => order.status === "PENDING")
    } else if (status === "in-progress") {
      return orders.filter((order) => 
        order.status === "PREPARING" || 
        order.status === "READY_FOR_PICKUP" || 
        order.status === "PICKED_UP"
      )
    } else if (status === "completed") {
      return orders.filter((order) => order.status === "DELIVERED")
    } else if (status === "cancelled") {
      return orders.filter((order) => order.status === "CANCELLED")
    }
    return []
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
    <div className="bg-secondary rounded-lg p-6 text-white mb-6">
    <h2 className="text-2xl font-bold font-ubuntu mb-2">ORDERS</h2>
    <p className="text-white font-ubuntu text-sm">View, Manage, and Update Orders Easily</p>
  </div>
    <Tabs value={activeOrderTab} onValueChange={setActiveOrderTab} className="">
      <TabsList className="gap-2 hidden overflow-x-auto lg:flex lg:justify-between w-full text-white">
        <TabsTrigger
          value="new"
          className="text-gray-400 border bg-white border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary"
        >
          New Orders
        </TabsTrigger>
        <TabsTrigger
          value="progress"
          className="text-gray-400 border bg-white border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary"
        >
          In Progress
        </TabsTrigger>
        <TabsTrigger
          value="completed"
          className="text-gray-400 border bg-white border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary"
        >
          Completed
        </TabsTrigger>
        <TabsTrigger
          value="cancelled"
          className="text-gray-400 border bg-white border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary"
        >
          Cancelled
        </TabsTrigger>
      </TabsList>

      <TabsContent value="new">
        <Card className="border-primary/50 p-4 bg-white">
         
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border border-gray-400 rounded-lg p-4">
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Order ID</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Customer</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Items</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Amount</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Order Time</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Status</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                      <p className="mt-2 text-sm text-muted-foreground">Loading orders...</p>
                    </TableCell>
                  </TableRow>
                ) : getOrdersByStatus("pending").length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      No pending orders
                    </TableCell>
                  </TableRow>
                ) : (
                  getOrdersByStatus("pending").map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-foreground">{order.code}</TableCell>
                      <TableCell className="text-gray-400">
                        {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "N/A"}
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
                        <Badge className="bg-amber-100 text-amber-700">{order.status}</Badge>
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
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="progress">
        <Card className="border-primary/50 p-4 bg-white">

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border border-gray-400 rounded-lg p-4">
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Order ID</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Customer</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Items</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Amount</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Order Time</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Status</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                      <p className="mt-2 text-sm text-muted-foreground">Loading orders...</p>
                    </TableCell>
                  </TableRow>
                ) : getOrdersByStatus("in-progress").length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      No orders in progress
                    </TableCell>
                  </TableRow>
                ) : (
                  getOrdersByStatus("in-progress").map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-foreground">{order.code}</TableCell>
                      <TableCell className="text-gray-400">
                        {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "N/A"}
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
                        <Badge className="bg-blue-100 text-blue-800">{order.status}</Badge>
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
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="completed">
        <Card className="border-primary/50 p-4 bg-white">

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border border-gray-400 rounded-lg p-4">
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Order ID</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Customer</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Items</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Amount</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Order Time</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Status</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                      <p className="mt-2 text-sm text-muted-foreground">Loading orders...</p>
                    </TableCell>
                  </TableRow>
                ) : getOrdersByStatus("completed").length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      No completed orders
                    </TableCell>
                  </TableRow>
                ) : (
                  getOrdersByStatus("completed").map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-foreground">{order.code}</TableCell>
                      <TableCell className="text-gray-400">
                        {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "N/A"}
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
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="cancelled">
        <Card className="border-primary/50 p-4 bg-white">

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border border-gray-400 rounded-lg p-4">
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Order ID</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Customer</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Items</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Amount</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Order Time</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Status</TableHead>
                  <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                      <p className="mt-2 text-sm text-muted-foreground">Loading orders...</p>
                    </TableCell>
                  </TableRow>
                ) : getOrdersByStatus("cancelled").length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      No cancelled orders
                    </TableCell>
                  </TableRow>
                ) : (
                  getOrdersByStatus("cancelled").map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-foreground">{order.code}</TableCell>
                      <TableCell className="text-gray-400">
                        {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "N/A"}
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
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    </>
    )}
    </>
  )
}
