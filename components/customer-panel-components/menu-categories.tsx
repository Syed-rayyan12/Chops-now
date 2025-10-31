"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface MenuCategoriesProps {
  categories: { id: string; name: string; itemCount: number }[]
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
}

export function MenuCategories({ categories, selectedCategory, onCategoryChange }: MenuCategoriesProps) {
  return (
    <Card className="sticky top-24 shadow-[0_0_15px_rgba(0,0,0,0.2)] bg-white rounded-md">
      <CardContent className="p-4">
        <h2 className="font-fredoka-one font-semibold text-lg text-primary mb-4">Menu Categories</h2>
        <div className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "menuMain" : "menuMain2"}
              className="w-full justify-between cursor-pointer"
              onClick={() => onCategoryChange(category.id)}
            >
              <span className={selectedCategory === category.id ? "text-white text-sm tracking-wider" : "opacity/70"}>{category.name}</span>
              <span className={`text-xs ${selectedCategory === category.id ? "text-white" : "opacity/70"}`}>({category.itemCount})</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
