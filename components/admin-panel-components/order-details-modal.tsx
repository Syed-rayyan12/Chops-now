"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, MapPin, Phone, Store, Clock, CreditCard, CheckCircle, ChefHat, Truck, XCircle } from "lucide-react"

interface Order {
  id: string
  customer: string
  customerEmail: string
  restaurant: string
  items: string[]
  amount: number
  status: string
  paymentStatus: string
  orderTime: string
  deliveryTime: string | null
  address: string
  phone: string
}

interface OrderDetailsModalProps {
  order: Order
  isOpen: boolean
  onClose: () => void
}

export function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  const [currentStatus, setCurrentStatus] = useState(order.status)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "preparing":
        return <ChefHat className="w-5 h-5 text-orange-600" />
      case "pending":
        return <Clock className="w-5 h-5 text-amber-600" />
      case "out-for-delivery":
        return <Truck className="w-5 h-5 text-blue-600" />
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const handleStatusUpdate = (newStatus: string) => {
    setCurrentStatus(newStatus)
    // Here you would typically make an API call to update the order status
    console.log(`Updating order ${order.id} status to ${newStatus}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[80%] max-lg:w-[80%] max-sm:w-[100%] mx-auto max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader className="bg-white p-4">
          <DialogTitle className="text-2xl text-foreground font-ubuntu">Order Details - {order.id}</DialogTitle>
          <DialogDescription className="text-secondary text-sm font-ubuntu">Complete information about this order</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 max-xl:grid-cols-1 gap-6  m-5">
          {/* Customer Information */}
          <Card className=" w-full bg-white rounded-md p-4">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground font-bold font-ubuntu">
              
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 border border-gray-400 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-ubuntu text-[17px] text-[#717171]">{order.customer}</p>
                  <p className="text-sm text-primary">{order.customerEmail}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 border border-gray-400 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5  text-secondary mt-0.5" />
                </div>
                <div>
                  <p className="font-ubuntu text-[17px] text-[#717171]">Delivery Address</p>
                  <p className="text-sm text-primary">{order.address}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 border border-gray-400 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5  text-secondary" />
                </div>
                <div>
                  <p className="font-ubuntu text-[17px] text-[#717171]">Phone Number</p>
                  <p className="text-sm text-primary">{order.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Information */}
          <Card className=" w-full bg-white rounded-md p-4">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground font-bold font-ubuntu">
               
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 ">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 border border-gray-400 rounded-full flex items-center justify-center">
                  <Store className="w-5 h-5  text-secondary" />
                </div>
                <div>
                  <p className="font-ubuntu text-[17px] text-[#717171]">{order.restaurant}</p>
                  <p className="text-sm text-primary">Restaurant</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 border border-gray-400 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-ubuntu text-[17px] text-[#717171]">Order Time</p>
                  <p className="text-sm text-primary">{order.orderTime}</p>
                </div>
              </div>

              {order.deliveryTime && (
                <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 border border-gray-400 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-secondary" />
                   </div>
                  <div>
                    <p className="font-ubuntu text-[17px] text-[#717171]">Delivery Time</p>
                    <p className="text-sm text-primary">{order.deliveryTime}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
              <div className="w-10 h-10 border border-gray-400 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-secondary" />
               </div>
                <div>
                  <p className="font-ubuntu text-[17px] text-[#717171]">Payment Status</p>
                  <Badge
                    className={
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-primary"
                        : order.paymentStatus === "pending"
                          ? "bg-amber-100 text-primary"
                          : "bg-gray-100 text-primary"
                    }
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-6 m-5">


          {/* Order Items */}
          <Card className=" p-4 w-full bg-white rounded-md">
            <CardHeader>
              <CardTitle className="text-foreground font-ubuntu">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white border-b border-gray-400">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-secondary">{index + 1}</span>
                      </div>
                      <span className="font-medium text-primary">{item}</span>
                    </div>
                    <span className="text-primary">1x</span>
                  </div>
                ))}
              </div>

            

              <div className="flex justify-between items-center mt-6 ">
                <span className="text-2xl font-ubuntu font-bold text-secondary">Total Amount</span>
                <span className="text-2xl font-ubuntu font-bold text-secondary">£{order.amount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

        </div>
        {/* Action Buttons */}
        <div className="flex justify-end  max-lg:justify-center max-lg:flex-col max-lg:gap-3 gap-3 m-5 pt-4  border-orange-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-secondary  text-secondary hover:bg-secondary bg-transparent px-6 py-3 rounded-lg"
          >
            Close
          </Button>
          <Button variant="outline" className=" text-white hover:text-secondary border border-transparent hover:border-secondary rounded-lg px-7 py-3 hover:bg-transparent bg-secondary">
            Contact Customer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
