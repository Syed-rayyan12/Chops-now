"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Store, MapPin, StoreIcon } from "lucide-react"
import { API_CONFIG } from "@/lib/api/config"
import { useToast } from "@/hooks/use-toast"
import { getCurrentPosition, getAddressFromCoords } from "@/lib/utils/location"
import { OTPModal } from "@/components/otp-modal"

export default function RestaurantSetupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [gpsCoords, setGpsCoords] = useState<{ latitude: number; longitude: number } | null>(null)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [formData, setFormData] = useState({
    restaurantName: "",
    phone: "",
    address: "",
    cuisineType: "",
    description: "",
  })

  useEffect(() => {
    // Get email from localStorage or callback will have set it
    const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('restaurantEmail')
    if (userEmail) {
      setEmail(userEmail)
      
      // Check if this is a new Google signup that needs OTP verification
      const requiresOTP = localStorage.getItem('requiresOTPVerification')
      if (requiresOTP === 'true') {
        setShowOTPModal(true)
        localStorage.removeItem('requiresOTPVerification') // Clear flag after showing modal
      } else {
        // If no OTP required (Google OAuth), mark as verified
        setIsEmailVerified(true)
      }
    }
    // Don't redirect if no email - callback might still be setting it up
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
    
    // Check if email is verified
    if (!isEmailVerified) {
      toast({
        title: "Email Verification Required",
        description: "Please verify your email before completing your profile",
        variant: "destructive",
        duration: 3000,
      })
      setShowOTPModal(true)
      return
    }
    
    setLoading(true)

    try {
      const token = localStorage.getItem('restaurantToken') || localStorage.getItem('token')
      
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
        // Store restaurant data in localStorage
        if (data.restaurant) {
          localStorage.setItem('restaurantToken', token || '')
          localStorage.setItem('restaurantSlug', data.restaurant.slug)
          localStorage.setItem('restaurantData', JSON.stringify(data.restaurant))
        }

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

  const handleOTPVerified = () => {
    setShowOTPModal(false)
    setIsEmailVerified(true)
    toast({
      title: "Email Verified! ✓",
      description: "You can now complete your restaurant profile",
      duration: 3000,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={email}
        role="RESTAURANT"
        onVerified={handleOTPVerified}
      />
      
      <Card className="w-full max-w-2xl p-4 bg-white rounded-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <StoreIcon className="w-10 h-10 text-primary font-light" />
          </div>
          <CardTitle className="text-2xl text-[#000]">Complete Your Restaurant <span className="font-semibold text-secondary">Profile</span> </CardTitle>
          <p className="text-gray-500 mt-2">
            Welcome! Please provide your restaurant details to get started.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 mt-10">
            <div>
              <Label htmlFor="email" className="mb-4">Email (from Google)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="border border-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="restaurantName" className="mb-4">Restaurant Name *</Label>
              <Input
                id="restaurantName"
                name="restaurantName"
                placeholder="Enter your restaurant name"
                value={formData.restaurantName}
                onChange={handleChange}
                required
                className="border border-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="mb-4">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                  className="border border-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="address" className="mb-4">Restaurant Address *</Label>
              <div className="relative">
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter restaurant address or use GPS"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="border border-gray-300"
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
                    <MapPin className="h-5 w-5 text-gray-400 hover:text-primary text-secondary" />
                  )}
                </button>
              </div>
            </div>

            {/* <div>
              <Label htmlFor="cuisineType" className="mb-4">Cuisine Type</Label>
              <Input
                id="cuisineType"
                name="cuisineType"
                placeholder="e.g., Italian, Chinese, Indian"
                value={formData.cuisineType}
                onChange={handleChange}
                  className="border border-gray-300"
              />
            </div> */}

            <div>
              <Label htmlFor="description" className="mb-4">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Tell customers about your restaurant"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                  className="border border-gray-300"
              />
            </div>

            <Button type="submit" className="w-full bg-secondary rounded-md cursor-pointer" disabled={loading}>
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
