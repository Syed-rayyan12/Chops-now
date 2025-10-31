"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, MapPin, Clock, Edit2, Loader2, Package, DollarSign, Navigation, Phone as PhoneIcon, X } from "lucide-react"
import { STORAGE_KEYS, API_CONFIG } from "@/lib/api/config"
import { toast } from "@/components/ui/use-toast"

type EditForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  vehicle: string
  accountNumber: string
  sortCode: string
}

export default function RiderProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [rider, setRider] = useState<any>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState<EditForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    vehicle: "",
    accountNumber: "",
    sortCode: "",
  })

  useEffect(() => {
    loadProfileData()
    loadRecentOrders()
  }, [])

  const loadProfileData = async () => {
    setIsLoading(true)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.RIDER_TOKEN) || localStorage.getItem("riderToken") : ""
      if (!token) {
        router.push("/rider-signIn")
        return
      }

      const profileRes = await fetch(`${API_CONFIG.BASE_URL}/rider/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!profileRes.ok) throw new Error("Failed to fetch profile")

      const profileData = await profileRes.json()

      setRider(profileData.rider)

      setEditForm({
        firstName: profileData.rider.firstName || "",
        lastName: profileData.rider.lastName || "",
        email: profileData.rider.email || "",
        phone: profileData.rider.phone || "",
        address: profileData.rider.address || "",
        vehicle: profileData.rider.vehicle || "",
        accountNumber: profileData.rider.accountNumber || "",
        sortCode: profileData.rider.sortCode || "",
      })
    } catch (error: any) {
      console.error("Failed to load profile:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load profile data",
        variant: "destructive",
      })
      if (error.message.includes("authentication")) {
        router.push("/rider-signIn")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const loadRecentOrders = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.RIDER_TOKEN) || localStorage.getItem("riderToken") : ""
      if (!token) return

      const response = await fetch(`${API_CONFIG.BASE_URL}/rider/orders/completed`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) throw new Error("Failed to fetch orders")

      const data = await response.json()
      setRecentOrders(data.orders || [])
    } catch (error: any) {
      console.error("Failed to load orders:", error)
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.RIDER_TOKEN) || localStorage.getItem("riderToken") : ""
      if (!token) throw new Error("Not authenticated")

      const response = await fetch(`${API_CONFIG.BASE_URL}/rider/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      })

      if (!response.ok) throw new Error("Failed to update profile")

      const updatedRider = await response.json()
      setRider(updatedRider.rider)
      setIsEditing(false)

      // Update localStorage
      if (updatedRider?.rider?.email) {
        localStorage.setItem("riderEmail", updatedRider.rider.email)
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header Skeleton */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="flex space-x-1 bg-white border rounded-lg border-gray-200 p-1 mb-6">
              <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>

            {/* Content Skeleton */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>

                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>

                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!rider) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#FF6B35] rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl text-[#2D2D2D]">
                  {rider.firstName} {rider.lastName}
                </h1>
                <p className="text-gray-600">{rider.email}</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white border rounded-lg border-gray-200">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white "
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="address"
                className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white "
              >
                Address
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white "
              >
                Orders
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="border-gray-200 p-4 bg-white shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-[#2D2D2D]">Personal Information</CardTitle>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditing(false)
                        }}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="bg-[#FF6B35] hover:bg-[#FF5722] text-white"
                      >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-gray-700 mb-2">First Name</Label>
                      <Input
                        id="firstName"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        disabled={!isEditing}
                        className="border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-gray-700 mb-2">Last Name</Label>
                      <Input
                        id="lastName"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        disabled={!isEditing}
                        className="border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-700 mb-2">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      disabled={!isEditing}
                      className="border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 mb-2">Phone Number</Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      disabled={!isEditing}
                      className="border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                    />
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Member since {new Date(rider.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address">
              <Card className="border-gray-200 p-4 bg-white shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-[#2D2D2D]">Address & Vehicle Information</CardTitle>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditing(false)
                        }}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="bg-[#FF6B35] hover:bg-[#FF5722] text-white"
                      >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div>
                    <Label htmlFor="address" className="text-gray-700 mb-2">Address</Label>
                    <Input
                      id="address"
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Enter your full address"
                      className="border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicle" className="text-gray-700 mb-2">Vehicle Information</Label>
                    <Input
                      id="vehicle"
                      value={editForm.vehicle}
                      onChange={(e) => setEditForm({ ...editForm, vehicle: e.target.value })}
                      disabled={!isEditing}
                      placeholder="e.g., Motorcycle, Bicycle, Car"
                      className="border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="accountNumber" className="text-gray-700 mb-2">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={editForm.accountNumber}
                        onChange={(e) => setEditForm({ ...editForm, accountNumber: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Bank account number"
                        className="border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sortCode" className="text-gray-700 mb-2">Sort Code</Label>
                      <Input
                        id="sortCode"
                        value={editForm.sortCode}
                        onChange={(e) => setEditForm({ ...editForm, sortCode: e.target.value })}
                        disabled={!isEditing}
                        placeholder="XX-XX-XX"
                        className="border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card className="border-gray-200 p-4 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-[#2D2D2D]">Recent Deliveries</CardTitle>
                  <p className="text-sm text-gray-600 mt-2">Your delivery history and completed orders</p>
                </CardHeader>
                <CardContent>
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No deliveries yet</p>
                      <p className="text-sm text-gray-500">Your delivery history will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-6 pt-4">
                      {recentOrders.map((order: any) => (
                        <div key={order.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#FF6B35] transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-semibold text-[#2D2D2D]">Order ID: {order.orderId || order.code}</p>
                              <p className="text-sm text-gray-600">
                                Delivered {order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : "Recently"}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge className="bg-green-500 text-white mb-2">
                                DELIVERED
                              </Badge>
                              <p className="text-sm font-semibold text-[#2D2D2D]">
                                £{Number(order.amount || 0).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <p className="text-gray-500">Distance</p>
                              <p className="text-[#2D2D2D] font-medium">
                                {order.distanceKm ? `${order.distanceKm} km` : "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Rider Payout</p>
                              <p className="text-[#2D2D2D] font-medium">
                                £{Number(order.riderPayout || 0).toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Delivery Fee</p>
                              <p className="text-[#2D2D2D] font-medium">
                                £{Number(order.deliveryFee || 0).toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Tip</p>
                              <p className="text-[#2D2D2D] font-medium">
                                £{Number(order.tip || 0).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          {order.deliveryAddress && (
                            <div className="text-sm text-gray-600 mb-3 flex items-start gap-2">
                              <MapPin className="w-4 h-4 mt-0.5 text-[#FF6B35]" />
                              <span>{order.deliveryAddress}</span>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order)
                                setShowOrderModal(true)
                              }}
                              className="border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Order Details Modal */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="max-w-3xl w-[90%] p-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#2D2D2D] text-xl">Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="flex items-start justify-between pb-4 border-b">
                <div>
                  <h3 className="text-lg font-semibold text-[#2D2D2D]">Order ID: {selectedOrder.orderId || selectedOrder.code}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.deliveredAt && `Delivered on ${new Date(selectedOrder.deliveredAt).toLocaleString()}`}
                  </p>
                </div>
                <Badge className="bg-green-500 text-white">DELIVERED</Badge>
              </div>

              {/* Delivery Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-[#2D2D2D] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#FF6B35]" />
                  Delivery Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Pickup Address (Restaurant)</p>
                    <p className="text-[#2D2D2D] font-medium">
                      {selectedOrder.restaurant?.address || "N/A"}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-sm text-gray-500">Delivery Address (Customer)</p>
                    <p className="text-[#2D2D2D] font-medium">{selectedOrder.deliveryAddress || "N/A"}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-sm text-gray-500">Distance</p>
                    <p className="text-[#2D2D2D] font-medium">
                      {selectedOrder.distanceKm ? `${selectedOrder.distanceKm} km` : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="space-y-4">
                <h4 className="font-semibold text-[#2D2D2D] flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#FF6B35]" />
                  Payment Breakdown
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-[#2D2D2D]">
                      £{Number(selectedOrder.subTotal || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium text-[#2D2D2D]">
                      £{Number(selectedOrder.deliveryFee || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tip</span>
                    <span className="font-medium text-[#2D2D2D]">
                      £{Number(selectedOrder.tip || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-[#2D2D2D]">Total Amount</span>
                      <span className="font-bold text-[#FF6B35] text-lg">
                        £{Number(selectedOrder.amount || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-green-600">Your Payout</span>
                      <span className="font-bold text-green-600 text-lg">
                        £{Number(selectedOrder.riderPayout || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h4 className="font-semibold text-[#2D2D2D] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#FF6B35]" />
                  Order Timeline
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-gray-400 mt-2"></div>
                    <div>
                      <p className="font-medium text-[#2D2D2D]">Order Placed</p>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {selectedOrder.assignedAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div>
                        <p className="font-medium text-[#2D2D2D]">Assigned to You</p>
                        <p className="text-sm text-gray-600">
                          {new Date(selectedOrder.assignedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.pickedUpAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                      <div>
                        <p className="font-medium text-[#2D2D2D]">Picked Up</p>
                        <p className="text-sm text-gray-600">
                          {new Date(selectedOrder.pickedUpAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.deliveredAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                      <div>
                        <p className="font-medium text-[#2D2D2D]">Delivered</p>
                        <p className="text-sm text-gray-600">
                          {new Date(selectedOrder.deliveredAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={() => setShowOrderModal(false)}
                  className="bg-[#FF6B35] hover:bg-[#FF5722] text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
