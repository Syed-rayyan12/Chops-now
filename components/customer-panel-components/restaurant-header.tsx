import { Badge } from "@/components/ui/badge"
import { Star, Clock, Truck, MapPin, Phone, Info } from "lucide-react"
import Image from "next/image"

interface RestaurantHeaderProps {
  restaurant: {
    name: string
    image: string
    coverImage?: string
    rating: number
    reviewCount: number
    deliveryTime: string
    deliveryFee: number
    serviceFee: number
    cuisine: string
    priceRange: string
    distance: number
    address: string
    phone: string
    description: string
    openingHours: string
    minimumOrder: number
  }
}

export function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  return (
    <div className="relative ">
      {/* Cover Image */}
      <div className="h-64 md:h-80 relative overflow-hidden">
        <Image
          src={restaurant.coverImage || restaurant.image || "/italian-restaurant-food.png"}
          alt={restaurant.name}
          fill
          priority
          className="object-cover w-full"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Restaurant Info */}
      <div className="container  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 bg-white rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.2)] p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Restaurant Logo */}
            <div className="flex-shrink-0">
              <img
                src={restaurant.image || "/placeholder.svg"}
                alt={restaurant.name}
                className="w-24 h-24 rounded-lg object-cover border-2 p-1 border-secondary shadow-md"
              />
            </div>

            {/* Restaurant Details */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="font-fredoka-one font-semibold text-2xl md:text-3xl text-foreground mb-2">
                    {restaurant.name}
                  </h1>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-primary">{restaurant.rating}</span>
                      <span className="text-muted-foreground">({restaurant.reviewCount} reviews)</span>
                    </div>
                    <Badge variant="outline" className="bg-primary text-white">{restaurant.cuisine}</Badge>

                  </div>
                  <p className="text-muted-foreground font-ubuntu mb-4 max-w-2xl text-[16px]">{restaurant.description}</p>
                </div>

                {/* Delivery Info */}
                <div className="bg-background rounded-lg p-4 min-w-64">
                  <h3 className="font-space-grotesk font-semibold text-primary mb-3">Delivery Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span>Delivery time</span>
                      </div>
                      <span className="font-medium text-gray-600">{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      {/* <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-muted-foreground" />
                        <span>Delivery fee</span>
                      </div>
                      <span className="font-medium">
                        {restaurant.deliveryFee === 0 ? "Free" : `£${restaurant.deliveryFee}`}
                      </span> */}
                    </div>
                    {/* <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Info className="w-4 h-4 text-muted-foreground" />
                        <span>Service fee</span>
                      </div>
                      <span className="font-medium text-gray-600">£{restaurant.serviceFee}</span>
                    </div> */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-secondary" />
                        <span >Distance</span>
                      </div>
                      <span className="font-medium text-gray-600">{restaurant.distance} km</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-primary/50">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-foreground">{restaurant.address}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-foreground">{restaurant.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-foreground">{restaurant.openingHours}</span>
                </div>
              </div>

              {restaurant.minimumOrder > 0 && (
                <div className="mt-3 p-3 bg-secondary rounded-lg">
                  <p className="text-sm text-background font-medium">Minimum order: £{restaurant.minimumOrder}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
