"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Upload, X } from "lucide-react"

interface AddMenuItemModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddMenuItemModal({ isOpen, onClose }: AddMenuItemModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    restaurant: "",
    stock: "",
    lowStockThreshold: "",
    preparationTime: "",
    calories: "",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
  })

  const [ingredients, setIngredients] = useState<string[]>([])
  const [allergens, setAllergens] = useState<string[]>([])
  const [newIngredient, setNewIngredient] = useState("")
  const [newAllergen, setNewAllergen] = useState("")

  const categories = ["Main Course", "Soup", "Side Dish", "Appetizer", "Dessert", "Beverage"]
  const restaurants = ["African Delights", "Udupi Kitchen", "Spice Garden", "Curry House", "Jollof Palace"]
  const commonAllergens = ["Gluten", "Dairy", "Eggs", "Fish", "Shellfish", "Nuts", "Peanuts", "Soy"]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()])
      setNewIngredient("")
    }
  }

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient))
  }

  const addAllergen = () => {
    if (newAllergen.trim() && !allergens.includes(newAllergen.trim())) {
      setAllergens([...allergens, newAllergen.trim()])
      setNewAllergen("")
    }
  }

  const removeAllergen = (allergen: string) => {
    setAllergens(allergens.filter((a) => a !== allergen))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Adding new menu item:", { ...formData, ingredients, allergens })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-orange-800">Add New Menu Item</DialogTitle>
          <DialogDescription className="text-amber-600">
            Create a new menu item with all the necessary details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card className="">
              <CardHeader>
                <CardTitle className="text-orange-800">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-amber-700">
                    Item Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Jollof Rice"
                    className=" focus:border-orange-400"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-amber-700">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe the dish..."
                    className=" focus:border-orange-400"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-amber-700">
                      Category
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className="">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="restaurant" className="text-amber-700">
                      Restaurant
                    </Label>
                    <Select
                      value={formData.restaurant}
                      onValueChange={(value) => handleInputChange("restaurant", value)}
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder="Select restaurant" />
                      </SelectTrigger>
                      <SelectContent>
                        {restaurants.map((restaurant) => (
                          <SelectItem key={restaurant} value={restaurant}>
                            {restaurant}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-amber-700">Item Image</Label>
                  <div className="border-2 border-dashed  rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <p className="text-sm text-amber-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-amber-500">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Inventory */}
            <Card className="">
              <CardHeader>
                <CardTitle className="text-orange-800">Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="price" className="text-amber-700">
                    Price (£)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                    className=" focus:border-orange-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stock" className="text-amber-700">
                      Initial Stock
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => handleInputChange("stock", e.target.value)}
                      placeholder="0"
                      className=" focus:border-orange-400"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="lowStockThreshold" className="text-amber-700">
                      Low Stock Alert
                    </Label>
                    <Input
                      id="lowStockThreshold"
                      type="number"
                      value={formData.lowStockThreshold}
                      onChange={(e) => handleInputChange("lowStockThreshold", e.target.value)}
                      placeholder="5"
                      className=" focus:border-orange-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preparationTime" className="text-amber-700">
                      Prep Time (min)
                    </Label>
                    <Input
                      id="preparationTime"
                      type="number"
                      value={formData.preparationTime}
                      onChange={(e) => handleInputChange("preparationTime", e.target.value)}
                      placeholder="30"
                      className=" focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="calories" className="text-amber-700">
                      Calories
                    </Label>
                    <Input
                      id="calories"
                      type="number"
                      value={formData.calories}
                      onChange={(e) => handleInputChange("calories", e.target.value)}
                      placeholder="350"
                      className=" focus:border-orange-400"
                    />
                  </div>
                </div>

                <Separator className="bg-orange-200" />

                <div className="space-y-3">
                  <Label className="text-amber-700">Dietary Options</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="vegetarian" className="text-sm text-amber-700">
                        Vegetarian
                      </Label>
                      <Switch
                        id="vegetarian"
                        checked={formData.isVegetarian}
                        onCheckedChange={(checked) => handleInputChange("isVegetarian", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="vegan" className="text-sm text-amber-700">
                        Vegan
                      </Label>
                      <Switch
                        id="vegan"
                        checked={formData.isVegan}
                        onCheckedChange={(checked) => handleInputChange("isVegan", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="glutenFree" className="text-sm text-amber-700">
                        Gluten Free
                      </Label>
                      <Switch
                        id="glutenFree"
                        checked={formData.isGlutenFree}
                        onCheckedChange={(checked) => handleInputChange("isGlutenFree", checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ingredients & Allergens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="">
              <CardHeader>
                <CardTitle className="text-orange-800">Ingredients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    placeholder="Add ingredient..."
                    className=" focus:border-orange-400"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addIngredient())}
                  />
                  <Button
                    type="button"
                    onClick={addIngredient}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient) => (
                    <Badge key={ingredient} variant="outline" className=" text-orange-700 pr-1">
                      {ingredient}
                      <button
                        type="button"
                        onClick={() => removeIngredient(ingredient)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="">
              <CardHeader>
                <CardTitle className="text-orange-800">Allergens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Select value={newAllergen} onValueChange={setNewAllergen}>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select allergen" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonAllergens.map((allergen) => (
                        <SelectItem key={allergen} value={allergen}>
                          {allergen}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={addAllergen} className="bg-orange-500 hover:bg-orange-600 text-white">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allergens.map((allergen) => (
                    <Badge key={allergen} variant="outline" className="border-red-200 text-red-700 pr-1">
                      {allergen}
                      <button
                        type="button"
                        onClick={() => removeAllergen(allergen)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t ">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className=" text-orange-700 hover:bg-orange-50 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
              Add Menu Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
