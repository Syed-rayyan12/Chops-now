"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Star, Plus } from "lucide-react"
// Updated import to slug-based route
import type { MenuItem } from "@/app/restaurant/[slug]/page"
import { MenuItemModal } from "./menu-item-modal"
import { ImageCarousel } from "@/components/ui/image-carousel"

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

                <div className="w-full sm:w-64 h-56 relative overflow-hidden rounded-r-md group">
                  {(() => {
                    const images = item.images && item.images.length > 0 ? item.images : (item.image ? [item.image] : ["/placeholder.svg"])
                    
                    if (images.length === 1) {
                      return (
                        <img
                          src={images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      )
                    } else if (images.length === 2) {
                      return (
                        <div className="grid grid-cols-2 gap-1 h-full">
                          {images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`${item.name} ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ))}
                        </div>
                      )
                    } else if (images.length === 3) {
                      return (
                        <div className="grid grid-cols-2 gap-1 h-full">
                          <img
                            src={images[0]}
                            alt={`${item.name} 1`}
                            className="w-full h-full col-span-2 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {images.slice(1).map((img, idx) => (
                            <img
                              key={idx + 1}
                              src={img}
                              alt={`${item.name} ${idx + 2}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ))}
                        </div>
                      )
                    } else {
                      return (
                        <div className="relative w-full h-full">
                          <ImageCarousel
                            images={images}
                            alt={item.name}
                            className="w-full h-full"
                          />
                          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-20">
                            {images.length} photos
                          </div>
                        </div>
                      )
                    }
                  })()}
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
