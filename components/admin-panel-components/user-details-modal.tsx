"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  ShoppingBag,
  DollarSign,
  Star,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Store,
  Clock,
} from "lucide-react"

interface UserDetails {
  id: string
  name: string
  email: string
  phone: string
  address: string
  status: string
  joinDate: string
  lastOrder: string
  totalOrders: number
  totalSpent: number
  averageOrder: number
  favoriteRestaurant: string
  avatar: string
}

interface UserDetailsModalProps {
  user: UserDetails
  isOpen: boolean
  onClose: () => void
}

const recentOrders = [
  {
    id: "ORD-001",
    restaurant: "Udupi Kitchen",
    items: ["Jollof Rice", "Egusi Soup"],
    amount: 31.0,
    status: "delivered",
    date: "2024-01-14",
    time: "14:30",
  },
  {
    id: "ORD-002",
    restaurant: "African Delights",
    items: ["Pepper Soup", "Plantain"],
    amount: 24.5,
    status: "delivered",
    date: "2024-01-12",
    time: "19:15",
  },
  {
    id: "ORD-003",
    restaurant: "Spice Garden",
    items: ["Curry Rice"],
    amount: 18.75,
    status: "delivered",
    date: "2024-01-10",
    time: "13:20",
  },
  {
    id: "ORD-004",
    restaurant: "Curry House",
    items: ["Biryani", "Samosa"],
    amount: 42.2,
    status: "delivered",
    date: "2024-01-08",
    time: "20:45",
  },
  {
    id: "ORD-005",
    restaurant: "Jollof Palace",
    items: ["Jollof Rice", "Grilled Chicken"],
    amount: 28.9,
    status: "cancelled",
    date: "2024-01-06",
    time: "18:30",
  },
]

