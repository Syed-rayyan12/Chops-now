"use client"

import { useState, useMemo } from "react"
import { Search, Star, Clock, MapPin, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const offers = [
  {
    id: 1,
    name: "Funzo",
    cuisine: ["Morrocan"],
    rating: 4.5,
    reviews: 324,
    deliveryTime: "25-35 min",
    priceRange: "$$",
    discount: "50% OFF",
    image: "/restaurant-1.jpeg",
    logo: "/res-2.jpeg",
  },
  {
    id: 2,
    name: "Bwibo",
    cuisine: ["nigerian", "Curry"],
    rating: 4.7,
    reviews: 567,
    deliveryTime: "30-40 min",
    priceRange: "$$$",
    discount: "Free Delivery",
    image: "/restaurant-2.jpeg",
    logo: "/res-2.jpeg",
  },
  {
    id: 3,
    name: "Mombasa",
    cuisine: ["Madagascar"],
    rating: 4.3,
    reviews: 892,
    deliveryTime: "20-30 min",
    priceRange: "$",
    discount: "30% OFF",
    image: "/restaurant-3.jpeg",
    logo: "/res-3.jpeg",
  },
  {
    id: 4,
    name: "Safari",
    cuisine: ["Egyption"],
    rating: 4.8,
    reviews: 234,
    deliveryTime: "35-45 min",
    priceRange: "$$$$",
    discount: "Buy 1 Get 1",
    image: "/restaurant-4.jpeg",
    logo: "/res-4.jpeg",
  },
  {
    id: 5,
    name: "Bogobiri House",
    cuisine: ["Namibia"],
    rating: 4.4,
    reviews: 445,
    deliveryTime: "15-25 min",
    priceRange: "$",
    discount: "25% OFF",
    image: "/restaurant-5.jpeg",
    logo: "/res-5.jpeg",
  },
  {
    id: 6,
    name: "Morrocan Place",
    cuisine: ["Morrocan"],
    rating: 4.6,
    reviews: 178,
    deliveryTime: "20-30 min",
    priceRange: "$$",
    discount: "Free Delivery",
    image: "/restaurant-6.jpeg",
    logo: "/res-4.jpeg",
  },
]

const filterOptions = ["All Offers", "Free Delivery", "Discount %", "New Restaurants"]
const sortOptions = ["Relevance", "Rating", "Delivery Time", "Discount"]

export function OffersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All Offers")
  const [sortBy, setSortBy] = useState("Relevance")
  const [nearbyOnly, setNearbyOnly] = useState(false)

  const filteredAndSortedOffers = useMemo(() => {
    const filtered = offers.filter((offer) => {
      // Search filter
      const matchesSearch =
        offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.cuisine.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))

      if (!matchesSearch) return false

      // Tab filter
      switch (activeFilter) {
        case "Free Delivery":
          return offer.discount === "Free Delivery"
        case "Discount %":
          return offer.discount.includes("%")
        case "New Restaurants":
          return offer.reviews < 300 // Assuming new restaurants have fewer reviews
        default:
          return true
      }
    })

    // Sort the filtered results
    switch (sortBy) {
      case "Rating":
        return filtered.sort((a, b) => b.rating - a.rating)
      case "Delivery Time":
        return filtered.sort((a, b) => {
          const aTime = Number.parseInt(a.deliveryTime.split("-")[0])
          const bTime = Number.parseInt(b.deliveryTime.split("-")[0])
          return aTime - bTime
        })
      case "Discount":
        return filtered.sort((a, b) => {
          const aDiscount = a.discount.includes("%") ? Number.parseInt(a.discount) : 0
          const bDiscount = b.discount.includes("%") ? Number.parseInt(b.discount) : 0
          return bDiscount - aDiscount
        })
      default:
        return filtered
    }
  }, [searchQuery, activeFilter, sortBy])

  return (
    <div className="min-h-screen bg-background px-4">
      {/* Sticky Header */}


      <div className="container mx-auto px-4 py-6">
        {/* Promotional Banner */}
        <div className="mb-8 rounded-lg relative p-6 text-center bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/pet.jpg')" }}>

          {/* Overlay */}
          <div className="absolute inset-0 bg-primary/50 rounded-lg"></div>

          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-2">Weekend Special Deals</h2>
            <p className="text-white">
              Get up to 50% off on your favorite restaurants this weekend!
            </p>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className=" p-4 rounded-xl">
          <div className=" flex  max-sm:flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
            {/* Filter Buttons */}
            <div className="flex flex-wrap max-sm:justify-center gap-2">
              {filterOptions.map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  className={activeFilter === filter ? "bg-primary border border-primary/50 hover:bg-primary/90 text-white cursor-pointer" : "border border-primary/50 text-primary cursor-pointer"}
                >
                  {filter}
                </Button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search restaurants or cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-96  border border-primary/50 bg-white max-sm:w-full"
              />
            </div>

            {/* Sort and Nearby Toggle */}
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="border-primary/50 border hover:bg-none bg-white text-foreground " asChild>
                  <Button className=" text-foregroung
                 border-primary/50 cursor-pointer" variant="outline" size="sm">
                    Sort by: {sortBy} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border-none">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem key={option} onClick={() => setSortBy(option)}>
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>



              {/* <Button
              variant={nearbyOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setNearbyOnly(!nearbyOnly)}
              className={nearbyOnly ? "bg-white hover:secondary/40 text-white" : ""}
            >
              <MapPin className="mr-2 h-4 w-4 text-white" />
              Nearby Only
            </Button> */}
            </div>


          </div>
        </div>
        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredAndSortedOffers.length} restaurant{filteredAndSortedOffers.length !== 1 ? "s" : ""}
            {activeFilter !== "All Offers" && ` with ${activeFilter.toLowerCase()}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedOffers.length > 0 ? (
            filteredAndSortedOffers.map((offer) => (
              <Card
                key={offer.id}
                className="group overflow-hidden border border-primary/50 bg-white transition-all duration-300  hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={offer.image || "/placeholder.svg"}
                    alt={offer.name}
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Discount Badge */}
                  <Badge className="absolute top-3 left-3 bg-primary  text-accent-foreground font-semibold">
                    {offer.discount}
                  </Badge>

                  {/* Restaurant Logo */}
                  <div className="absolute -bottom-6 left-4 h-12 w-12 rounded-full border-2 border-primary/50 bg-card p-1">
                    <img
                      src={offer.logo || "/placeholder.svg"}
                      alt={`${offer.name} logo`}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                </div>

                <CardContent className="pt-8 pb-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-lg text-foreground mb-1">{offer.name}</h3>
                    <div className="flex  flex-wrap gap-1 mb-2">
                      {offer.cuisine.map((type) => (
                        <span key={type} className="text-xs text-muted-foreground">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{offer.rating}</span>
                      <span>({offer.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{offer.deliveryTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-card-foreground">{offer.priceRange}</span>
                    <Button size="sm" className="bg-primary text-white cursor-pointer">
                      Order Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-muted-foreground mb-2">No restaurants found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {filteredAndSortedOffers.length > 0 && (
          <div className="mt-8 text-center">
            <Button variant="outline" size="lg" className="bg-primary text-white border-none cursor-pointer">
              Load More Offers
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

