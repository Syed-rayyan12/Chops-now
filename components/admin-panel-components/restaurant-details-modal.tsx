"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getRestaurantOrders } from "@/lib/api/admin.api"
import { Loader } from "@/components/ui/loader"
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Star,
  Clock,
  DollarSign,
  ShoppingBag,
  Percent,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

interface Restaurant {
  id: string
  name: string
  cuisine: string
  address: string
  phone: string
  email: string
  status: string
  rating: number
  totalOrders: number
  revenue: number
  joinDate: string
  deliveryTime: string
  commission: number
  image: string
  description: string
  openingHours: string
  minimumOrder: number
}

interface RestaurantDetailsModalProps {
  restaurant: Restaurant
  isOpen: boolean
  onClose: () => void
}

export function RestaurantDetailsModal({ restaurant, isOpen, onClose }: RestaurantDetailsModalProps) {
  const [currentStatus, setCurrentStatus] = useState(restaurant.status)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)

  // Fetch restaurant orders when modal opens
  useEffect(() => {
    if (isOpen && restaurant?.id) {
      fetchRestaurantOrders()
    } else if (isOpen && !restaurant?.id) {
      console.error("Cannot fetch orders: Restaurant ID is missing")
      console.log("Restaurant object:", restaurant)
    }
  }, [isOpen, restaurant?.id])

  const fetchRestaurantOrders = async () => {
    if (!restaurant?.id) {
      console.error("Cannot fetch orders: Restaurant ID is undefined")
      console.log("Restaurant:", restaurant)
      setRecentOrders([])
      setLoadingOrders(false)
      return
    }

    try {
      setLoadingOrders(true)
      console.log("Restaurant object:", restaurant)
      console.log("Fetching orders for restaurant ID:", restaurant.id)
      console.log("Restaurant ID type:", typeof restaurant.id)
      
      const orders = await getRestaurantOrders(restaurant.id)
      console.log("Fetched orders:", orders)
      setRecentOrders(orders)
    } catch (error: any) {
      console.error("Failed to fetch restaurant orders:", error)
      console.error("Error message:", error?.message || "Unknown error")
      console.error("Error status:", error?.statusCode)
      console.error("Error data:", error?.data)
      setRecentOrders([])
    } finally {
      setLoadingOrders(false)
    }
  }

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "preparing":
        return <Badge className="bg-blue-100 text-blue-800">Preparing</Badge>
      case "ready_for_pickup":
        return <Badge className="bg-purple-100 text-purple-800">Ready</Badge>
      case "picked_up":
        return <Badge className="bg-amber-100 text-amber-800">Picked Up</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "pending":
        return <AlertCircle className="w-5 h-5 text-amber-600" />
      case "inactive":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const handleStatusUpdate = (newStatus: string) => {
    setCurrentStatus(newStatus)
    console.log(`Updating restaurant ${restaurant.id} status to ${newStatus}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-[90vw] max-w-[50vw] bg-background overflow-y-auto">
        <DialogHeader className="bg-white p-6">
          <DialogTitle className="text-2xl text-primary flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={restaurant.image || "/placeholder.svg"} className="text-foreground font-ubuntu" alt={restaurant.name} />
              <AvatarFallback className="bg-secondary text-white">
                {restaurant.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-foreground">{restaurant.name}</span>
            
          </DialogTitle>
          <DialogDescription className="text-secondary">
            Complete restaurant information and management
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="my-6 mx-6">
          <TabsList className="gap-2 grid w-full grid-cols-2 text-white justify-center">
            <TabsTrigger
              value="details"
              className="text-gray-400 border bg-white border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary"
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="text-gray-400 border bg-white border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary"
            >
              Recent Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card className=" p-4 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} />
                      <AvatarFallback className="bg-secondary text-white text-lg">
                        {restaurant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-[17px] font-bold text-foreground">{restaurant.name}</h3>
                      <Badge variant="outline" className="border-none text-sm text-secondary">
                        {restaurant.cuisine}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm">{restaurant.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-secondary" />
                      <span className="text-sm text-primary">{restaurant.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-secondary" />
                      <span className="text-sm text-primary">{restaurant.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-secondary" />
                      <span className="text-sm text-primary">{restaurant.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-secondary" />
                      <span className="text-sm text-primary">{restaurant.openingHours}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Metrics */}
              <Card className=" p-4 bg-white">
                <CardHeader>
                  <CardTitle className="flex gap-2 items-center text-foreground font-ubuntu">
                    Business Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className=" p-4  rounded-lg  bg-white">
                      <div className="text-2xl font-bold text-foreground">{restaurant.rating}</div>
                      <div className="text-sm text-secondary">Rating</div>
                    </div>
                    <div className=" p-4  rounded-lg  bg-white">
                      <div className="text-2xl font-bold text-foreground">{restaurant.totalOrders}</div>
                      <div className="text-sm text-secondary">Total Orders</div>
                    </div>
                    <div className=" p-4  rounded-lg  bg-white">
                      <div className="text-2xl font-bold text-foreground">£{restaurant.revenue.toLocaleString()}</div>
                      <div className="text-sm text-secondary">Revenue</div>
                    </div>
                    <div className=" p-4  rounded-lg  bg-white">
                      <div className="text-2xl font-bold text-foreground">{restaurant.commission}%</div>
                      <div className="text-sm text-secondary">Commission</div>
                    </div>
                  </div>

                  <Separator className="bg-primary/50" />

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className=" text-sm text-primary">Delivery Time:</span>
                      <span className="text-sm text-gray-400">{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className=" text-sm text-primary">Minimum Order:</span>
                      <span className="text-sm text-gray-400">£{restaurant.minimumOrder}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className=" text-sm text-primary">Join Date:</span>
                      <span className="text-sm text-gray-400">{restaurant.joinDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card className=" p-4 bg-white">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader size="md" />
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No orders found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border-gray-400 border rounded-lg">
                        <div className="bg-secondary w-12 h-12 flex justify-center items-center rounded-full text-white">
                          <img src="/vec.png" className="w-6 h-6" alt="" />
                        </div>
                        <p className="font-bold text-foreground">{order.id}</p>
                        <p className="text-sm text-secondary">{order.customerName} • {order.itemCount} items</p>
                        <p className="font-medium text-sm text-gray-400">£{order.amount.toFixed(2)}</p>
                        {getOrderStatusBadge(order.status)}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
