"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Star, Plus } from "lucide-react"
// Updated import to slug-based route
import type { MenuItem } from "@/app/restaurant/[slug]/page"
import { MenuItemModal } from "./menu-item-modal"

interface MenuItemsProps {
  items: MenuItem[]
  categoryName: string
  onAddToCart: (item: MenuItem, customizations: any, quantity: number) => void
}

export function MenuItems({ items, categoryName, onAddToCart }: MenuItemsProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="font-heading font-bold text-2xl text-foreground mb-4">{categoryName}</h2>
        <p className="text-muted-foreground">No items available in this category</p>
      </div>
    )
  }

  return (
    <div className=" bg-white rounded-lg px-8 py-4 shadow-[0_0_15px_rgba(0,0,0,0.2)]">
      <h2 className="font-fredoka-one text-primary font-bold text-xl text-foreground mb-6">{categoryName}</h2>
      <div className="grid gap-6">
        {items.map((item) => (
       

       
        <Card
          
            key={item.id}
            className="group cursor-pointer   transition-all duration-300 bg-transparent rounded-md border border-secondary"
            onClick={() => setSelectedItem(item)}
          >
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-heading font-semibold text-lg text-foreground">{item.name}</h3>
                        {item.popular && (
                          <Badge className="bg-primary  p-[6px]">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-foreground font-ubuntu text-sm mb-3 line-clamp-2">{item.description}</p>
                      <p className="font-ubuntu font-semibold text-lg text-primary">£{item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  {Array.isArray(item.customizations) && item.customizations.length > 0 && (
                    <p className="text-xs text-foreground mb-3">Customization available</p>
                  )}

                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (Array.isArray(item.customizations) && item.customizations.length > 0) {
                        setSelectedItem(item)
                      } else {
                        onAddToCart(item, {}, 1)
                      }
                    }}
                    className="bg-secondary text-white cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>

                <div className="w-full flex justify-center items-center sm:w-48 h-48 sm:h-auto relative overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-60 h-full p-3 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
        ))}
      </div>

      {/* Menu Item Modal */}
      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  )
}
