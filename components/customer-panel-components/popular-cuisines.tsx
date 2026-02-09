"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, easeOut } from "framer-motion"
import { Star } from "lucide-react"

const popularCuisines = [
  { id: 1, name: "Funzo Place", image: "/restaurant-1.jpeg", restaurantCount: 45, rating: "4.8" },
  { id: 2, name: "Bwibo", image: "/restaurant-2.jpeg", restaurantCount: 38, rating: "4.8" },
  { id: 3, name: "Mombasa", image: "/restaurant-3.jpeg", restaurantCount: 32, rating: "4.8" },
  { id: 4, name: "Safari", image: "/restaurant-4.jpeg", restaurantCount: 28, rating: "4.8" },
  { id: 5, name: "Bogobiri House", image: "/restaurant-5.jpeg", restaurantCount: 25, rating: "4.8" },
  { id: 6, name: "Morrocan Place", image: "/restaurant-6.jpeg", restaurantCount: 42, rating: "4.8" },
  { id: 7, name: "Nigerian Pot", image: "/restaurant-7.jpeg", restaurantCount: 22, rating: "4.8" },
  { id: 8, name: "Savanna Flavors", image: "/restaurant-8.jpeg", restaurantCount: 18, rating: "4.8" },
]

// Container animation with stagger effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

// Card animation
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
}

export function PopularCuisines() {
  return (
    <section className="py-16 max-2xl:py-6 bg-white h-[600px] max-2xl:h-full max-2xl:py-20  max-sm:h-full max-sm:py-34 relative">

      <img
        src="/cusine-shape.png"
        alt="Cuisine shape"
        className="absolute max-sm:w-30 top-0 right-0 max-2xl:w-30 w-40 pointer-events-none select-none opacity-15  float-shape" />

      <img
        src="/cusine-shape-2.png"
        alt="Cuisine shape"
        className="absolute max-sm:w-30 bottom-0 max-2xl:w-30 left-0 w-30 pointer-events-none select-none  float-shape" />


      <div className="container mx-auto px-8 max-sm:px-4 max-lg:px-12 max-2xl:px-6">

        {/* Heading */}
        <div className="text-center mb-12 max-2xl:mb-0">
          <h2
            className="font-fredoka-one font-extrabold text-5xl max-sm:text-2xl text-foreground mb-4"

          >
          Explore Authentic West African Cuisine in UK
          </h2>
          <div className="bg-primary h-1 w-24 mx-auto mb-4"></div>
          <p
            className="text-[16px] font-ubuntu text-foreground max-w-2xl max-2xl:mb-4 mx-auto"

          >
           Experience authentic flavours with trusted African food delivery, UK customers rely on.
Bringing Authentic Taste to Your Home

          </p>
        </div>

        {/* Grid with animation */}
        <motion.div
          className="grid grid-cols-8 max-2xl:grid-cols-4  max-md:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-6  gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          {popularCuisines.map((cuisine) => (
            <motion.div
              key={cuisine.id}
              variants={itemVariants}

              className="cursor-pointer"
            >
              <Link href="/restaurants" passHref>
                <Card className="group transition-colors duration-400  border-2 border-transparent  hover:border-secondary shadow-md backdrop-blur-2xl bg-white rounded-xl overflow-hidden">
                  <CardContent className="p-3 text-center">
                    <div className="relative overflow-hidden rounded-lg mb-3">
                      <img
                        src={cuisine.image || "/placeholder.svg"}
                        alt={cuisine.name}
                        className="w-full h-20 object-cover max-2xl:h-50"
                      />

                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-space-grotesk text-left font-semibold text-[16px] text-foreground mb-1">
                        {cuisine.name}
                      </h3>
                      <p className="text-sm text-left text-primary">
                        {cuisine.restaurantCount} restaurants
                      </p>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-secondary text-secondary" />
                        <span className="font-medium text-sm text-foreground">{cuisine.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
