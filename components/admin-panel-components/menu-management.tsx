"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  Upload,
} from "lucide-react"
import { AddMenuItemModal } from "./add-menu-item-modal"
import { MenuItemDetailsModal } from "./menu-item-details-modal"


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

const menuItems: MenuItem[] = [
  {
    id: "MENU-001",
    name: "Jollof Rice",
    description: "Traditional West African rice dish cooked with tomatoes, onions, and spices",
    price: 12.5,
    category: "Main Course",
    restaurant: "African Delights",
    image: "/jollof-rice.png",
    status: "available",
    stock: 45,
    lowStockThreshold: 10,
    ingredients: ["Rice", "Tomatoes", "Onions", "Bell Peppers", "Spices"],
    allergens: [],
    preparationTime: 25,
    calories: 380,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    popularity: 95,
    lastUpdated: "2024-01-14",
  },
  {
    id: "MENU-002",
    name: "Egusi Soup",
    description: "Rich Nigerian soup made with ground melon seeds and leafy vegetables",
    price: 15.0,
    category: "Soup",
    restaurant: "Udupi Kitchen",
    image: "/egusi-soup.png",
    status: "available",
    stock: 32,
    lowStockThreshold: 8,
    ingredients: ["Melon Seeds", "Spinach", "Palm Oil", "Meat", "Fish"],
    allergens: ["Fish"],
    preparationTime: 45,
    calories: 420,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    popularity: 88,
    lastUpdated: "2024-01-14",
  },
  {
    id: "MENU-003",
    name: "Pepper Soup",
    description: "Spicy Nigerian soup with aromatic herbs and tender meat",
    price: 13.75,
    category: "Soup",
    restaurant: "Spice Garden",
    image: "/pepper-soup.png",
    status: "available",
    stock: 28,
    lowStockThreshold: 5,
    ingredients: ["Goat Meat", "Pepper", "Ginger", "Garlic", "Local Spices"],
    allergens: [],
    preparationTime: 35,
    calories: 320,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    popularity: 82,
    lastUpdated: "2024-01-13",
  },
  {
    id: "MENU-004",
    name: "Okra Soup",
    description: "Traditional soup with okra, meat, and seafood in palm oil base",
    price: 14.25,
    category: "Soup",
    restaurant: "African Delights",
    image: "/okra-soup.png",
    status: "out-of-stock",
    stock: 0,
    lowStockThreshold: 6,
    ingredients: ["Okra", "Palm Oil", "Meat", "Fish", "Crayfish"],
    allergens: ["Fish", "Shellfish"],
    preparationTime: 40,
    calories: 390,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    popularity: 75,
    lastUpdated: "2024-01-12",
  },
  {
    id: "MENU-005",
    name: "Plantain",
    description: "Sweet fried plantain slices, perfectly caramelized",
    price: 6.5,
    category: "Side Dish",
    restaurant: "Curry House",
    image: "/plantain.png",
    status: "available",
    stock: 60,
    lowStockThreshold: 15,
    ingredients: ["Plantain", "Palm Oil"],
    allergens: [],
    preparationTime: 15,
    calories: 180,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    popularity: 90,
    lastUpdated: "2024-01-14",
  },
  {
    id: "MENU-006",
    name: "Curry Rice",
    description: "Fragrant basmati rice cooked with aromatic curry spices",
    price: 11.0,
    category: "Main Course",
    restaurant: "Curry House",
    image: "/curry-rice.png",
    status: "available",
    stock: 38,
    lowStockThreshold: 12,
    ingredients: ["Basmati Rice", "Curry Powder", "Onions", "Garlic", "Coconut Milk"],
    allergens: [],
    preparationTime: 30,
    calories: 350,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    popularity: 78,
    lastUpdated: "2024-01-13",
  },
  {
    id: "MENU-007",
    name: "Grilled Chicken",
    description: "Tender chicken marinated in African spices and grilled to perfection",
    price: 16.5,
    category: "Main Course",
    restaurant: "Jollof Palace",
    image: "/grilled-chicken.png",
    status: "available",
    stock: 25,
    lowStockThreshold: 8,
    ingredients: ["Chicken", "Spices", "Lemon", "Garlic", "Ginger"],
    allergens: [],
    preparationTime: 35,
    calories: 450,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    popularity: 92,
    lastUpdated: "2024-01-14",
  },
  {
    id: "MENU-008",
    name: "Samosa",
    description: "Crispy pastry filled with spiced vegetables and served hot",
    price: 4.75,
    category: "Appetizer",
    restaurant: "Curry House",
    image: "/samosa.png",
    status: "unavailable",
    stock: 18,
    lowStockThreshold: 10,
    ingredients: ["Pastry", "Potatoes", "Peas", "Spices", "Oil"],
    allergens: ["Gluten"],
    preparationTime: 20,
    calories: 150,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    popularity: 85,
    lastUpdated: "2024-01-11",
  },
]

