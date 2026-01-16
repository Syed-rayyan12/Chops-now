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
import { User, MapPin, Clock, Edit2, Loader2, DollarSign, Package, Upload, X } from "lucide-react"
import { Header } from "@/components/customer-panel-components/header"
import { Footer } from "@/components/customer-panel-components/footer"
import { getUserProfile, updateUserProfile, getUserAddresses, getUserOrders } from "@/lib/api/user.api"
import { toast } from "@/components/ui/use-toast"
import { Ubuntu } from "next/font/google"

type EditForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  image?: string | null
}

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useState<HTMLInputElement | null>(null)[1]
  const [editForm, setEditForm] = useState<EditForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    image: null,
  })

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    setIsLoading(true)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""
      if (!token) {
        router.push("/user-signIn")
        return
      }

      const [profileData, addressesData, ordersData] = await Promise.all([
        getUserProfile(),
        getUserAddresses(),
        getUserOrders(),
      ])

      setUser(profileData)
      setAddresses(addressesData)
      setOrders(ordersData)
      setImagePreview(profileData.image || null)
      
      setEditForm({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
        image: profileData.image || null,
      })
    } catch (error: any) {
      console.error("Failed to load profile:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load profile data",
        variant: "destructive",
      })
      if (error.message.includes("authentication")) {
        router.push("/user-signIn")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size must be less than 5MB",
          variant: "destructive",
        })
        return
      }
      
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 800
          const MAX_HEIGHT = 800
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7)
          setImagePreview(compressedBase64)
          setEditForm({ ...editForm, image: compressedBase64 })
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setEditForm({ ...editForm, image: null })
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const updatedUser = await updateUserProfile(editForm)
      setUser(updatedUser)
      setIsEditing(false)
      // sync email in local storage so other places (fallback) are up to date
      if (updatedUser?.email) {
        localStorage.setItem("userEmail", updatedUser.email)
      }
      // notify header to refresh
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('profile-updated'))
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

  // Sign out is handled from the header dropdown; no sign-out button on profile page

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#FF6B35]" />
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className={`${ubuntu.className} min-h-screen bg-[#FAFAFA]`}>
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#FF6B35] rounded-full flex items-center justify-center overflow-hidden">
                {imagePreview || user.image ? (
                  <img src={imagePreview || user.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-3xl text-[#2D2D2D]">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            {/* Sign out button removed; use header dropdown logout */}
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
                value="addresses"
                className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white "
              >
                Addresses
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
                  {/* Profile Image Upload */}
                  <div className="space-y-3">
                    <Label className="text-gray-700">Profile Picture</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200">
                        {imagePreview || user.image ? (
                          <img src={imagePreview || user.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <div className="flex gap-2">
                        {isEditing && (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const input = document.createElement('input')
                                input.type = 'file'
                                input.accept = 'image/*'
                                input.onchange = handleImageChange as any
                                input.click()
                              }}
                              className="border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Upload
                            </Button>
                            {(imagePreview || user.image) && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleRemoveImage}
                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Remove
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <p className="text-xs text-gray-500">Recommended: Square image, max 5MB</p>
                    )}
                  </div>

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
                  <div>
                    <Label htmlFor="address" className="text-gray-700 mb-2">Address</Label>
                    <Input
                      id="address"
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      disabled={!isEditing}
                      className="border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                      placeholder="Enter your delivery address"
                    />
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Member since {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <Card className="border-gray-200 bg-white p-4 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#2D2D2D]">Saved Addresses</CardTitle>
                </CardHeader>
                <CardContent>
                  {addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No addresses saved yet</p>
                      <p className="text-sm text-gray-500">Add addresses for faster checkout</p>
                    </div>
                  ) : (
                    <div className="space-y-6 pt-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-[#FF6B35] transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-[#FF6B35] mt-0.5" />
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-[#2D2D2D]">{address.label}</span>
                                {address.isDefault && (
                                  <Badge className="bg-[#FF6B35] text-white">Default</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{address.address}</p>
                              {/* {address.details && (
                                <p className="text-xs text-gray-500 mt-1">{address.details}</p>
                              )} */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card className="border-gray-200 p-4 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-[#2D2D2D]">Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No orders yet</p>
                      <Button asChild className="bg-[#FF6B35] hover:bg-[#FF5722] text-white">
                        <Link href="/restaurants">Start Ordering</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6 pt-4">
                      {orders.map((order) => (
                        <div key={order.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#FF6B35] transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-semibold text-[#2D2D2D]">Order ID: {order.orderId || order.code}</p>
                              <p className="text-sm text-gray-600">From {order.restaurant?.name || "Restaurant"}</p>
                            </div>
                            <div className="text-right">
                              <Badge 
                                className={
                                  order.status === "DELIVERED" 
                                    ? "bg-green-500 text-white" 
                                    : order.status === "PENDING" 
                                    ? "bg-yellow-500 text-white"
                                    : "bg-[#FF6B35] text-white"
                                }
                              >
                                {order.status}
                              </Badge>
                              <p className="text-sm font-semibold text-[#2D2D2D] mt-1">
                                £{Number(order.totalAmount || order.amount || 0).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          {order.deliveryAddress && (
                            <div className="text-sm text-gray-600 mb-3 flex items-start gap-2">
                              <MapPin className="w-4 h-4 mt-0.5 text-[#FF6B35]" />
                              <span>{order.deliveryAddress}</span>
                            </div>
                          )}

                          <div className="text-sm text-gray-600 mb-3">
                            {order.items?.length || 0} items • {new Date(order.createdAt).toLocaleDateString()}
                          </div>

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
        <DialogContent className="max-w-2xl w-[90%] p-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#2D2D2D] text-xl">Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="flex items-start justify-between pb-4 border-b">
                <div>
                  <h3 className="text-lg font-semibold text-[#2D2D2D]">Order ID: {selectedOrder.orderId || selectedOrder.code}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    From {selectedOrder.restaurant?.name || "Restaurant"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge
                  className={
                    selectedOrder.status === "DELIVERED"
                      ? "bg-green-500 text-white"
                      : selectedOrder.status === "PENDING"
                      ? "bg-yellow-500 text-white"
                      : "bg-[#FF6B35] text-white"
                  }
                >
                  {selectedOrder.status}
                </Badge>
              </div>

              {/* Delivery Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-[#2D2D2D] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#FF6B35]" />
                  Delivery Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Restaurant Address</p>
                    <p className="text-[#2D2D2D] font-medium">
                      {selectedOrder.restaurant?.address || "N/A"}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-sm text-gray-500">Delivery Address</p>
                    <p className="text-[#2D2D2D] font-medium">{selectedOrder.deliveryAddress || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h4 className="font-semibold text-[#2D2D2D] flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#FF6B35]" />
                  Order Items
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-[#2D2D2D]">{item.title}</p>
                        <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                      </div>
                      <p className="font-medium text-[#2D2D2D]">
                        £{Number(item.total || 0).toFixed(2)}
                      </p>
                    </div>
                  ))}
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
                        £{Number(selectedOrder.totalAmount || selectedOrder.amount || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
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

      <Footer />
    </div>
  )
}
