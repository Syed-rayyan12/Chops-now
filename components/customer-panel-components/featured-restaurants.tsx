"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Truck } from "lucide-react"
import Link from "next/link"
import { motion, easeOut } from "framer-motion"

const featuredRestaurants = [
  {
    id: 1,
    name: "jollof Express",
    image: "/feature-1.jpeg",
    rating: 4.8,
    deliveryTime: "25-35 min",
    deliveryFee: "Free",
    cuisine: "Morrocan",
    featured: true,
  },
  {
    id: 2,
    name: "Island Jerk",
    image: "/feature-2.jpeg",
    rating: 4.6,
    deliveryTime: "30-40 min",
    deliveryFee: "$2.99",
    cuisine: "Nigerian",
    featured: true,
  },
  {
    id: 3,
    name: "Curry Goat Delight",
    image: "/feature-3.jpeg",
    rating: 4.7,
    deliveryTime: "20-30 min",
    deliveryFee: "Free",
    cuisine: "Nigerian",
    featured: true,
  },
  {
    id: 4,
    name: "Egusi Magic",
    image: "/feature-4.jpeg",
    rating: 4.9,
    deliveryTime: "35-45 min",
    deliveryFee: "$3.99",
    cuisine: "Ghanaian",
    featured: true,
  },
]

// Container animation (staggered children)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

// Card animation (fade + slight slide)
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
}



export function FeaturedRestaurants() {
  return (
    <section className="py-16 bg-[url('/featured-bg.jpeg')] bg-cover max-sm:bg-auto bg-center relative">
      <style jsx>{`
  .desktop-svg {
    display: none; /* hide by default (mobile) */
  }
  @media (min-width: 640px) {
    .desktop-svg {
      display: block; /* show on sm and above */
    }
  }
`}</style>




      <div className=" mx-auto px-36 max-2xl:px-6 max-lg:px-12  max-sm:px-4">
        {/* Heading (no animation) */}
        <div className="text-center mb-12">
          <h2 className="font-fredoka-one font-extrabold  text-5xl max-sm:text-2xl max-lg:text-4xl text-foreground mb-4">
            Find Your Favourite Caribbean Food in UK
          </h2>
          <div className="bg-secondary h-1 w-24 mx-auto mb-4"></div>

          <p className="text-[16px] text-foreground font-ubuntu max-w-2xl max-md:px-22 max-sm:px-0 mx-auto">
            Discover authentic Nigerian, Ghanaian, and Jamaican food Manchester locals love, cooked by talented
            chefs near you
          </p>
        </div>

        {/* Cards with fade + slide on scroll */}
        <motion.div
          className="grid grid-cols-4 max-sm:grid-cols-1 max-md:grid-cols-1 max-md:px-12 max-sm:px-6 max-lg:grid-cols-2  gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          {featuredRestaurants.map((restaurant) => (
            <Link key={restaurant.id} href="/restaurants" passHref>
              <motion.div variants={itemVariants}>
                <Card className="group cursor-pointer  transform-3d hover:-translate-y-1 duration-300 transition-all bg-white border-none rounded-2xl  overflow-hidden">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={restaurant.image || "/placeholder.svg"}
                      alt={restaurant.name}
                      className="w-full h-48 max-sm:h-full max-md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {restaurant.featured && (
                      <Badge className="absolute top-3 left-3 bg-secondary text-primary-foreground">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-space-grotesk font-semibold text-lg text-foreground mb-2">
                      {restaurant.name}
                    </h3>
                    <p className="text-sm text-secondary mb-3">{restaurant.cuisine}</p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-secondary text-secondary" />
                        <span className="font-medium">{restaurant.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Truck className="w-4 h-4 text-secondary" />
                        <span className="text-primary font-bold">{restaurant.deliveryFee}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
