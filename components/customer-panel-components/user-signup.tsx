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
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    password?: string
  }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear field-level error as user types
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setFieldErrors({})

    // Required checks
    let hasError = false
    const nextErrors: { firstName?: string; lastName?: string; email?: string; phone?: string; password?: string } = {}
    if (!formData.firstName.trim()) { nextErrors.firstName = "First name is required"; hasError = true }
    if (!formData.lastName.trim()) { nextErrors.lastName = "Last name is required"; hasError = true }
    if (!formData.email.trim()) { nextErrors.email = "Email is required"; hasError = true }
    if (!formData.phone.trim()) { nextErrors.phone = "Phone number is required"; hasError = true }
    if (!formData.password.trim()) { nextErrors.password = "Password is required"; hasError = true }
    if (hasError) {
      setFieldErrors(nextErrors)
      setLoading(false)
      return
    }

    // Format validations
    const nameRegex = /^[a-zA-Z]{2,}$/
    if (!nameRegex.test(formData.firstName)) { nextErrors.firstName = "First name must contain only letters and be at least 2 characters"; hasError = true }
    if (!nameRegex.test(formData.lastName)) { nextErrors.lastName = "Last name must contain only letters and be at least 2 characters"; hasError = true }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) { nextErrors.email = "Please provide a valid email address (e.g., user@example.com)"; hasError = true }
    if (formData.password.length < 8) { nextErrors.password = "Password must be at least 8 characters"; hasError = true }
    else {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)/
      if (!passwordRegex.test(formData.password)) { nextErrors.password = "Password must contain at least one letter and one number"; hasError = true }
    }
    if (hasError) {
      setFieldErrors(nextErrors)
      setLoading(false)
      return
    }

    try {
      const res = await fetch("http://localhost:4000/api/user/signup", {
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <User className="absolute top-6 inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
              <Input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="pl-10 border h-10 text-foreground focus:border-secondary border-gray-400"
                required
              />
              {fieldErrors.firstName && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <User className="absolute top-6 inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
              <Input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="pl-10 border h-10 text-foreground focus:border-secondary border-gray-400"
                required
              />
              {fieldErrors.lastName && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <User className="absolute top-6 inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
              <Input
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 border h-10 text-foreground focus:border-secondary border-gray-400"
                required
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <Phone className="absolute top-6 inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
              <Input
                type="tel"
                name="phone"
                placeholder="+44 7123 456789"
                value={formData.phone}
                onChange={handleChange}
                className="pl-10 border h-10 text-foreground focus:border-secondary border-gray-400"
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
                className="pr-10 border h-10 text-foreground focus:border-secondary border-gray-400"
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
