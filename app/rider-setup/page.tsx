"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Bike, MapPin } from "lucide-react"
import { API_CONFIG } from "@/lib/api/config"
import { useToast } from "@/hooks/use-toast"
import { getCurrentPosition, getAddressFromCoords } from "@/lib/utils/location"
import { OTPModal } from "@/components/otp-modal"

export default function RiderSetupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [gpsCoords, setGpsCoords] = useState<{ latitude: number; longitude: number } | null>(null)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    // Get email from localStorage or callback will have set it
    const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('riderEmail')
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const token = localStorage.getItem('riderToken') || localStorage.getItem('token')
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/rider/complete-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Store rider data in localStorage
        if (data.rider) {
          localStorage.setItem('riderToken', token || '')
          localStorage.setItem('riderEmail', data.rider.email)
          localStorage.setItem('riderData', JSON.stringify(data.rider))
        }

        toast({
          title: "Success!",
          description: "Rider profile completed successfully",
          duration: 2000,
        })
        
        setTimeout(() => {
          router.push('/rider-dashboard')
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
      description: "You can now complete your rider profile",
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
        role="RIDER"
        onVerified={handleOTPVerified}
      />
      
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Bike className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-2xl">Complete Your Rider Profile</CardTitle>
          <p className="text-gray-500 mt-2">
            Welcome! Please provide your details to start delivering.
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
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
              <Label htmlFor="address">Address *</Label>
              <div className="relative">
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter your address or use GPS"
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
