"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Minus, Plus, Star } from "lucide-react"
// Updated import to slug-based route
import type { MenuItem } from "@/app/restaurant/[slug]/page"
import { ImageCarousel } from "@/components/ui/image-carousel"

interface MenuItemModalProps {
  item: MenuItem
  isOpen: boolean
  onClose: () => void
  onAddToCart: (item: MenuItem, customizations: any, quantity: number) => void
}

export function MenuItemModal({ item, isOpen, onClose, onAddToCart }: MenuItemModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [customizations, setCustomizations] = useState<any>({})
  const itemCustomizations = Array.isArray(item.customizations) ? item.customizations : []

  const handleCustomizationChange = (customizationId: string, value: any) => {
    setCustomizations((prev: any) => ({
      ...prev,
      [customizationId]: value,
    }))
  }

  const calculateTotalPrice = () => {
    let price = item.price
    Object.values(customizations).forEach((customization: any) => {
      if (Array.isArray(customization)) {
        customization.forEach((option: any) => {
          price += option.price
        })
      } else if (customization?.price) {
        price += customization.price
      }
    })
    return price * quantity
  }

  const handleAddToCart = () => {
    // Validate required customizations (guard against undefined)
    const missingRequired = itemCustomizations.filter((custom) => custom.required && !customizations[custom.id])

    if (missingRequired.length > 0) {
      alert(`Please select: ${missingRequired.map((c) => c.name).join(", ")}`)
      return
    }

    onAddToCart(item, customizations, quantity)
    onClose()
    setQuantity(1)
    setCustomizations({})
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 bg-white">
        <DialogHeader>
          <DialogTitle className="sr-only">Menu Item Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Item Image */}
          <div className="relative h-80 rounded-lg overflow-hidden bg-gray-100">
            {(() => {
              const images = item.images && item.images.length > 0 ? item.images : (item.image ? [item.image] : ["/placeholder.svg"])
              
              if (images.length > 1) {
                return (
                  <>
                    <ImageCarousel
                      images={images}
                      alt={item.name}
                      showThumbnails={true}
                      className="w-full h-full"
                    />
                    <div className="absolute top-3 left-3 bg-secondary text-white text-sm px-3 py-1.5 rounded-full shadow-lg z-20 font-semibold">
                      {images.length} Photos
                    </div>
                  </>
                )
              } else {
                return (
                  <img 
                    src={images[0]} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                  />
                )
              }
            })()}
          </div>

          {/* Item Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="font-heading font-semibold text-2xl text-foreground">{item.name}</h2>
              {item.popular && (
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mb-4">{item.description}</p>
            <p className="font-heading font-semibold text-xl text-foreground">£{item.price.toFixed(2)}</p>
          </div>

          {/* Customizations */}
          {itemCustomizations.map((customization) => (
            <div key={customization.id} className="space-y-3">
              <h3 className="font-heading font-semibold text-foreground">
                {customization.name}
                {customization.required && <span className="text-destructive ml-1">*</span>}
              </h3>

              {customization.required ? (
                <RadioGroup
                  value={customizations[customization.id]?.id || ""}
                  onValueChange={(value) => {
                    const option = customization.options.find((opt) => opt.id === value)
                    handleCustomizationChange(customization.id, option)
                  }}
                >
                  {customization.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={option.id} className="border border-primary/50" />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <span>{option.name}</span>
                          {option.price > 0 && <span className="text-muted-foreground">+£{option.price}</span>}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="space-y-2">
                  {customization.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                      className="border-primary/50"
                        id={option.id}
                        checked={
                          customizations[customization.id]?.some((selected: any) => selected.id === option.id) || false
                        }
                        onCheckedChange={(checked) => {
                          const current = customizations[customization.id] || []
                          if (checked) {
                            handleCustomizationChange(customization.id, [...current, option])
                          } else {
                            handleCustomizationChange(
                              customization.id,
                              current.filter((item: any) => item.id !== option.id),
                            )
                          }
                        }}
                      />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <span>{option.name}</span>
                          {option.price > 0 && <span className="text-muted-foreground">+£{option.price}</span>}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Quantity and Add to Cart */}
          <div className="flex items-center max-sm:gap-4 justify-between pt-4 border-t border-primary/50">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="bg-primary text-white cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-medium text-lg w-8 text-center">{quantity}</span>
              <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)} className="bg-primary text-white cursor-pointer">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <Button onClick={handleAddToCart} size="lg" className="font-medium bg-primary text-white cursor-pointer">
              Add to Cart • £{calculateTotalPrice().toFixed(2)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
