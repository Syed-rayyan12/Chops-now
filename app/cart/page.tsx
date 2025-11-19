"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, Tag } from "lucide-react"
import { Footer } from "@/components/customer-panel-components/footer"
import { Header } from "@/components/customer-panel-components/header"
import SignupRequired from "@/components/customer-panel-components/signup-required"


export default function CartPage() {
  const router = useRouter()
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getCartTotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    getDiscountAmount,
    getFinalTotal,
  } = useCart()

  const [promoInput, setPromoInput] = useState("")
  const [promoError, setPromoError] = useState("")
  const [openModal, setOpenModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])


  const handleApplyPromo = () => {
    if (!promoInput.trim()) return

    const success = applyPromoCode(promoInput.trim())
    if (success) {
      setPromoInput("")
      setPromoError("")
    } else {
      setPromoError("Invalid promo code or minimum order not met")
    }
  }

  const handleProceedToCheckout = () => {
    if (isLoggedIn) {
      // User is logged in → allow checkout
      router.push("/checkout");
    } else {
      // No user → show signup modal
      setOpenModal(true);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h1 className="font-heading font-bold text-3xl text-foreground mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any items to your cart yet. Start browsing our delicious options!
            </p>
            <Button asChild size="lg" className="cursor-pointer">
              <Link href="/restaurants">Browse Restaurants</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const restaurant = items[0] // All items are from the same restaurant
  const subtotal = getCartTotal()
  const discountAmount = getDiscountAmount()
  const finalTotal = getFinalTotal()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="font-heading font-bold text-3xl text-secondary">Your Cart</h1>
              <p className="text-foreground">From {restaurant.restaurantName}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="bg-white p-4 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between mb-6">
                  <CardTitle className="text-foreground"><span className="font-bold text-primary">Order Items</span> ({items.length})</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearCart} className=" bg-secondary text-white cursor-pointer">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Cart
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4 ">
                  {items.map((item) => (
                    <div key={item.id} className="flex max-sm:flex-col gap-4 p-4 border border-secondary rounded-lg">
                      <img
                        src={item.menuItem.image || "/placeholder.svg"}
                        alt={item.menuItem.name}
                        className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== "/placeholder.svg") {
                            target.src = "/placeholder.svg";
                          }
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-semibold text-foreground mb-1">{item.menuItem.name}</h3>
                        <p className="text-sm text-foreground mb-2 line-clamp-2">{item.menuItem.description}</p>

                        {/* Customizations */}
                        {Object.entries(item.customizations).map(([key, value]: [string, any]) => (
                          <div key={key} className="text-xs text-muted-foreground mb-1">
                            {Array.isArray(value)
                              ? value.length > 0 && <span className="text-foreground">{value.map((v: any) => v.name).join(", ")}</span>
                              : value && <span className="text-foreground">{value.name}</span>}
                          </div>
                        ))}

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="font-medium w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-heading font-semibold text-lg text-primary">£{item.totalPrice.toFixed(2)}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-destructive hover:text-white p-1 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 " />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Promo Code */}
              <Card className=" shadow-lg bg-white p-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-semibold text-foreground">
                    <Tag className="w-5 h-5 text-primary" />
                    <span className="text-primary">Promo Code</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                      <div>
                        <Badge className="mb-1">{appliedPromo.code}</Badge>
                        <p className="text-sm text-muted-foreground">
                          {appliedPromo.type === "percentage"
                            ? `${appliedPromo.discount}% off`
                            : `£${appliedPromo.discount} off`}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={removePromoCode} className="cursor-pointer bg-secondary">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter promo code"
                          className="border border-secondary"
                          value={promoInput}
                          onChange={(e) => {
                            setPromoInput(e.target.value)
                            setPromoError("")
                          }}
                          onKeyPress={(e) => e.key === "Enter" && handleApplyPromo()}
                        />
                        <Button onClick={handleApplyPromo} disabled={!promoInput.trim()} className="cursor-pointer bg-secondary rounded-lg">
                          Apply
                        </Button>
                      </div>
                      {promoError && <p className="text-sm text-destructive">{promoError}</p>}
                      <div className="text-xs text-muted-foreground">
                        <p>Try: WELCOME10, SAVE5, NEWUSER, FREESHIP</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className=" shadow-lg p-4 bg-white">
                <CardHeader>
                  <CardTitle className="font-semibold text-primary">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span className="text-secondary">£{subtotal.toFixed(2)}</span>
                  </div>

                  {appliedPromo && discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-primary">
                      <span className="text-primary">Discount ({appliedPromo.code})</span>
                      <span className="text-primary">-£{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">£{finalTotal.toFixed(2)}</span>
                  </div>

                  <Button variant="part2" onClick={handleProceedToCheckout} className="w-full bg-secondary text-white cursor-pointer" size="lg">
                    Proceed to Checkout
                  </Button>

                  <Button variant="part1" asChild className="w-full bg-primary text-white border-none cursor-pointer rounded-lg">
                    <Link href={restaurant?.restaurantSlug ? `/restaurant/${restaurant.restaurantSlug}` : "/restaurants"}>
                      Add More Items
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Signup Required Modal */}
      <SignupRequired onClose={() => setOpenModal(false)} open={openModal} onOpenChange={setOpenModal} />
    </div>
  )
}
