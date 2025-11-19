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
import { Textarea } from "../ui/textarea"
import { getCurrentPosition, getAddressFromCoords } from "@/lib/utils/location"

export default function RiderSignup() {
  const router = useRouter()
  const { toast } = useToast() // ✅ Correct way to trigger a toast

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    // 1️⃣ Account Info
    firstName: "",
    lastName: "",
    email: "",             // email
    phone: "",             // tel
    password: "",          // password

    // 2️⃣ Personal Details & Address
    personalDetails: "",   // text or textarea
    address: "",           // text
    latitude: null as number | null,
    longitude: null as number | null,

    // 3️⃣ Document Uploads
    idDocument: null as File | null,        // file
    proofOfAddress: null as File | null,    // file
    selfie: null as File | null,            // file

    // 4️⃣ Vehicle & Insurance
    vehicle: "",             // text
    insurance: null as File | null,         // file
    insuranceExpiryReminder: "",  // date

    // 5️⃣ Bank Payout Details
    accountNumber: "",       // text
    sortCode: "",            // text

    // 6️⃣ Agreement
    deliveryPartnerAgreementAccepted: false  // checkbox
  })
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    password?: string
    sortCode?: string
    accountNumber?: string
    personalDetails?:string
    insuranceExpiryReminder?:string
  }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value, checked, files } = e.target as any;
    
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      // Format phone number for UK format
      if (name === "phone") {
        // Only allow numbers, +, and spaces
        const cleaned = value.replace(/[^\d+\s]/g, '')
        setFormData({ ...formData, [name]: cleaned });
      }
      // Format sort code as user types
      else if (name === "sortCode") {
        // Only allow digits and dashes
        const cleaned = value.replace(/[^\d-]/g, '')
        // Auto-format to XX-XX-XX
        let formatted = cleaned.replace(/[^0-9]/g, '')
        if (formatted.length > 2) {
          formatted = formatted.slice(0, 2) + '-' + formatted.slice(2)
        }
        if (formatted.length > 5) {
          formatted = formatted.slice(0, 5) + '-' + formatted.slice(5, 7)
        }
        setFormData({ ...formData, [name]: formatted });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }
    
    // Clear field error when user types
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleAddressClick = async () => {
    setLocationLoading(true)
    try {
      const coords = await getCurrentPosition()
      const address = await getAddressFromCoords(coords.latitude, coords.longitude)
      
      setFormData({
        ...formData,
        address: address,
        latitude: coords.latitude,
        longitude: coords.longitude,
      })

      toast({
        title: "Location captured",
        description: "Your location has been set successfully",
      })
    } catch (error) {
      console.error("Error getting location:", error)
      toast({
        title: "Location error",
        description: "Could not get your location. Please enter address manually.",
        variant: "destructive",
      })
    } finally {
      setLocationLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Step 1: Check all required fields are filled
    let errors: typeof fieldErrors = {}
    let hasError = false

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required"
      hasError = true
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required"
      hasError = true
    }
    if (!formData.personalDetails.trim()) {
     errors.personalDetails = "Personal details are required"
     hasError = true
   }

    if (!formData.insuranceExpiryReminder.trim()) {
     errors.insuranceExpiryReminder = "Insurance expiry reminder is required"
     hasError = true
   }
    if (!formData.email.trim()) {
      errors.email = "Email is required"
      hasError = true
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required"
      hasError = true
    }
    if (!formData.password.trim()) {
      errors.password = "Password is required"
      hasError = true
    }
    if (!formData.accountNumber.trim()) {
      errors.accountNumber = "Account number is required"
      hasError = true
    }
    if (!formData.sortCode.trim()) {
      errors.sortCode = "Sort code is required"
      hasError = true
    }

    if (hasError) {
      setFieldErrors(errors)
      return
    }

    setError(null)
    setFieldErrors({})

    setLoading(true)

    // Step 2: Validate formats
    const nameRegex = /^[A-Za-z\s]{2,}$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const ukPhoneRegex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$|^(\+44\s?[1-9]\d{1,4}|\(?0[1-9]\d{1,4}\)?)\s?\d{3,4}\s?\d{3,4}$/
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/

    if (!nameRegex.test(formData.firstName)) {
      errors.firstName = "First name must contain only letters and be at least 2 characters"
      hasError = true
    }
    if (!nameRegex.test(formData.lastName)) {
      errors.lastName = "Last name must contain only letters and be at least 2 characters"
      hasError = true
    }
    if (!formData.email.includes("@")) {
      errors.email = "Email must contain @"
      hasError = true
    } else if (!formData.email.includes(".")) {
      errors.email = "Email must contain a domain (e.g., .com)"
      hasError = true
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address"
      hasError = true
    }
    if (!ukPhoneRegex.test(formData.phone)) {
      errors.phone = "Please enter a valid UK phone number (e.g., +44 7XXX XXXXXX or 07XXX XXXXXX)"
      hasError = true
    }
    if (!passwordRegex.test(formData.password)) {
      errors.password = "Password must be at least 8 characters and contain both letters and numbers"
      hasError = true
    }

    // Validate sort code format
    const sortCodeDigits = formData.sortCode.replace(/-/g, "")
    if (sortCodeDigits.length !== 6) {
      errors.sortCode = "Sort code must be 6 digits in format XX-XX-XX"
      hasError = true
    }

    if (hasError) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)

    try {
      // Convert file fields to null if not provided (can't send File objects as JSON)
      const payload = {
        ...formData,
        idDocument: formData.idDocument ? formData.idDocument.name : null,
        proofOfAddress: formData.proofOfAddress ? formData.proofOfAddress.name : null,
        selfie: formData.selfie ? formData.selfie.name : null,
        insurance: formData.insurance ? formData.insurance.name : null,
      }

      const res = await fetch(`${API_CONFIG.BASE_URL}/rider/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        // Handle backend validation errors
        if (data.errors) {
          const backendErrors: typeof fieldErrors = {}
          Object.entries(data.errors).forEach(([field, message]) => {
            backendErrors[field as keyof typeof fieldErrors] = message as string
          })
          setFieldErrors(backendErrors)
        }
        throw new Error(data.message || "Something went wrong")
      }

      // ✅ Trigger toast
      toast({
        title: "Rider Created Successfully! Please login.",
        duration: 3000,
      })

      // Redirect to login page after toast duration
      setTimeout(() => {
        router.push("/rider-signIn")
      }, 3000)
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
        <CardHeader className="text-center space-y-4 py-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name, Email, Phone, Password (all in one row) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 col-span-2">
                {/* First & Last Name */}
                <div className="col-span-2 max-sm:col-span-4 space-y-2">
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <Input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="pl-3 border h-10 text-foreground placeholder:text-gray-400/60 focus:border-secondary border-gray-400 w-full" />
                  {fieldErrors.firstName && <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>}
                </div>
                <div className="col-span-2 max-sm:col-span-4 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <Input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="pl-3 border h-10 text-foreground placeholder:text-gray-400/60 focus:border-secondary border-gray-400 w-full" />
                  {fieldErrors.lastName && <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>}
                </div>
                {/* Email & Phone (one line, two columns) */}
                <div className="col-span-2 max-sm:col-span-4 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="pl-3 border h-10 text-foreground placeholder:text-gray-400/60 focus:border-secondary border-gray-400 w-full" />
                  {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
                </div>
                <div className="col-span-2 max-sm:col-span-4 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <Input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="pl-3 border h-10 text-foreground placeholder:text-gray-400/60 focus:border-secondary border-gray-400 w-full" />
                  {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
                </div>
                {/* Password (one line) */}
                <div className="col-span-4 space-y-2 relative">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <Input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="pl-3 pr-10 placeholder:text-gray-400/60 border h-10 text-foreground focus:border-secondary border-gray-400 w-full" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-6 inset-y-0 right-3 my-auto text-gray-400 hover:text-gray-600 cursor-pointer">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
                </div>
                {/* Personal Details (one line) */}
                <div className="col-span-4 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Personal Details</label>
                
                <Textarea name="personalDetails" placeholder="Personal Details" value={formData.personalDetails} onChange={handleChange} className="pl-3 pr-10 border h-10 text-foreground placeholder:text-gray-400/60 focus:border-secondary border-gray-400 w-full" />
                 {fieldErrors.personalDetails && <p className="text-red-500 text-xs">{fieldErrors.personalDetails}</p>}
                </div>
              </div>

              {/* Personal Details (full width) */}
             

              {/* Address, Vehicle, ID Document, Proof of Address (all in one row) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2">
                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <div className="relative">
                    <Input 
                      type="text" 
                      name="address" 
                      placeholder="Click to get location or type address" 
                      value={formData.address} 
                      onChange={handleChange}
                      onFocus={handleAddressClick}
                      onClick={handleAddressClick}
                      className="pl-3 pr-10 border h-10 text-foreground focus:border-secondary placeholder:text-gray-400/60 border-gray-400" 
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      {locationLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                      ) : (
                        <MapPin className="h-4 w-4 text-secondary" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Vehicle</label>
                  <Input type="text" name="vehicle" placeholder="Vehicle" value={formData.vehicle} onChange={handleChange} className="pl-3 border h-10 text-foreground focus:border-secondary placeholder:text-gray-400/60 border-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ID Document</label>
                  <Input type="file" name="idDocument" onChange={handleChange} className="pl-3 border h-10 text-foreground placeholder:text-gray-400/60 focus:border-secondary border-gray-400" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Proof of Address</label>
                  <Input type="file" name="proofOfAddress" onChange={handleChange} className="pl-3 border h-10 text-foreground placeholder:text-gray-400/60 focus:border-secondary border-gray-400" />
                </div>
              </div>

              {/* Selfie, Insurance, Insurance Expiry Reminder, Account Number (all in one row) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Selfie</label>
                  <Input type="file" name="selfie" onChange={handleChange} className="pl-3 border h-10 text-foreground placeholder:text-gray-400/60 focus:border-secondary border-gray-400" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Insurance</label>
                  <Input type="file" name="insurance" onChange={handleChange} className="pl-3 border h-10 text-foreground placeholder:text-gray-400/60 focus:border-secondary border-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Insurance Expiry Reminder</label>
                  <Input type="date" name="insuranceExpiryReminder" value={formData.insuranceExpiryReminder} onChange={handleChange} className="pl-3 border placeholder:text-gray-400/60 h-10 text-foreground focus:border-secondary border-gray-400" />
                {fieldErrors.insuranceExpiryReminder && <p className="text-red-500 text-xs">{fieldErrors.insuranceExpiryReminder}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Account Number</label>
                  <Input type="text" name="accountNumber" placeholder="Account Number" value={formData.accountNumber} onChange={handleChange} className="pl-3 placeholder:text-gray-400/60 border h-10 text-foreground focus:border-secondary border-gray-400" />
                  {fieldErrors.accountNumber && <p className="text-red-500 text-xs mt-1">{fieldErrors.accountNumber}</p>}
                </div>
              </div>

              {/* Sort Code (full width) */}
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">Sort Code</label>
                <Input 
                  type="text" 
                  name="sortCode" 
                  placeholder="XX-XX-XX" 
                  value={formData.sortCode} 
                  onChange={handleChange} 
                  maxLength={8}
                  className="pl-3 border h-10 text-foreground placeholder:text-gray-400/60 focus:border-secondary border-gray-400 w-full" 
                />
                {fieldErrors.sortCode && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.sortCode}</p>
                )}
              </div>

              {/* Agreement (full width) */}
              <div className="col-span-2 space-y-2 flex items-center">
                <input type="checkbox" name="deliveryPartnerAgreementAccepted" checked={formData.deliveryPartnerAgreementAccepted} onChange={handleChange} className="mr-2 placeholder:text-gray-400/60" />
                <label className="text-sm font-medium text-gray-700">I accept the Delivery Partner Agreement</label>
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary text-white rounded-lg px-2 py-4 cursor-pointer mt-4">
              {loading ? "Signing up..." : "Sign Up"}
            </Button>

            {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
