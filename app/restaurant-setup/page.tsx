"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Store, MapPin } from "lucide-react"
import { API_CONFIG } from "@/lib/api/config"
import { useToast } from "@/hooks/use-toast"
import { getCurrentPosition, getAddressFromCoords } from "@/lib/utils/location"

export default function RestaurantSetupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [gpsCoords, setGpsCoords] = useState<{ latitude: number; longitude: number } | null>(null)
  const [formData, setFormData] = useState({
    restaurantName: "",
    phone: "",
    address: "",
    cuisineType: "",
    description: "",
  })

  useEffect(() => {
    // Get email from localStorage
    const userEmail = localStorage.getItem('userEmail')
    if (!userEmail) {
      router.push('/restaurant-signIn')
      return
    }
    setEmail(userEmail)
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAddressClick = async () => {
    if (isGettingLocation) return
    
    setIsGettingLocation(true)
    try {
      const coords = await getCurrentPosition()
      setGpsCoords(coords)
      
      const address = await getAddressFromCoords(coords.latitude, coords.longitude)
      setFormData({ ...formData, address })
      
      toast({
        title: "Location retrieved",
        description: "Address set from your current location",
        duration: 2000,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to get location",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsGettingLocation(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/restaurant/complete-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          restaurantName: formData.restaurantName,
          phone: formData.phone,
          address: formData.address,
          cuisineType: formData.cuisineType,
          description: formData.description,
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Restaurant profile completed successfully",
          duration: 2000,
        })
        
        setTimeout(() => {
          router.push('/restaurant-dashboard')
        }, 500)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to complete profile",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Setup error:', error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Store className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-2xl">Complete Your Restaurant Profile</CardTitle>
          <p className="text-gray-500 mt-2">
            Welcome! Please provide your restaurant details to get started.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email (from Google)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div>
              <Label htmlFor="restaurantName">Restaurant Name *</Label>
              <Input
                id="restaurantName"
                name="restaurantName"
                placeholder="Enter your restaurant name"
                value={formData.restaurantName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Restaurant Address *</Label>
              <div className="relative">
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter restaurant address or use GPS"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={handleAddressClick}
                  disabled={isGettingLocation}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                  title="Use current location"
                >
                  {isGettingLocation ? (
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  ) : (
                    <MapPin className="h-5 w-5 text-gray-400 hover:text-primary" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="cuisineType">Cuisine Type</Label>
              <Input
                id="cuisineType"
                name="cuisineType"
                placeholder="e.g., Italian, Chinese, Indian"
                value={formData.cuisineType}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Tell customers about your restaurant"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                'Complete Setup'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
