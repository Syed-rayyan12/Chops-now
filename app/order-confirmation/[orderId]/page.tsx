"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, MapPin, CreditCard, Phone, Tag } from "lucide-react"
import { Footer } from "@/components/customer-panel-components/footer"
import { Header } from "@/components/customer-panel-components/header"

interface Order {
  id: string
  items: any[]
  restaurant: {
    id: number
    name: string
  }
  address: {
    label: string
    address: string
    details?: string
  }
  paymentMethod: {
    label: string
    type: string
  }
  deliveryInstructions: string
  pricing: {
    subtotal: number
    discount: number
    deliveryFee: number
    serviceFee: number
    total: number
  }
  appliedPromo: any
  status: string
  estimatedDelivery: string
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    const orderId = params.orderId as string
    const orders = JSON.parse(localStorage.getItem("chop-now-orders") || "[]")
    const foundOrder = orders.find((o: Order) => o.id === orderId)

    if (foundOrder) {
      setOrder(foundOrder)
    } else {
      router.push("/")
    }
  }, [params.orderId, router])

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <p>Loading order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const estimatedDelivery = new Date(order.estimatedDelivery)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">Your order has been placed successfully and is being prepared.</p>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Order #{order.id.split("-")[1]}</p>
                    <p className="text-sm text-muted-foreground">From {order.restaurant.name}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    Estimated delivery:{" "}
                    {estimatedDelivery.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Items Ordered */}
            <Card>
              <CardHeader>
                <CardTitle>Items Ordered</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex-1">
                      <p className="font-medium">
                        {item.quantity}x {item.menuItem.name}
                      </p>
                      {Object.entries(item.customizations).map(([key, value]: [string, any]) => (
                        <p key={key} className="text-xs text-muted-foreground">
                          {Array.isArray(value)
                            ? value.length > 0 && value.map((v: any) => v.name).join(", ")
                            : value && value.name}
                        </p>
                      ))}
                    </div>
                    <span className="font-medium">${item.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Delivery Details */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{order.address.label}</p>
                    <p className="text-sm text-muted-foreground">{order.address.address}</p>
                    {order.address.details && (
                      <p className="text-xs text-muted-foreground mt-1">{order.address.details}</p>
                    )}
                  </div>
                </div>

                {order.deliveryInstructions && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Instructions:</span> {order.deliveryInstructions}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{order.paymentMethod.label}</span>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${order.pricing.subtotal.toFixed(2)}</span>
                  </div>

                  {order.appliedPromo && order.pricing.discount > 0 && (
                    <div className="flex justify-between text-primary">
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>Discount ({order.appliedPromo.code})</span>
                      </div>
                      <span>-${order.pricing.discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery fee</span>
                    <span>{order.pricing.deliveryFee === 0 ? "Free" : `$${order.pricing.deliveryFee.toFixed(2)}`}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>${order.pricing.serviceFee.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Paid</span>
                    <span>${order.pricing.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button asChild className="w-full" size="lg">
                <Link href={`/order-tracking/${order.id}`}>Track Your Order</Link>
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" asChild className="bg-transparent">
                  <Link href="/restaurants">Order Again</Link>
                </Button>
                <Button variant="outline" className="bg-transparent">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </div>

            {/* Thank You Message */}
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">
                Thank you for choosing Chop Now! We'll send you updates about your order via notifications.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
