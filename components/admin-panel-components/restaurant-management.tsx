"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader } from "@/components/ui/loader"
import { getAdminRestaurants } from "@/lib/api/admin.api"

import {
  Search,
  Filter,
  Plus,
  Eye,
  Star,
  MapPin,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { RestaurantDetailsModal } from "./restaurant-details-modal"
import { AddRestaurantModal } from "./add-restaurant-modal"

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    case "inactive":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="w-3 h-3 mr-1" />
          Inactive
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getInitials = (name: string) => {
  return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('')
}

export function RestaurantManagement() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(false)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRestaurants()
    }, 300) // 300ms delay for search

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch when filters change
  useEffect(() => {
    fetchRestaurants()
  }, [statusFilter, activeTab])

  const fetchRestaurants = async () => {
    try {
      setTableLoading(true)
      if (!searchTerm && statusFilter === "all" && activeTab === "all") {
        setLoading(true)
      }

      const status = activeTab !== "all" ? activeTab : (statusFilter !== "all" ? statusFilter : undefined)
      
      const data = await getAdminRestaurants({ 
        search: searchTerm || undefined, 
        status: status 
      })
      setRestaurants(data)
    } catch (error) {
      console.error("Failed to fetch restaurants:", error)
    } finally {
      setLoading(false)
      setTableLoading(false)
    }
  }

  const filteredRestaurants = restaurants

  const restaurantStats = {
    total: restaurants.length,
    active: restaurants.filter((r) => r.status === "active").length,
    pending: restaurants.filter((r) => r.status === "pending").length,
    inactive: restaurants.filter((r) => r.status === "inactive").length,
    totalRevenue: restaurants.reduce((sum, r) => sum + r.revenue, 0),
    avgRating: restaurants.reduce((sum, r) => sum + r.rating, 0) / restaurants.length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="">
        <div className="bg-secondary rounded-lg p-6 text-white w-full flex justify-between items-center">
          <div>
          <h1 className="text-2xl font-bold text-white">RESTAURANT MANAGEMENT</h1>
          <p className="text-white text-sm mt-2 font-ubuntu">Manage partner restaurants and their performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline"  className="border-white bg-transparent  rounded-lg text-white hover:bg-white hover:text-secondary cursor-pointer">
              <Download className="w-4 h-4 mr-2" />
              Export Orders
            </Button>
          </div>
        </div>
        {/* <div className="flex items-center space-x-3">
          <Button onClick={() => setShowAddModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Restaurant
          </Button>
        </div> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className=" rounded-lg bg-white">
          <CardContent className="p-4 flex gap-2 flex-col">
            <div className="text-2xl font-bold text-foreground">{restaurantStats.total}</div>
            <div className="text-sm text-primary">Total Restaurants</div>
          </CardContent>
        </Card>
        <Card className=" bg-white">
          <CardContent className="p-4 flex gap-2 flex-col">
            <div className="text-2xl font-bold text-foreground">{restaurantStats.active}</div>
            <div className="text-sm text-primary">Active</div>
          </CardContent>
        </Card>
        <Card className=" bg-white">
          <CardContent className="p-4 flex gap-2 flex-col">
            <div className="text-2xl font-bold text-foreground">{restaurantStats.pending}</div>
            <div className="text-sm text-primary">Pending</div>
          </CardContent>
        </Card>
        <Card className=" bg-white">
          <CardContent className="p-4 flex gap-2 flex-col">
            <div className="text-2xl font-bold text-foreground">{restaurantStats.inactive}</div>
            <div className="text-sm text-primary">Inactive</div>
          </CardContent>
        </Card>
        <Card className=" bg-white">
          <CardContent className="p-4 flex gap-2 flex-col">
            <div className="text-2xl font-bold text-foreground">£{restaurantStats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-primary">Total Revenue</div>
          </CardContent>
        </Card>
        <Card className=" bg-white">
          <CardContent className="p-4 flex gap-2 flex-col">
            <div className="text-2xl font-bold text-foreground">{restaurantStats.avgRating.toFixed(1)}</div>
            <div className="text-sm text-primary">Avg Rating</div>
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center max-md:flex-col gap-3 max-md:items-center max-md:gap-3">
              <div className="relative max-sm:w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 h-4 w-4" />
                <Input
                  placeholder="Search restaurants by name, address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 max-sm:w-full border-gray-400  bg-white"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 max-sm:w-full cursor-pointer bg-white ">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" className="" />
                </SelectTrigger>
                <SelectContent className="border  bg-white">
                  <SelectItem value="all"className="text-foreground" >All Status</SelectItem>
                  <SelectItem value="active"className="text-foreground" >Active</SelectItem>
                  <SelectItem value="pending" className="text-foreground">Pending</SelectItem>
                  <SelectItem value="inactive" className="text-foreground">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
      {/* Filters and Search */}
      <Card className=" bg-white">
        <CardHeader>
        
        </CardHeader>
        <CardContent className="w-full p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="gap-2 hidden overflow-x-auto lg:flex w-full text-white">
              <TabsTrigger
                value="all"
                className="text-gray-400 border border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary flex-1"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="text-gray-400 border border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary flex-1"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="text-gray-400 border border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary flex-1"
              >
                Pending
              </TabsTrigger>
              <TabsTrigger
                value="inactive"
                className="text-gray-400 border border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary flex-1"
              >
                Inactive
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow className="border border-gray-400 rounded-lg p-4">
                    <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Restaurant</TableHead>
                    <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Cuisine</TableHead>
                    <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Location</TableHead>
                    <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Rating</TableHead>
                    <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Orders</TableHead>
                    <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Revenue</TableHead>
                    <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Status</TableHead>
                    <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-64 text-center">
                        <div className="flex justify-center items-center">
                          <Loader size="lg" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredRestaurants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-64 text-center text-gray-400">
                        No restaurants found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRestaurants.map((restaurant) => (
                    <TableRow key={restaurant.id} className="border-orange-100 hover:bg-amber-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10 bg-secondary">
                            <AvatarFallback className="bg-secondary text-white">{getInitials(restaurant.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium font-ubuntu text-primary ">{restaurant.name}</div>
                            <div className="text-sm text-gray-400">{restaurant.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-primary border-none">
                          {restaurant.cuisine}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-amber-600">
                          <MapPin className="w-4 h-4 mr-1 text-secondary" />
                          <span className="text-sm text-gray-400">{restaurant.address.split(",")[0]}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-secondary mr-1" />
                          <span className="font-medium text-secondary">{restaurant.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-400">{restaurant.totalOrders}</TableCell>
                      <TableCell className="font-medium text-gray-400">
                        £{restaurant.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(restaurant.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRestaurant(restaurant)}
                            className="hover:bg-primary"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {/* <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-primary"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>Edit Details</DropdownMenuItem>
                              <DropdownMenuItem>View Menu</DropdownMenuItem>
                              <DropdownMenuItem>Contact Restaurant</DropdownMenuItem>
                              <DropdownMenuItem>Update Commission</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedRestaurant && (
        <RestaurantDetailsModal
          restaurant={selectedRestaurant}
          isOpen={!!selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
        />
      )}

      {showAddModal && <AddRestaurantModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
