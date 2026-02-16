"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, User, MapPin, Phone } from "lucide-react"
import { API_CONFIG } from "@/lib/api/config"
import { useToast } from "@/hooks/use-toast"
import { getCurrentPosition, getAddressFromCoords } from "@/lib/utils/location"
import Link from "next/link"
import { OTPModal } from "@/components/otp-modal"

export default function UserSetupPage() {
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
    const userEmail = localStorage.getItem('userEmail')
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
      
      // Save to localStorage for hero section
      localStorage.setItem("user_coords", JSON.stringify(coords))
      localStorage.setItem("user_location_text", address.length > 25 ? address.substring(0, 25) + "..." : address)
      
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
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/user/complete-profile`, {
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
        // Store user data in localStorage
        if (data.user) {
          localStorage.setItem('token', token || '')
          localStorage.setItem('userEmail', data.user.email)
          localStorage.setItem('userData', JSON.stringify(data.user))
        }

        toast({
          title: "Success!",
          description: "Your profile has been completed",
          duration: 2000,
        })

        // Redirect to customer panel
        setTimeout(() => {
          router.push('/customer-panel')
        }, 1000)
      } else {
        throw new Error(data.message || 'Failed to complete profile')
      }
    } catch (error: any) {
      console.error('Error completing profile:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to complete profile",
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
      description: "You can now complete your profile",
      duration: 3000,
    })
  }

  return (
    <div className="min-h-screen bg-[#e9e9e9] flex items-center justify-center p-4">
      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={email}
        role="USER"
        onVerified={handleOTPVerified}
      />
      
      <Card className="w-full max-w-2xl bg-white p-4">
        <CardHeader className="text-center space-y-4 pb-4">
          <Link href="/">
            <img
              src="/chopNow.png"
              alt="ChopNow Logo"
              className="mx-auto w-40 object-cover"
            />
          </Link>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Complete Your Profile
          </CardTitle>
          <p className="text-gray-600 text-sm">
            {email && `Setting up profile for ${email}`}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className="pl-10 border-gray-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className="pl-10 border-gray-300"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+44 7123 456789"
                  className="pl-10 border-gray-300"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-700">
                Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onClick={handleAddressClick}
                  placeholder="Click to detect location or enter manually"
                  className="pl-10 pr-10 border-gray-300 cursor-pointer"
                  required
                  readOnly={isGettingLocation}
                />
                {isGettingLocation && (
                  <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-primary" />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Click the address field to auto-detect your location or type manually
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || isGettingLocation}
              className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-base font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing Profile...
                </>
              ) : (
                'Complete Profile'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
