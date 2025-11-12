"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"
import { motion, easeOut } from "framer-motion"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push("/restaurants")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  // Animation variants
  const leftVariant = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: easeOut } },
  }

  const rightVariant = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: easeOut } },
  }

  const boxVariant = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
    },
  }

  return (
    <section
      className="relative py-24 max-sm:py-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/hero-banner.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/30" />
    

      <div className="container relative z-10 mx-auto mt-10 px-8 max-md:px-8 max-sm:px-8">
    
        <div className="max-w-7xl mx-auto text-center">
          {/* Animated Heading */}
          <img
        src="/lines.svg"
        alt="Cuisine shape"
        className="w-80 mx-auto pointer-events-none mb-10 select-none max-sm:w-50"
      />
          <div className="flex max-sm:flex-col max-md:flex-col gap-4 items-center justify-center">

            <motion.h1
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: easeOut }}
              className="font-fredoka-one font font-bold max-lg:text-4xl max-md:text-5xl  lg:text-5xl mb-10 max-sm:text-3xl max-sm:mb-2  text-white"
            >
              Craving African
            </motion.h1>

            {/* Animated Paragraph */}
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: easeOut, delay: 0.3 }}
              className="font-fredoka-one font-bold  max-lg:text-4xl max-md:text-5xl  lg:text-5xl mb-10 max-sm:text-2xl  max-sm:mb-2  text-secondary"
            >
              &
            </motion.h1>

            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: easeOut, delay: 0.3 }}
              className="font-fredoka-one font-bold   max-lg:text-4xl max-md:text-5xl  lg:text-5xl mb-10 max-sm:text-2xl  max-sm:mb-2  text-white"
            >
              Caribbean Flavours?
            </motion.h1>
          </div>

          {/* Animated CTA */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.5 }}
          >
            <Button
              size="lg"
              className="font-medium bg-secondary mb-9  max-sm:mb-8 max-sm:mt-8  px-12 py-6 ease-in duration-300 rounded-lg  hover:bg-transparent border border-transparent hover:border-white text-white cursor-pointer"
              onClick={() => router.push("/restaurants")}
            >
              Order Now
            </Button>
          </motion.div>
          {/* Animated Search Bar */}
          <div className="max-w-4xl max-sm:w-5xl mx-auto mb-8">
            <motion.div
              className="flex flex-col sm:flex-row gap-4 py-3 px-5 bg-white rounded-lg shadow-lg text-primary"
              variants={boxVariant}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, ease: easeOut, when: "beforeChildren", staggerChildren: 0.2 }}
            >
              {/* Search Input */}
              <motion.div variants={rightVariant} className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for restaurants or dishes"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 py-5 bg-transparent border-none shadow-md"
                />
              </motion.div>

              {/* Buttons */}
              <motion.div variants={leftVariant} className="flex items-center max-sm:justify-between gap-2">
                <Button
                  variant="new"
                  size="sm"
                  className=" py-5  rounded-lg  text-foreground  shadow-none"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-[16px] font-ubuntu font-medium">Current Location
                  </span>                </Button>
                <Button
                  size="sm"
                  variant="new2"
                  className=" rounded-lg py-5 px-7 transition-all ease-in duration-300 text-white cursor-pointer"
                  onClick={handleSearch}
                >
                  <span className="text-lg font-medium font-ubuntu">  Search</span>

                </Button>
              </motion.div>
            </motion.div>
          </div>


        </div>
      </div>

      {/* Floating Background Shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl"></div>
      </div>
    </section>
  )
}
