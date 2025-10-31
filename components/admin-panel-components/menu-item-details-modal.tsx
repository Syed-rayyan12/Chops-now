"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Clock,
  Flame,
  Leaf,
  ShieldCheck,
  Star,
  TrendingUp,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  restaurant: string
  image: string
  status: "available" | "unavailable" | "out-of-stock"
  stock: number
  lowStockThreshold: number
  ingredients: string[]
  allergens: string[]
  preparationTime: number
  calories: number
  isVegetarian: boolean
  isVegan: boolean
  isGlutenFree: boolean
  popularity: number
  lastUpdated: string
}

interface MenuItemDetailsModalProps {
  item: MenuItem
  isOpen: boolean
  onClose: () => void
}

export function MenuItemDetailsModal({ item, isOpen, onClose }: MenuItemDetailsModalProps) {
  const [currentStatus, setCurrentStatus] = useState(item.status)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "unavailable":
        return <XCircle className="w-5 h-5 text-amber-600" />
      case "out-of-stock":
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      default:
        return <Package className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>
      case "unavailable":
        return <Badge className="bg-amber-100 text-amber-800">Unavailable</Badge>
      case "out-of-stock":
        return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleStatusUpdate = (newStatus: string) => {
    setCurrentStatus(newStatus)
    console.log(`Updating item ${item.id} status to ${newStatus}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-orange-800">{item.name}</DialogTitle>
          <DialogDescription className="text-amber-600">
            Complete menu item details and management options
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-6">
          <TabsList className="grid w-full grid-cols-4 bg-amber-50">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              value="inventory"
              className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"
            >
              Inventory
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Item Information */}
              <Card className="">
                <CardHeader>
                  <CardTitle className="text-orange-800">Item Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-orange-800">{item.name}</h3>
                      <p className="text-sm text-amber-600 mb-2">{item.description}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className=" text-orange-700">
                          {item.category}
                        </Badge>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-orange-200" />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-amber-600">Price</p>
                      <p className="text-xl font-bold text-orange-800">£{item.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-amber-600">Restaurant</p>
                      <p className="font-medium text-orange-800">{item.restaurant}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-amber-700">{item.preparationTime} min</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-amber-700">{item.calories} cal</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {item.isVegetarian && (
                      <Badge className="bg-green-100 text-green-800">
                        <Leaf className="w-3 h-3 mr-1" />
                        Vegetarian
                      </Badge>
                    )}
                    {item.isVegan && (
                      <Badge className="bg-green-100 text-green-800">
                        <Leaf className="w-3 h-3 mr-1" />
                        Vegan
                      </Badge>
                    )}
                    {item.isGlutenFree && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Gluten Free
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Ingredients & Allergens */}
              <Card className="">
                <CardHeader>
                  <CardTitle className="text-orange-800">Ingredients & Allergens</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-amber-700 mb-2">Ingredients</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.ingredients.map((ingredient) => (
                        <Badge key={ingredient} variant="outline" className=" text-orange-700">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-orange-200" />

                  <div>
                    <h4 className="font-medium text-amber-700 mb-2">Allergens</h4>
                    {item.allergens.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {item.allergens.map((allergen) => (
                          <Badge key={allergen} variant="outline" className="border-red-200 text-red-700">
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-amber-600">No known allergens</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-amber-600">Current Stock</p>
                      <p className="text-2xl font-bold text-orange-800">{item.stock}</p>
                    </div>
                    <Package className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-amber-600">Low Stock Alert</p>
                      <p className="text-2xl font-bold text-amber-600">{item.lowStockThreshold}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-amber-600">Status</p>
                      <p className="text-lg font-bold text-orange-800 capitalize">{item.status.replace("-", " ")}</p>
                    </div>
                    {getStatusIcon(item.status)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="">
              <CardHeader>
                <CardTitle className="text-orange-800">Stock History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                    <span className="text-amber-700">Stock Replenished</span>
                    <div className="text-right">
                      <span className="font-medium text-orange-800">+50 units</span>
                      <p className="text-xs text-amber-600">Jan 14, 2024</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                    <span className="text-amber-700">Low Stock Alert Triggered</span>
                    <div className="text-right">
                      <span className="font-medium text-amber-600">8 units remaining</span>
                      <p className="text-xs text-amber-600">Jan 12, 2024</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-amber-600">Popularity</p>
                      <p className="text-2xl font-bold text-orange-800">{item.popularity}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-amber-600">Orders This Month</p>
                      <p className="text-2xl font-bold text-orange-800">127</p>
                    </div>
                    <Package className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-amber-600">Average Rating</p>
                      <p className="text-2xl font-bold text-orange-800">4.7</p>
                    </div>
                    <Star className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-800">
                  {getStatusIcon(currentStatus)}
                  <span className="ml-2">Item Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Select value={currentStatus} onValueChange={handleStatusUpdate}>
                    <SelectTrigger className="w-48 ">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">Update Status</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="">
              <CardHeader>
                <CardTitle className="text-orange-800">Item Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full  text-orange-700 hover:bg-orange-50 bg-transparent"
                >
                  Edit Item Details
                </Button>
                <Button
                  variant="outline"
                  className="w-full  text-orange-700 hover:bg-orange-50 bg-transparent"
                >
                  Update Stock Level
                </Button>
                <Button
                  variant="outline"
                  className="w-full  text-orange-700 hover:bg-orange-50 bg-transparent"
                >
                  Generate Item Report
                </Button>
                <Button variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-50 bg-transparent">
                  Delete Item
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t ">
          <Button
            variant="outline"
            onClick={onClose}
            className=" text-orange-700 hover:bg-orange-50 bg-transparent"
          >
            Close
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">Edit Item</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
