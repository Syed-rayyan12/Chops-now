"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export interface CartItem {
  id: string
  menuItem: {
    id: number
    name: string
    description: string
    price: number
    image: string
    category: string
  }
  customizations: any
  quantity: number
  totalPrice: number
  restaurantId: number
  restaurantName: string
  restaurantSlug?: string
}

export interface PromoCode {
  code: string
  discount: number
  type: "percentage" | "fixed"
  minOrder?: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  appliedPromo: PromoCode | null
  applyPromoCode: (code: string) => boolean
  removePromoCode: () => void
  getDiscountAmount: () => number
  getFinalTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = "chop-now-cart"
const PROMO_KEY = "chop-now-promo"

// Mock promo codes
const AVAILABLE_PROMOS: PromoCode[] = [
  { code: "WELCOME10", discount: 10, type: "percentage", minOrder: 20 },
  { code: "SAVE5", discount: 5, type: "fixed", minOrder: 15 },
  { code: "NEWUSER", discount: 15, type: "percentage", minOrder: 25 },
  { code: "FREESHIP", discount: 3.99, type: "fixed", minOrder: 10 },
]

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY)
      const savedPromo = localStorage.getItem(PROMO_KEY)

      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }

      if (savedPromo) {
        setAppliedPromo(JSON.parse(savedPromo))
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      } catch (error) {
        console.error("Error saving cart to localStorage:", error)
      }
    }
  }, [items, isLoaded])

  // Save promo to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        if (appliedPromo) {
          localStorage.setItem(PROMO_KEY, JSON.stringify(appliedPromo))
        } else {
          localStorage.removeItem(PROMO_KEY)
        }
      } catch (error) {
        console.error("Error saving promo to localStorage:", error)
      }
    }
  }, [appliedPromo, isLoaded])

  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      // Check if adding from different restaurant
      if (prevItems.length > 0 && prevItems[0].restaurantId !== newItem.restaurantId) {
        // Clear cart and add new item
        return [newItem]
      }

      // Check if exact same item with same customizations exists
      const existingItemIndex = prevItems.findIndex((item) => {
        return (
          item.menuItem.id === newItem.menuItem.id &&
          JSON.stringify(item.customizations) === JSON.stringify(newItem.customizations)
        )
      })

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...prevItems]
        const existingItem = updatedItems[existingItemIndex]
        const unitPrice = existingItem.totalPrice / existingItem.quantity
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + newItem.quantity,
          totalPrice: unitPrice * (existingItem.quantity + newItem.quantity),
        }
        return updatedItems
      } else {
        // Add new item
        return [...prevItems, newItem]
      }
    })
  }

  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const unitPrice = item.totalPrice / item.quantity
          return {
            ...item,
            quantity,
            totalPrice: unitPrice * quantity,
          }
        }
        return item
      }),
    )
  }

  const clearCart = () => {
    setItems([])
    setAppliedPromo(null)
  }

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.totalPrice, 0)
  }

  const getCartCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const applyPromoCode = (code: string): boolean => {
    const promo = AVAILABLE_PROMOS.find((p) => p.code.toLowerCase() === code.toLowerCase())

    if (!promo) {
      return false
    }

    const cartTotal = getCartTotal()
    if (promo.minOrder && cartTotal < promo.minOrder) {
      return false
    }

    setAppliedPromo(promo)
    return true
  }

  const removePromoCode = () => {
    setAppliedPromo(null)
  }

  const getDiscountAmount = (): number => {
    if (!appliedPromo) return 0

    const cartTotal = getCartTotal()

    if (appliedPromo.type === "percentage") {
      return (cartTotal * appliedPromo.discount) / 100
    } else {
      return appliedPromo.discount
    }
  }

  const getFinalTotal = (): number => {
    const cartTotal = getCartTotal()
    const discount = getDiscountAmount()
    return Math.max(0, cartTotal - discount)
  }

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    getDiscountAmount,
    getFinalTotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
