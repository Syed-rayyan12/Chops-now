"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Phone, EyeOff, Eye, User, MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Toaster from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { API_CONFIG } from "@/lib/api/config"
import { getCurrentPosition, getAddressFromCoords } from "@/lib/utils/location"

export default function RiderSignup() {
  const router = useRouter()
  const { toast } = useToast() // ✅ Correct way to trigger a toast

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
  })
  const [gpsCoords, setGpsCoords] = useState<{ latitude: number; longitude: number } | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    password?: string
    address?: string
  }>({})

  const handleAddressClick = async () => {
    if (isGettingLocation) return
    
    setIsGettingLocation(true)
    try {
      const coords = await getCurrentPosition()
      const address = await getAddressFromCoords(coords.latitude, coords.longitude)
      
      setGpsCoords(coords)
      setFormData((prev) => ({ ...prev, address }))
      
      // Save to localStorage for hero section
      localStorage.setItem("user_coords", JSON.stringify(coords))
      localStorage.setItem("user_location_text", address.length > 25 ? address.substring(0, 25) + "..." : address)
      
      toast({
        title: "Location Detected ✓",
        description: "Address auto-filled from your location",
      })
    } catch (err: any) {
      toast({
        title: "Location Error",
        description: err.message || "Please enter address manually",
        variant: "destructive",
      })
    } finally {
      setIsGettingLocation(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Format phone number for UK format
    if (name === "phone") {
      // Only allow numbers, +, and spaces
      const cleaned = value.replace(/[^\d+\s]/g, '')
      setFormData((prev) => ({ ...prev, [name]: cleaned }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
    
    // Clear field-level error as user types
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let hasError = false
    const nextErrors: { firstName?: string; lastName?: string; email?: string; phone?: string; password?: string; address?: string } = {}

    // Step 1: Check for empty fields
    if (!formData.firstName.trim()) {
      nextErrors.firstName = "First name is required"
      hasError = true
    }
    if (!formData.lastName.trim()) {
      nextErrors.lastName = "Last name is required"
      hasError = true
    }
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required"
      hasError = true
    }
    if (!formData.phone.trim()) {
      nextErrors.phone = "Phone number is required"
      hasError = true
    }
    if (!formData.password.trim()) {
      nextErrors.password = "Password is required"
      hasError = true
    }
    if (!formData.address.trim()) {
      nextErrors.address = "Address is required"
      hasError = true
    }

    // If any field is empty, show errors and stop
    if (hasError) {
      setFieldErrors(nextErrors)
      return
    }

    // Step 2: Format validations
    const nameRegex = /^[a-zA-Z\s]{2,}$/
    if (!nameRegex.test(formData.firstName)) {
      nextErrors.firstName = "First name must contain only letters and be at least 2 characters"
      hasError = true
    }
    if (!nameRegex.test(formData.lastName)) {
      nextErrors.lastName = "Last name must contain only letters and be at least 2 characters"
      hasError = true
    }

    // Email validation - must contain @ and .
    if (!formData.email.includes("@")) {
      nextErrors.email = "Email must contain @ symbol"
      hasError = true
    } else if (!formData.email.includes(".")) {
      nextErrors.email = "Email must contain a domain (e.g., .com, .co.uk)"
      hasError = true
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        nextErrors.email = "Please enter a valid email address (e.g., user@example.com)"
        hasError = true
      }
    }

    // Phone validation - UK format
    const ukPhoneRegex = /^(?:(?:\+44\s?|0)(?:\d\s?){10})$/
    if (!ukPhoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      nextErrors.phone = "Please enter a valid phone number (e.g., +44 7123 456789)"
      hasError = true
    }

    // Password validation
    if (formData.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters"
      hasError = true
    } else {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)/
      if (!passwordRegex.test(formData.password)) {
        nextErrors.password = "Password must contain at least one letter and one number"
        hasError = true
      }
    }

    // If validation fails, show errors
    if (hasError) {
      setFieldErrors(nextErrors)
      return
    }

    setLoading(true)
    setError(null)
    setFieldErrors({})

    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "Something went wrong")

      // ✅ Show success toast (will be dismissed before redirect)
      toast({
        title: "Success!",
        description: "Account created successfully. Redirecting to login...",
        duration: 2000,
      })

      // ✅ Redirect to login page after short delay
      setTimeout(() => {
        router.push("/user-signIn")
      }, 2000)
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
        duration: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#e9e9e9] relative">
      {/* ✅ Render Toaster */}
      <Toaster />

      <Card className="w-full max-w-md max-sm:mx-4 bg-white px-6 py-6">
        <CardHeader className="text-center space-y-4 py-6 px-6">
          <Link href="/">
          <img
            src="/chopNow.png"
            alt="ChopNow Logo"
            className="mx-auto w-40 object-cover"
            />
            </Link>
         
        
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate={true} className="space-y-4">
            {/* First Name */}
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-700">First Name</label>
             
              <Input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className=" border h-10 text-foreground placeholder:text-gray-400/60 focus:border-secondary border-gray-400"
                required
              />
              {fieldErrors.firstName && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
             
              <Input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className=" border h-10 text-foreground placeholder:text-gray-400/60 focus:border-secondary border-gray-400"
                required
              />
              {fieldErrors.lastName && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-700">Email</label>
              
              <Input
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className=" border h-10 text-foreground placeholder:text-gray-400/60 focus:border-secondary border-gray-400"
                required
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
            
              <Input
                type="tel"
                name="phone"
                placeholder="+44 7123 456789"
                value={formData.phone}
                onChange={handleChange}
                className=" border h-10 text-foreground placeholder:text-gray-400/60 focus:border-secondary border-gray-400"
                required
              />
              {fieldErrors.phone && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="pr-10 border h-10 text-foreground placeholder:text-gray-400/60 focus:border-secondary border-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-6 inset-y-0 right-3 my-auto text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <div className="relative">
                <Input
                  type="text"
                  name="address"
                  placeholder="Click icon to detect location or type address"
                  value={formData.address}
                  onChange={handleChange}
                  onFocus={handleAddressClick}
                  className="border h-10 pr-10 text-foreground placeholder:text-gray-400/60 focus:border-secondary border-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={handleAddressClick}
                  disabled={isGettingLocation}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary transition-colors"
                >
                  {isGettingLocation ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </button>
              </div>
              {fieldErrors.address && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.address}</p>
              )}
            </div>

            <Button type="submit" className="w-full bg-primary text-white rounded-lg px-2 py-4 cursor-pointer">
              {loading ? "Signing up..." : "Sign Up"}
            </Button>

            {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
