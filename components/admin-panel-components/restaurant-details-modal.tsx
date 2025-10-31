"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
          <TabsList className="gap-2 grid w-full grid-cols-4 text-white justify-center">
            <TabsTrigger
              value="details"
              className="text-gray-400 border bg-white border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary"
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="text-gray-400 border bg-white border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary"
            >
              Performance
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

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className=" bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 justify-between">
                    <div className="flex flex-col gap-4">
                    <div className=" w-10 h-10 flex justify-center rounded-full items-center">  
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    </div>
                      <p className="text-sm text-secondary">Monthly Orders</p>
                      <p className="text-2xl font-bold text-foreground">247</p>
                    </div>
                  
                  </div>
                </CardContent>
              </Card>
              <Card className=" bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-4">
                    <div className=" w-10 h-10 flex justify-center rounded-full items-center">
                    <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                      <p className="text-sm text-secondary">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-foreground">£3,240</p>
                    </div>
                   
                  </div>
                </CardContent>
              </Card>
              <Card className=" bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-4">
                    <div className=" w-10 h-10 flex justify-center rounded-full items-center">
                    <Percent className="w-5 h-5 text-primary" />
                     </div>
                      <p className="text-sm text-secondary">Avg Order Value</p>
                      <p className="text-2xl font-bold text-foreground">£28.50</p>
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
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border-gray-400 border rounded-lg">
                        <div className="bg-secondary w-12 h-12 flex justify-center items-center rounded-full text-white">
                         <img src="/vec.png" className="w-6 h-6" alt="" />
                        </div>
                        <p className="font-bold text-foreground">#ORD-00{i}</p>
                        <p className="text-sm text-secondary">Customer Name • 2 items</p>
                   
                     
                        <p className="font-medium text-sm text-gray-400">£{(25 + i * 3).toFixed(2)}</p>
                        <Badge className="bg-green-100 text-green-800">Delivered</Badge>
                    
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className=" bg-white">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  {getStatusIcon(currentStatus)}
                  <span className="ml-2">Restaurant Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Select value={currentStatus} onValueChange={handleStatusUpdate}>
                    <SelectTrigger className="w-48 ">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white ">
                      <SelectItem value="active" className="text-foreground">Active</SelectItem>
                      <SelectItem value="pending" className="text-foreground">Pending</SelectItem>
                      <SelectItem value="inactive" className="text-foreground">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-secondary hover:bg-secondary/80 cursor-pointer text-white">Update Status</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 m-6 border-t border-orange-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-secondary  text-secondary hover:bg-secondary bg-transparent px-6 py-3 rounded-lg"
          >
            Close
          </Button>
          <Button className="text-white hover:text-secondary border border-transparent hover:border-secondary rounded-lg px-7 py-3 hover:bg-transparent bg-secondary">Edit Restaurant</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
