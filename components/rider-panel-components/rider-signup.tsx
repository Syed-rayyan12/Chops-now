"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Phone, EyeOff, Eye, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Toaster from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { API_CONFIG } from "@/lib/api/config"

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
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value, checked, files } = e.target as any;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

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

      if (!res.ok) throw new Error(data.message || "Something went wrong")

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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name, Email, Phone, Password (all in one row) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 col-span-2">
                {/* First & Last Name */}
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <Input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className="pl-3 border h-10 text-foreground focus:border-secondary border-gray-400 w-full" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <Input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required className="pl-3 border h-10 text-foreground focus:border-secondary border-gray-400 w-full" />
                </div>
                {/* Email & Phone (one line, two columns) */}
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="pl-3 border h-10 text-foreground focus:border-secondary border-gray-400 w-full" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <Input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required className="pl-3 border h-10 text-foreground focus:border-secondary border-gray-400 w-full" />
                </div>
                {/* Password (one line) */}
                <div className="col-span-4 space-y-2 relative">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <Input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="pl-3 pr-10 border h-10 text-foreground focus:border-secondary border-gray-400 w-full" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-6 inset-y-0 right-3 my-auto text-gray-400 hover:text-gray-600 cursor-pointer">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Personal Details (one line) */}
                <div className="col-span-4 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Personal Details</label>
                
                <textarea name="personalDetails" placeholder="Personal Details" value={formData.personalDetails} onChange={handleChange} className="pl-3 pr-10 border h-10 text-foreground focus:border-secondary border-gray-400 w-full" />
                </div>
              </div>

              {/* Personal Details (full width) */}
             

              {/* Address, Vehicle, ID Document, Proof of Address (all in one row) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <Input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="pl-3 border h-10 text-foreground focus:border-secondary border-gray-400" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Vehicle</label>
                  <Input type="text" name="vehicle" placeholder="Vehicle" value={formData.vehicle} onChange={handleChange} className="pl-3 border h-10 text-foreground focus:border-secondary border-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ID Document</label>
                  <Input type="file" name="idDocument" onChange={handleChange} className="pl-3 border h-10 text-foreground focus:border-secondary border-gray-400" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Proof of Address</label>
                  <Input type="file" name="proofOfAddress" onChange={handleChange} className="pl-3 border h-10 text-foreground focus:border-secondary border-gray-400" />
                </div>
              </div>

              {/* Selfie, Insurance, Insurance Expiry Reminder, Account Number (all in one row) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Selfie</label>
                  <Input type="file" name="selfie" onChange={handleChange} className="pl-3 border h-10 text-foreground focus:border-secondary border-gray-400" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Insurance</label>
                  <Input type="file" name="insurance" onChange={handleChange} className="pl-3 border h-10 text-foreground focus:border-secondary border-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Insurance Expiry Reminder</label>
                  <Input type="date" name="insuranceExpiryReminder" value={formData.insuranceExpiryReminder} onChange={handleChange} className="pl-3 border h-10 text-foreground focus:border-secondary border-gray-400" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Account Number</label>
                  <Input type="text" name="accountNumber" placeholder="Account Number" value={formData.accountNumber} onChange={handleChange} className="pl-3 border h-10 text-foreground focus:border-secondary border-gray-400" />
                </div>
              </div>

              {/* Sort Code (full width) */}
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">Sort Code</label>
                <textarea name="personalDetails" placeholder="Personal Details" value={formData.personalDetails} onChange={handleChange} className="pl-3 border h-20 text-foreground focus:border-secondary border-gray-400 w-full rounded-md resize-none" />
              </div>

              {/* Agreement (full width) */}
              <div className="col-span-2 space-y-2 flex items-center">
                <input type="checkbox" name="deliveryPartnerAgreementAccepted" checked={formData.deliveryPartnerAgreementAccepted} onChange={handleChange} className="mr-2" />
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