const categories = ["All", "Main Course", "Soup", "Side Dish", "Appetizer", "Dessert", "Beverage"]
const restaurants = ["All", "African Delights", "Udupi Kitchen", "Spice Garden", "Curry House", "Jollof Palace"]

export function MenuManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedRestaurant, setSelectedRestaurant] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

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

  const getStockStatus = (item: MenuItem) => {
    if (item.stock === 0) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />
    } else if (item.stock <= item.lowStockThreshold) {
      return <AlertTriangle className="w-4 h-4 text-amber-500" />
    } else {
      return <CheckCircle className="w-4 h-4 text-green-500" />
    }
  }

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesRestaurant = selectedRestaurant === "All" || item.restaurant === selectedRestaurant
    const matchesStatus = selectedStatus === "All" || item.status === selectedStatus

    return matchesSearch && matchesCategory && matchesRestaurant && matchesStatus
  })

  const lowStockItems = menuItems.filter((item) => item.stock <= item.lowStockThreshold && item.stock > 0)
  const outOfStockItems = menuItems.filter((item) => item.stock === 0)

  const handleViewDetails = (item: MenuItem) => {
    setSelectedMenuItem(item)
    setIsDetailsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600">Total Items</p>
                <p className="text-2xl font-bold text-orange-800">{menuItems.length}</p>
              </div>
              <Package className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600">Available</p>
                <p className="text-2xl font-bold text-green-600">
                  {menuItems.filter((item) => item.status === "available").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600">Low Stock</p>
                <p className="text-2xl font-bold text-amber-600">{lowStockItems.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockItems.length}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="menu" className="space-y-6">
        <TabsList className="bg-amber-50">
          <TabsTrigger value="menu" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800">
            Menu Items
          </TabsTrigger>
          <TabsTrigger
            value="inventory"
            className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"
          >
            Inventory
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"
          >
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="menu" className="space-y-6">
          {/* Filters and Actions */}
          <Card className="">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 w-4 h-4" />
                    <Input
                      placeholder="Search menu items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10  focus:border-orange-400"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48 ">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedRestaurant} onValueChange={setSelectedRestaurant}>
                    <SelectTrigger className="w-48 ">
                      <SelectValue placeholder="Restaurant" />
                    </SelectTrigger>
                    <SelectContent>
                      {restaurants.map((restaurant) => (
                        <SelectItem key={restaurant} value={restaurant}>
                          {restaurant}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-48 ">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className=" text-orange-700 hover:bg-orange-50 bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    className=" text-orange-700 hover:bg-orange-50 bg-transparent"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Menu Items Table */}
          <Card className="">
            <CardHeader>
              <CardTitle className="text-orange-800">Menu Items ({filteredItems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Popularity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-orange-800">{item.name}</p>
                            <p className="text-sm text-amber-600 truncate max-w-xs">{item.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className=" text-orange-700">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-amber-700">{item.restaurant}</TableCell>
                      <TableCell className="font-medium text-orange-800">£{item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStockStatus(item)}
                          <span className="text-amber-700">{item.stock}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-amber-100 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${item.popularity}%` }} />
                          </div>
                          <span className="text-sm text-amber-600">{item.popularity}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(item)}>
                              <Edit className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Item
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Item
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Low Stock Alert */}
            <Card className="">
              <CardHeader>
                <CardTitle className="flex items-center text-amber-800">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Low Stock Alert ({lowStockItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-amber-800">{item.name}</p>
                          <p className="text-sm text-amber-600">{item.restaurant}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-800">{item.stock} left</p>
                        <p className="text-xs text-amber-600">Threshold: {item.lowStockThreshold}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Out of Stock */}
            <Card className="">
              <CardHeader>
                <CardTitle className="flex items-center text-red-800">
                  <XCircle className="w-5 h-5 mr-2" />
                  Out of Stock ({outOfStockItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {outOfStockItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-red-800">{item.name}</p>
                          <p className="text-sm text-red-600">{item.restaurant}</p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                        Restock
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card className="">
            <CardHeader>
              <CardTitle className="text-orange-800">Menu Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.slice(1).map((category) => {
                  const itemCount = menuItems.filter((item) => item.category === category).length
                  return (
                    <div key={category} className="p-4 bg-amber-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-orange-800">{category}</h3>
                          <p className="text-sm text-amber-600">{itemCount} items</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddMenuItemModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {selectedMenuItem && (
        <MenuItemDetailsModal
          item={selectedMenuItem}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  )
}
