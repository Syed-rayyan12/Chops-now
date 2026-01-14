"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Store, Edit2, Loader2, Upload, X } from "lucide-react"
import { Header } from "@/components/restaurant-panel-components/header"
import { getRestaurantProfile, updateRestaurantProfile } from "@/lib/api/restaurant.api";
import { toast } from "@/components/ui/use-toast"
import { Ubuntu } from "next/font/google"

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

type EditForm = {
  ownerFirstName: string
  ownerLastName: string
  phone: string
  image?: string | null
}

export default function RestaurantProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [restaurant, setRestaurant] = useState<any>(null)
  const [hasFetched, setHasFetched] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditForm>({
    ownerFirstName: "",
    ownerLastName: "",
    phone: "",
    image: null,
  })

  useEffect(() => {
    if (!hasFetched) {
      loadProfileData()
    }
  }, [hasFetched])

  const loadProfileData = async () => {
    if (hasFetched) return // Prevent duplicate calls
    
    setIsLoading(true)
    setHasFetched(true)
    
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("restaurantToken") : ""
      if (!token) {
        router.push("/restaurant-signIn")
        return
      }

      // Show loader for 2 seconds on initial load
      if (initialLoad) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }

      const profileData = await getRestaurantProfile()
      setRestaurant(profileData)
      setImagePreview(profileData.image || null)
      
      setEditForm({
        ownerFirstName: profileData.ownerFirstName || "",
        ownerLastName: profileData.ownerLastName || "",
        phone: profileData.phone || "",
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
        router.push("/restaurant-signIn")
      }
    } finally {
      setIsLoading(false)
      setInitialLoad(false)
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
      const updatedRestaurant = await updateRestaurantProfile(editForm)
      setRestaurant(updatedRestaurant)
      setIsEditing(false)
      
      // Sync email in local storage if it changed
      if (updatedRestaurant?.ownerEmail) {
        localStorage.setItem("restaurantEmail", updatedRestaurant.ownerEmail)
      }
      
      // Notify header to refresh
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('restaurant-profile-updated'))
      }
      
      toast({
        title: "Success",
        description: "Restaurant profile updated successfully",
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

  if (initialLoad) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-secondary"></div>
            <p className="mt-4 text-lg font-medium text-secondary">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!restaurant) {
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
                {imagePreview || restaurant.image ? (
                  <img src={imagePreview || restaurant.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-3xl text-[#2D2D2D] font-bold">
                  {restaurant.name}
                </h1>
                <p className="text-gray-600">{restaurant.ownerEmail}</p>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <Card className="border-gray-200 p-4 bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[#2D2D2D]">Owner Information</CardTitle>
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
                    onClick={() => setIsEditing(false)}
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
                <Label className="text-gray-700">Restaurant Profile Picture</Label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200">
                    {imagePreview || restaurant.image ? (
                      <img src={imagePreview || restaurant.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Store className="w-12 h-12 text-gray-400" />
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
                        {(imagePreview || restaurant.image) && (
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
                  <Label htmlFor="ownerFirstName" className="text-gray-700 mb-2">First Name</Label>
                  <Input
                    id="ownerFirstName"
                    value={editForm.ownerFirstName}
                    onChange={(e) => setEditForm({ ...editForm, ownerFirstName: e.target.value })}
                    disabled={!isEditing}
                    className="border-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                  />
                </div>
                <div>
                  <Label htmlFor="ownerLastName" className="text-gray-700 mb-2">Last Name</Label>
                  <Input
                    id="ownerLastName"
                    value={editForm.ownerLastName}
                    onChange={(e) => setEditForm({ ...editForm, ownerLastName: e.target.value })}
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
                  value={restaurant.ownerEmail}
                  disabled
                  className="border-gray-300 bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
