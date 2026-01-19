"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart, type CartItem } from "@/contexts/cart-context"
import { customerOrders } from "@/lib/api/order.api"
import { STORAGE_KEYS } from "@/lib/api/config"
import { getUserProfile, getUserAddresses } from "@/lib/api/user.api"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/customer-panel-components/header"
import { Footer } from "@/components/customer-panel-components/footer"
import { StripePaymentForm } from "@/components/stripe-payment-form"
import { calculateDistance, calculateDeliveryFee } from "@/lib/utils/distance"
import { getRestaurantBySlug } from "@/lib/api/restaurant.api"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getCartTotal, clearCart } = useCart()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [customerEmail, setCustomerEmail] = useState("")
  const [restaurantData, setRestaurantData] = useState<any>(null)
  const [distanceKm, setDistanceKm] = useState<number>(0)
  const [calculatedDeliveryFee, setCalculatedDeliveryFee] = useState<number>(0)
  
  type CheckoutForm = {
    name: string;
    phone: string;
    address: string;
    instructions: string;
    paymentMethod: string;
  }

  const [formData, setFormData] = useState<CheckoutForm>({
    name: "",
    phone: "",
    address: "",
    instructions: "",
    paymentMethod: "CARD"
  })

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.USER_TOKEN)
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please login to place an order",
        variant: "destructive",
      })
      router.push("/user-signin")
      return
    }

    if (items.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Add items to cart before checkout",
      })
      router.push("/restaurants")
      return
    }

    // Prefill checkout form from user profile and default address
    const prefillFromProfile = async () => {
      try {
        const user = await getUserProfile()
        // Best-effort address fetch; don't block if it fails
        let defaultAddress: string | undefined
        try {
          const addresses = await getUserAddresses()
          const primary = addresses?.find((a: any) => a?.isDefault) || addresses?.[0]
          defaultAddress = primary?.address
        } catch (err) {
          // ignore address fetch errors
        }

  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
  setCustomerEmail(user?.email || "")

        setFormData((prev) => ({
          ...prev,
          name: prev.name || fullName,
          phone: prev.phone || user?.phone || "",
          address: prev.address || defaultAddress || "",
        }))
      } catch (error) {
        // ignore profile fetch errors; keep manual entry flow
        console.warn("Prefill from profile failed:", error)
      }
    }

    prefillFromProfile()

    // Fetch restaurant data and calculate distance
    const fetchRestaurantAndCalculateDistance = async () => {
      try {
        if (items.length === 0) return

        const restaurantSlug = items[0]?.restaurantSlug
        if (!restaurantSlug) {
          console.warn("No restaurant slug found in cart")
          return
        }

        // Fetch restaurant data
        const restaurant = await getRestaurantBySlug(restaurantSlug)
        if (!restaurant) {
          console.warn("Restaurant not found")
          return
        }
        setRestaurantData(restaurant)

        // Get customer GPS coordinates
        const coords = localStorage.getItem("user_coords")
        if (coords && restaurant.latitude && restaurant.longitude) {
          const parsed = JSON.parse(coords)
          const distance = calculateDistance(
            parsed.latitude,
            parsed.longitude,
            restaurant.latitude,
            restaurant.longitude
          )
          setDistanceKm(distance)
          
          // Calculate delivery fee based on distance (£0.50 per km)
          const deliveryFee = calculateDeliveryFee(distance)
          setCalculatedDeliveryFee(deliveryFee)
        } else {
          // Fallback to default delivery fee if no GPS data
          setCalculatedDeliveryFee(2.50)
        }
      } catch (error) {
        console.error("Error fetching restaurant or calculating distance:", error)
        setCalculatedDeliveryFee(2.50) // Fallback
      }
    }

    fetchRestaurantAndCalculateDistance()
  }, [items, router, toast])

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.phone || !formData.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Backend requires customerEmail even if not shown in UI
    if (!customerEmail) {
      toast({
        title: "Profile Email Required",
        description: "Your account email is missing. Please update your profile and try again.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      const restaurantId = items[0]?.restaurantId
      if (!restaurantId) {
        throw new Error("Restaurant information missing")
      }

      // @ts-ignore
      const orderItems = items.map(item => ({
        title: item.menuItem?.name || "",
        quantity: item.quantity,
        price: item.menuItem?.price || 0,
      }))

      // Get saved GPS coordinates
      let customerLatitude, customerLongitude
      try {
        const coords = localStorage.getItem("user_coords")
        if (coords) {
          const parsed = JSON.parse(coords)
          customerLatitude = parsed.latitude
          customerLongitude = parsed.longitude
        }
      } catch (err) {
        console.warn("No GPS coordinates available")
      }

      const orderPayload = {
        restaurantId,
        items: orderItems,
        deliveryAddress: formData.address,
        deliveryInstructions: formData.instructions || "",
        paymentMethod: formData.paymentMethod,
        customerName: formData.name,
        customerEmail,
        customerPhone: formData.phone,
        customerLatitude,
        customerLongitude,
      }

      await customerOrders.create(orderPayload)
      clearCart()

      toast({
        title: "Order Placed Successfully! 🎉",
        description: "Your order has been confirmed and sent to the restaurant. Redirecting...",
      })

      // Delay redirect to show success message
      setTimeout(() => {
        router.push("/profile?tab=orders")
      }, 3000)

    } catch (error: any) {
      console.error("Order error:", error)
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle successful Stripe payment
  const handlePaymentSuccess = async () => {
    try {
      const restaurantId = items[0]?.restaurantId
      if (!restaurantId) {
        throw new Error("Restaurant information missing")
      }

      // @ts-ignore
      const orderItems = items.map(item => ({
        title: item.menuItem?.name || "",
        quantity: item.quantity,
        price: item.menuItem?.price || 0,
      }))

      // Get saved GPS coordinates
      let customerLatitude, customerLongitude
      try {
        const coords = localStorage.getItem("user_coords")
        if (coords) {
          const parsed = JSON.parse(coords)
          customerLatitude = parsed.latitude
          customerLongitude = parsed.longitude
        }
      } catch (err) {
        console.warn("No GPS coordinates available")
      }

      const orderPayload = {
        restaurantId,
        items: orderItems,
        deliveryAddress: formData.address,
        deliveryInstructions: formData.instructions || "",
        paymentMethod: "CARD",
        customerName: formData.name,
        customerEmail,
        customerPhone: formData.phone,
        customerLatitude,
        customerLongitude,
      }

      await customerOrders.create(orderPayload)
      clearCart()

      router.push("/profile?tab=orders")
    } catch (error: any) {
      console.error("Order creation error:", error)
      toast({
        title: "Order Failed",
        description: "Payment succeeded but order creation failed. Please contact support.",
        variant: "destructive",
      })
    }
  }

  // Handle Stripe payment error
  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error || "Payment processing failed. Please try again.",
      variant: "destructive",
    })
  }

  const subtotal = getCartTotal()
  const platformFee = subtotal * 0.15 // ChopNow 15% platform fee on food only
  const deliveryFee = calculatedDeliveryFee || 2.50 // Distance-based: £0.50/km
  const grandTotal = subtotal + platformFee + deliveryFee

  if (items.length === 0) {
    return null
  }

  const updateForm = (patch: Partial<CheckoutForm>) => {
    setFormData((prev) => ({ ...prev, ...patch }))
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#f9f9f9] py-8">
      <div className="container mx-auto min-h-screen max-w-5xl">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-lg">
              <CardHeader className="p-4">
                <CardTitle className="text-primary">Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium mb-3 text-gray-700">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => updateForm({ name: e.target.value })}
                      required
                        className="border border-gray-300 placeholder:text-gray-400 text-foreground"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium mb-3 text-gray-700">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+44 7700 900000"
                      value={formData.phone}
                      onChange={(e) => updateForm({ phone: e.target.value })}
                      required
                        className="border border-gray-300 placeholder:text-gray-400 text-foreground"
                    />
                  </div>
                </div>

                {/* Contact field removed per request: not required on checkout */}

                <div>
                  <Label htmlFor="address"  className="text-sm font-medium mb-3 text-gray-700">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="123 Main Street, Apartment 4B, London, UK"
                    value={formData.address}
                    onChange={(e) => updateForm({ address: e.target.value })}
                    required
                    rows={3}
                        className="border border-gray-300 placeholder:text-gray-400 text-foreground"
                  />
                </div>

                <div>
                  <Label htmlFor="instructions" className="text-sm font-medium mb-3 text-gray-700">Delivery Instructions (Optional)</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Ring the doorbell, leave at door, etc."
                    value={formData.instructions}
                    onChange={(e) => updateForm({ instructions: e.target.value })}
                    rows={2}
                        className="border border-gray-300 placeholder:text-gray-400 text-foreground"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader className="p-4">
                <CardTitle className="text-primary">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => updateForm({ paymentMethod: value })}
                >
                  {/* Cash on Delivery Option */}
                  <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="CASH" id="cash" />
                    <Label htmlFor="cash" className="cursor-pointer flex-1">
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-sm text-gray-500">Pay when your order arrives</div>
                    </Label>
                  </div>

                  {/* Card Payment Option */}
                  <div className="border rounded-lg">
                    <div className="flex items-center space-x-2 p-3 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="CARD" id="card" />
                      <Label htmlFor="card" className="cursor-pointer flex-1">
                        <div className="font-medium">Card Payment</div>
                        <div className="text-sm text-gray-500">Pay securely with your credit/debit card</div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Cash on Delivery Form */}
            {formData.paymentMethod === "CASH" && (
              <form onSubmit={handlePlaceOrder}>
                <Button
                  type="submit"
                  className="w-full h-12 text-lg bg-secondary hover:bg-secondary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    `Place Order - £${grandTotal.toFixed(2)}`
                  )}
                </Button>
              </form>
            )}

            {/* Stripe Payment Form - Shows when CARD is selected */}
            {formData.paymentMethod === "CARD" && (
              <div className="p-4 border rounded-lg bg-gray-50/50">
                <StripePaymentForm
                  amount={grandTotal}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            )}
          </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4 bg-white shadow-lg">
            <CardHeader className="p-4">
              <CardTitle className="text-primary">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="space-y-3 pb-4 border-b">
                {/* @ts-ignore */}
                {items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.menuItem.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">£{item.totalPrice.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">Subtotal</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">Platform Fee (15%)</span>
                  <span>£{platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">Delivery Fee{distanceKm > 0 ? ` (${distanceKm.toFixed(1)} km × £0.50/km)` : ''}</span>
                  <span>£{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span className="text-foreground">Total</span>
                  <span>£{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-blue-800">
                  <strong>Demo Mode:</strong> This is for testing. No real payment will be processed.
                </p>
              </div> */}
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  )
}