export function UserDetailsModal({ user, isOpen, onClose }: UserDetailsModalProps) {
  const [currentStatus, setCurrentStatus] = useState(user.status)
  const dialogRef = useRef<HTMLDivElement>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "inactive":
        return <XCircle className="w-5 h-5 text-amber-600" />
      case "banned":
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleStatusUpdate = (newStatus: string) => {
    setCurrentStatus(newStatus)
    console.log(`Updating user ${user.id} status to ${newStatus}`)
  }

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const rect = dialogRef.current.getBoundingClientRect()
      console.log('Dialog width:', rect.width, 'Viewport width:', window.innerWidth)
      console.log('Dialog computed style width:', getComputedStyle(dialogRef.current).width)
      console.log('Dialog maxWidth from style:', getComputedStyle(dialogRef.current).maxWidth)
      // Check if content is constraining
      const content = dialogRef.current.querySelector('[data-slot="dialog-content"]')
      if (content) {
        console.log('Content width:', content.clientWidth, 'Content scrollWidth:', content.scrollWidth)
      }
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent ref={dialogRef} className="max-h-[90vh] w-[90vw] max-w-[50vw]  bg-background overflow-y-auto">
        <DialogHeader className="bg-white p-6">
          <DialogTitle className="text-2xl  text-primary flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={user.avatar || "/placeholder.svg"} className="text-foreground font-ubuntu" alt={user.name} />
              <AvatarFallback className="bg-secondary  text-white ">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {user.name}
          </DialogTitle>
          <DialogDescription className="text-secondary">
            Complete user profile and activity information
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="my-6 mx-6">
          <TabsList className="gap-2 grid w-full grid-cols-4 text-white justify-center">
            <TabsTrigger
              value="profile"
              className="text-gray-400  bg-white rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="text-gray-400  bg-white rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary"
            >
              Order History
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="text-gray-400  bg-white rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="text-gray-400  bg-white rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card className=" p-4 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">

                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className=" space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-secondary text-white text-lg">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-[17px] font-bold text-foreground">{user.name}</h3>
                      <p className="text-sm text-primary">{user.id}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-secondary" />
                      <span className="text-sm text-primary">{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-secondary" />
                      <span className="text-sm text-primary">{user.phone}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-secondary mt-0.5" />
                      <span className="text-sm text-primary">{user.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-secondary" />
                      <span className="text-sm text-primary">Joined {user.joinDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Statistics */}
              <Card className=" p-4 bg-white">
                <CardHeader>
                  <CardTitle className="flex gap-2 items-center text-foreground font-ubuntu">
                    Account Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className=" p-4  rounded-lg">
                      <div className="text-2xl font-bold text-foreground">{user.totalOrders}</div>
                      <div className="text-sm text-secondary">Total Orders</div>
                    </div>
                    <div className=" p-4  rounded-lg">
                      <div className="text-2xl font-bold text-foreground">£{user.totalSpent.toFixed(2)}</div>
                      <div className="text-sm text-secondary">Total Spent</div>
                    </div>
                    <div className=" p-4  rounded-lg">
                      <div className="text-2xl font-bold text-foreground">£{user.averageOrder.toFixed(2)}</div>
                      <div className="text-sm text-secondary">Avg Order</div>
                    </div>
                    <div className=" p-4  rounded-lg">
                      <div className="text-2xl font-bold text-foreground">4.8</div>
                      <div className="text-sm text-secondary">Avg Rating</div>
                    </div>
                  </div>

                  <Separator className="bg-primary/50" />

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-primary text-sm">Last Order:</span>
                      <span className="font-medium text-[#717171] text-sm">{user.lastOrder}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary text-sm">Account Status:</span>
                      <Badge
                        className={
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : user.status === "inactive"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {user.status}
                      </Badge>
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
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4  rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center">
                          <Store className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">{order.id}</span>
                          <span className="text-sm text-primary/80">{order.restaurant}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-400">{order.items.join(", ")}</span>
                        <span className="font-medium text-sm text-gray-400">£{order.amount.toFixed(2)}</span>
                        <span className="text-sm text-gray-400">{order.date} at {order.time}</span>
                        {getOrderStatusBadge(order.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className=" bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6 ">
                    <div className=" w-10 h-10 flex justify-center rounded-full items-center">
                      <ShoppingBag className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-secondary mb-2">This Month Orders</p>
                      <p className="text-2xl font-bold text-foreground">12</p>
                    </div>

                  </div>
                </CardContent>
              </Card>
              <Card className=" bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6">
                    <div className=" w-10 h-10 flex justify-center rounded-full items-center">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-secondary mb-2">This Month Spent</p>
                      <p className="text-2xl font-bold text-foreground">£324</p>
                    </div>

                  </div>
                </CardContent>
              </Card>
              <Card className=" bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6">
                    <div className=" w-10 h-10 flex justify-center rounded-full items-center">
                      <Star className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-secondary mb-2">Customer Rating</p>
                        <p className="text-2xl font-bold text-foreground">4.8</p>
                      </div>
                    
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

       
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white p-5 ">
            <Card className="  p-4 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                
                  <span className="ml-2 text-foreground">Account Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Select value={currentStatus} onValueChange={handleStatusUpdate}>
                    <SelectTrigger className="w-48 border border-primary text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white ">
                      <SelectItem value="active" className="text-foreground">Active</SelectItem>
                      <SelectItem value="inactive" className="text-foreground">Inactive</SelectItem>
                      <SelectItem value="banned" className="text-foreground">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-secondary hover:bg-secondary/50 rounded-lg cursor-pointer text-white">Update Status</Button>
                </div>
              </CardContent>
            </Card>

            <Card className=" p-5 bg-white">
              <CardHeader>
                <CardTitle className="text-foreground">Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full bg-primary text-white rounded-lg hover:bg-primary hover:text-white "
                >
                  Send Password Reset Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full border border-primary rounded-lg text-foreground hover:bg-primary hover:text-white bg-transparent"
                >
                  Send Welcome Email
                </Button>
              
              </CardContent>
            </Card>
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
          <Button className="text-white hover:text-secondary border border-transparent hover:border-secondary rounded-lg px-7 py-3 hover:bg-transparent bg-secondary">Edit User</Button>

        </div>
      </DialogContent>
    </Dialog>
  )
}
