import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Truck, MapPin, Search } from "lucide-react"
import type { Restaurant, ViewMode } from "@/app/restaurants/page"
import { motion, AnimatePresence } from "framer-motion"

interface RestaurantGridProps {
  restaurants: Restaurant[]
  viewMode: ViewMode
}

export function RestaurantGrid({ restaurants, viewMode }: RestaurantGridProps) {
  if (restaurants.length === 0) {
    return (
      <div className="text-center ">
        <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground mb-2">No restaurants found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
      </div>
    )
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
       <AnimatePresence>
        {restaurants.map((restaurant) => (
          <motion.div
            key={restaurant.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Link href={`/restaurant/${restaurant.slug}`}>
              <Card className="group cursor-pointer  transition-all duration-300 border-primary/50 bg-white shadow-md hover:shadow-xl">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {restaurant.featured && (
                    <Badge className="absolute top-3 left-3 bg-secondary text-primary-foreground">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-fredoka-one font-bold text-lg text-foreground mb-1">
                        {restaurant.name}
                      </h3>
                      <p className="text-secondary font-ubuntu text-sm">{restaurant.cuisine}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-sm">{restaurant.rating}</span>
                      </div>
                      <p className="text-muted-foreground text-sm">{restaurant.priceRange}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Clock className="w-4 h-4 text-secondary" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Truck className="w-4 h-4 text-secondary" />
                      <span className="">
                        {restaurant.deliveryFee === 0 ? "Free" : `£${restaurant.deliveryFee}`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-secondary" />
                      <span>{restaurant.distance} km</span>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {restaurant.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs bg-primary text-white hover:bg-primary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {restaurants.map((restaurant) => (
          <motion.div
            key={restaurant.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Link href={`/restaurant/${restaurant.slug}`}>
              <Card className="group cursor-pointer border-primary/50 transition-all duration-300 bg-white shadow-md hover:shadow-xl">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {restaurant.featured && (
                    <Badge className="absolute top-3 left-3 bg-secondary text-primary-foreground">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-fredoka-one font-semibold text-[18px] text-foreground mb-1">
                        {restaurant.name}
                      </h3>
                      <p className="text-secondary font-ubuntu text-sm">{restaurant.cuisine}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium font-ubuntu text-sm">{restaurant.rating}</span>
                      </div>
                      <p className="text-muted-foreground font-ubuntu text-sm">{restaurant.priceRange}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Clock className="w-4 h-4 text-secondary" />
                      <span className="font-ubuntu">{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Truck className="w-4 h-4 text-secondary" />
                      <span className="text-foreground font-ubuntu">
                        {restaurant.deliveryFee === 0 ? "Free" : `£${restaurant.deliveryFee}`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-secondary" />
                      <span>{restaurant.distance} km</span>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {restaurant.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs bg-primary border-none text-white hover:bg-primary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
