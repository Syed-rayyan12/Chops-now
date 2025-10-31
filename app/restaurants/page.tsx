"use client"

import { useState, useMemo, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Grid, List, SlidersHorizontal } from "lucide-react"
import { Header } from "@/components/customer-panel-components/header"
import { SearchBar } from "@/components/customer-panel-components/search-bar"
import { RestaurantFilters } from "@/components/customer-panel-components/restaurant-filters"
import { RestaurantGrid } from "@/components/customer-panel-components/restaurant-grid"
import { Footer } from "@/components/customer-panel-components/footer"
import { RestaurantRiderNavbar } from "@/components/customer-panel-components/admin-rider-navbar"
import { getAllRestaurants } from "@/lib/api/restaurant.api";

export type SortOption = "recommended" | "rating" | "delivery-time" | "distance"
export type ViewMode = "grid" | "list"

export type Restaurant = {
  id: number
  name: string
  slug: string // ✅ Added slug
  phone: string
  address: string
  createdAt: string
  image?: string
  cuisine?: string
  rating?: number
  deliveryTime?: string
  deliveryFee?: number
  priceRange?: string
  distance?: number
  featured?: boolean
  tags?: string[]
}

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [maxDeliveryTime, setMaxDeliveryTime] = useState<number>(60)
  const [minRating, setMinRating] = useState<number>(0)
  const [sortBy, setSortBy] = useState<SortOption>("recommended")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch restaurants from API
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true)
      try {
        const data = await getAllRestaurants({
          cuisineType: selectedCuisines[0], // Using first selected cuisine
          priceRange: selectedPriceRanges[0], // Using first selected price range
          sortBy: sortBy === "rating" ? "highest-rated" : sortBy === "delivery-time" ? "fastest-delivery" : sortBy,
          search: searchQuery,
        })
        setRestaurants(data)
      } catch (error) {
        console.error("Failed to fetch restaurants:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [searchQuery, selectedCuisines, selectedPriceRanges, sortBy])

  const filteredAndSortedRestaurants = useMemo(() => {
  const filtered = restaurants.filter((restaurant) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = restaurant.name.toLowerCase().includes(query)
        const matchesCuisine = (restaurant.cuisine || "").toLowerCase().includes(query)
        const matchesTags = (restaurant.tags || []).some((tag) => tag.toLowerCase().includes(query))
        if (!matchesName && !matchesCuisine && !matchesTags) return false
      }

      // Cuisine filter
      if (selectedCuisines.length > 0) {
        const rc = (restaurant.cuisine || "").trim().toLowerCase()
        const selectedSet = new Set(selectedCuisines.map((c) => c.trim().toLowerCase()))
        if (!selectedSet.has(rc)) return false
      }

      // Price range filter
      if (selectedPriceRanges.length > 0 && !selectedPriceRanges.includes(restaurant.priceRange || "")) {
        return false
      }

      // Delivery time filter
      if (restaurant.deliveryTime) {
        const maxTime = Number.parseInt(restaurant.deliveryTime.split("-")[1])
        if (maxTime > maxDeliveryTime) return false
      }

      // Rating filter
      if ((restaurant.rating || 0) < minRating) return false

      return true
    })

    // Sort restaurants
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "delivery-time":
          if (a.deliveryTime && b.deliveryTime) {
            const aTime = Number.parseInt(a.deliveryTime.split("-")[0])
            const bTime = Number.parseInt(b.deliveryTime.split("-")[0])
            return aTime - bTime
          }
          return 0
        case "distance":
          return (a.distance || 0) - (b.distance || 0)
        case "recommended":
        default:
          // Featured first, then by rating
          if ((a.featured && !b.featured) || (!a.featured && b.featured)) {
            return a.featured ? -1 : 1
          }
          return (b.rating || 0) - (a.rating || 0)
      }
    })

    return filtered
  }, [searchQuery, selectedCuisines, selectedPriceRanges, maxDeliveryTime, minRating, sortBy, restaurants])

  return (
    <div className="min-h-screen bg-white">
      {/* <RestaurantRiderNavbar/> */}
      <Header />
      {/* Banner Section */}
      <div className="relative w-full flex items-center justify-center h-[89vh] bg-gradient-to-r from-orange-100 to-orange-200 py-22">
        <img src="/boo.png" alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <img src="/lines.svg" alt="Lines" className="mx-auto mb-2 w-80 h-auto" />
          <h1 className="text-[48px] font-bold mb-4 text-white text-center font-fredoka-one drop-shadow-lg">Restaurant</h1>
          <p className="font-ubuntu text-white mb-6 text-[18px]">Connect. Grow. It’s time to bring your dishes to more tables</p>
          <div className="w-full max-w-2xl mx-auto">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search restaurants, cuisines, or dishes..."
            />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <RestaurantFilters
              selectedCuisines={selectedCuisines}
              onCuisinesChange={setSelectedCuisines}
              selectedPriceRanges={selectedPriceRanges}
              onPriceRangesChange={setSelectedPriceRanges}
              maxDeliveryTime={maxDeliveryTime}
              onMaxDeliveryTimeChange={setMaxDeliveryTime}
              minRating={minRating}
              onMinRatingChange={setMinRating}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex items-center max-sm:flex-col max-sm:items-start max-sm:gap-4 justify-between mb-6">
              <div className="flex max-sm:flex-col max-sm:items-start items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden max-sm:w-[100%]">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <p className="text-foreground"><span className="text-secondary">({filteredAndSortedRestaurants.length})</span> restaurants found</p>
              </div>

              <div className="flex items-center  gap-2">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 border border-secondary bg-white rounded-md  text-foreground text-sm"
                >
                  <option value="recommended">Recommended</option>
                  <option value="rating">Highest Rated</option>
                  <option value="delivery-time">Fastest Delivery</option>
                  <option value="distance">Closest</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex max-sm:hidden border border-secondary bg-white rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none bg-secondary text-white hover:bg-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none bg-transparent text-black"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Restaurant Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
                <p className="mt-4 text-muted-foreground">Loading restaurants...</p>
              </div>
            ) : (
              <RestaurantGrid restaurants={filteredAndSortedRestaurants} viewMode={viewMode} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
