"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart } from "lucide-react"
import { Header } from "@/components/customer-panel-components/header"
import { RestaurantHeader } from "@/components/customer-panel-components/restaurant-header"
import { MenuCategories } from "@/components/customer-panel-components/menu-categories"
import { CartSidebar } from "@/components/customer-panel-components/cart-sidebar"
import { Footer } from "@/components/customer-panel-components/footer"
import { MenuItems } from "@/components/customer-panel-components/menu-items"
import { getRestaurantBySlug, getPublicCategoriesWithItems } from "@/lib/api/restaurant.api";

export type MenuItem = {
  id: number
  name: string
  description: string
  price: number
  image: string
  images?: string[] // Multiple images support
  category: string
  popular?: boolean
  isAvailable?: boolean
  isVegetarian?: boolean
  customizations?: {
    id: string
    name: string
    required: boolean
    options: { id: string; name: string; price: number }[]
  }[]
}

export default function RestaurantPage() {
  const params = useParams()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [restaurant, setRestaurant] = useState<any>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string; itemCount: number }[]>([])
  const [loading, setLoading] = useState(true)

  const { items, addItem, getCartTotal, getCartCount } = useCart()

  // Fetch restaurant data and menu from API
  useEffect(() => {
    // prevent duplicate menu loads in bursts
    const menuLoadingRef = { current: false } as { current: boolean }
    const lastMenuFetchRef = { current: 0 } as { current: number }

    const loadPublicMenu = async () => {
      if (!params.slug) return
      const now = Date.now()
      if (menuLoadingRef.current) return
      if (now - lastMenuFetchRef.current < 1500) return
      try {
        menuLoadingRef.current = true
        // Fetch categories with items (public)
        const categoriesWithItems = await getPublicCategoriesWithItems(params.slug as string)

        // Flatten items and normalize shape
        const menuData: MenuItem[] = categoriesWithItems.flatMap((cat: any) =>
          (cat.menuItems || []).map((m: any) => ({
            id: Number(m.id),
            name: m.name || "Untitled",
            description: m.description || "",
            price: typeof m.price === 'number' ? m.price : parseFloat(m.price || '0'),
            image: m.image || "/placeholder.svg",
            images: m.images || (m.image ? [m.image] : ["/placeholder.svg"]), // Add images array
            category: m.category || cat.name || "Other",
            popular: undefined,
            isAvailable: m.isAvailable ?? true,
            isVegetarian: m.isVegetarian ?? false,
            customizations: [],
          }))
        )
        setMenuItems(menuData)

        // Group menu items by category and count
        const categoryMap = new Map<string, number>()
        menuData.forEach((item: MenuItem) => {
          const count = categoryMap.get(item.category) || 0
          categoryMap.set(item.category, count + 1)
        })

        // Format categories
        const formattedCategories = [
          { id: "all", name: "All Items", itemCount: menuData.length },
          ...Array.from(categoryMap.entries()).map(([name, count]) => ({
            id: name.toLowerCase(),
            name,
            itemCount: count,
          }))
        ]
        setCategories(formattedCategories)
      } catch (error) {
        console.error("Failed to fetch public menu:", error)
      } finally {
        menuLoadingRef.current = false
        lastMenuFetchRef.current = Date.now()
      }
    }

    const loadAll = async () => {
      if (!params.slug) return
      setLoading(true)
      try {
        const restaurantData = await getRestaurantBySlug(params.slug as string)
        setRestaurant(restaurantData)
        await loadPublicMenu()
      } catch (error) {
        console.error("Failed to fetch restaurant data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAll()

    // Refresh on focus
    const onFocus = () => loadPublicMenu()
    window.addEventListener("focus", onFocus)

    // Cross-tab updates via BroadcastChannel
    const channel = new BroadcastChannel("chop-restaurant-updates")
    const onMessage = (evt: MessageEvent) => {
      const msg = evt.data as any
      if (msg?.type === "menuUpdated" && msg?.slug === (params.slug as string)) {
        loadPublicMenu()
      }
      if (msg?.type === "categoriesUpdated" && msg?.slug === (params.slug as string)) {
        loadPublicMenu()
      }
    }
    channel.addEventListener("message", onMessage)

    return () => {
      window.removeEventListener("focus", onFocus)
      channel.removeEventListener("message", onMessage)
      channel.close()
    }
  }, [params.slug])

  // Filter menu items by selected category
  const filteredMenuItems = selectedCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category.toLowerCase() === selectedCategory)

  const addToCart = (item: MenuItem, customizations: any, quantity: number) => {
    if (!restaurant) return

    const cartItem = {
      id: `${item.id}-${Date.now()}`,
      menuItem: item,
      customizations,
      quantity,
      totalPrice: calculateItemPrice(item, customizations) * quantity,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      restaurantSlug: params.slug as string,
    }
    addItem(cartItem)
  }

  const calculateItemPrice = (item: MenuItem, customizations: any) => {
    let price = item.price
    
    if (customizations) {
      Object.values(customizations).forEach((customization: any) => {
        if (Array.isArray(customization)) {
          customization.forEach((option: any) => {
            if (option?.price) {
              price += option.price
            }
          })
        } else if (customization?.price) {
          price += customization.price
        }
      })
    }
    
    return price
  }

  const cartTotal = getCartTotal()
  const cartItemCount = getCartCount()

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
            <p className="mt-4 text-muted-foreground">Loading restaurant...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-xl text-muted-foreground">Restaurant not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <RestaurantHeader restaurant={restaurant} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Menu Categories Sidebar */}
            <div className="lg:w-64">
              <MenuCategories
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            {/* Menu Items */}
            <div className="flex-1">
              {filteredMenuItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No menu items available</p>
                </div>
              ) : (
                <MenuItems 
                  items={filteredMenuItems} 
                  categoryName={selectedCategory === "all" ? "All Items" : categories.find(c => c.id === selectedCategory)?.name || "Menu"}
                  onAddToCart={addToCart} 
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-8 right-8 z-40">
          <Button
            size="lg"
            className="shadow-lg rounded-full h-16 w-16 p-0 relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground rounded-full h-8 w-8 flex items-center justify-center text-sm font-semibold">
              {cartItemCount}
            </span>
          </Button>
        </div>
      )}

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        restaurant={{
          name: restaurant.name,
          deliveryFee: 2.50,
          serviceFee: 0,
          minimumOrder: restaurant.minimumOrder || 15
        }}
      />

      <Footer />
    </div>
  )
}
