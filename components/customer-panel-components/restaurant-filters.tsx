"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface RestaurantFiltersProps {
  selectedCuisines: string[]
  onCuisinesChange: (cuisines: string[]) => void
  selectedPriceRanges: string[]
  onPriceRangesChange: (priceRanges: string[]) => void
  maxDeliveryTime: number
  onMaxDeliveryTimeChange: (time: number) => void
  minRating: number
  onMinRatingChange: (rating: number) => void
}

const cuisineOptions = [
  "West African",
  "Jamaican",
  "Trinidadian",
  "Haitian",
  "Barbadian",
  "Nigerian",
  "Ghanaian",
  "Cuban",
  "Puerto Rican",
  "Dominican",
  "Grenadian"
];


const priceRangeOptions = [
  { label: "£ (Under £15)", value: "£" },
  { label: "££ (£15-30)", value: "££" },
  { label: "£££ (£30+)", value: "£££" },
]

export function RestaurantFilters({
  selectedCuisines,
  onCuisinesChange,
  selectedPriceRanges,
  onPriceRangesChange,
  maxDeliveryTime,
  onMaxDeliveryTimeChange,
  minRating,
  onMinRatingChange,
}: RestaurantFiltersProps) {
  const handleCuisineChange = (cuisine: string, checked: boolean) => {
    if (checked) {
      onCuisinesChange([...selectedCuisines, cuisine])
    } else {
      onCuisinesChange(selectedCuisines.filter((c) => c !== cuisine))
    }
  }

  const handlePriceRangeChange = (priceRange: string, checked: boolean) => {
    if (checked) {
      onPriceRangesChange([...selectedPriceRanges, priceRange])
    } else {
      onPriceRangesChange(selectedPriceRanges.filter((p) => p !== priceRange))
    }
  }

  const clearAllFilters = () => {
    onCuisinesChange([])
    onPriceRangesChange([])
    onMaxDeliveryTimeChange(60)
    onMinRatingChange(0)
  }

  const hasActiveFilters =
    selectedCuisines.length > 0 || selectedPriceRanges.length > 0 || maxDeliveryTime < 60 || minRating > 0

  return (
    <div className="mt-1">
    <div className="flex flex-col ">
      {/* Filter Header */}
      <div className="flex items-start justify-between">
        <h2 className="font-fredoka-one font-semibold text-[22px] mb-7">Filters</h2>
        {hasActiveFilters && (
          <button onClick={clearAllFilters} className="text-sm bg-secondary text-white cursor-pointer transition-colors rounded-md p-2">
            Clear all
          </button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedCuisines.map((cuisine) => (
            <Badge
              key={cuisine}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleCuisineChange(cuisine, false)}
            >
              {cuisine} ×
            </Badge>
          ))}
          {selectedPriceRanges.map((price) => (
            <Badge
              key={price}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handlePriceRangeChange(price, false)}
            >
              {price} ×
            </Badge>
          ))}
        </div>
      )}

      {/* Cuisine Filter */}
      <Card className="border-primary/50 bg-white mb-4 shadow-[0_0_15px_rgba(0,0,0,0.2)] p-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-fredoka-one text-[18px]">Cuisine Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cuisineOptions.map((cuisine) => (
            <div key={cuisine} className="flex items-center space-x-2 ">
              <Checkbox
              className="border-secondary transition-all duration-300"
                id={cuisine}
                checked={selectedCuisines.includes(cuisine)}
                onCheckedChange={(checked) => handleCuisineChange(cuisine, checked as boolean)}
              />
              <label
                htmlFor={cuisine}
                className="text-sm font-ubuntu  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {cuisine}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card className="border-primary/50 bg-white mb-4 p-4 shadow-[0_0_15px_rgba(0,0,0,0.2)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-fredoka-one text-[18px]">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {priceRangeOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
               className="border-secondary"
                id={option.value}
                checked={selectedPriceRanges.includes(option.value)}
                onCheckedChange={(checked) => handlePriceRangeChange(option.value, checked as boolean)}
              />
              <label
                htmlFor={option.value}
                className="text-sm font-ubuntu leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option.label}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Delivery Time Filter */}
      {/* <Card className="border-secondary/70">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Max Delivery Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={[maxDeliveryTime]}
              onValueChange={(value) => onMaxDeliveryTimeChange(value[0])}
              max={60}
              min={15}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>15 min</span>
              <span className="font-medium text-foreground">{maxDeliveryTime} min</span>
              <span>60 min</span>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Rating Filter */}
      <Card className="border-primary/50 bg-white mb-4 p-4 shadow-[0_0_15px_rgba(0,0,0,0.2)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-fredoka-one text-[18px]">Minimum Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
            
              value={[minRating]}
              onValueChange={(value) => onMinRatingChange(value[0])}
              max={5}
              min={0}
              step={0.5}
              className="w-full border-primary/50"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Any</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-foreground">{minRating || "Any"}</span>
              </div>
              <span>5.0</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  )
}
