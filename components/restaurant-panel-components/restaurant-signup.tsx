"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Phone, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Toaster from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { API_CONFIG } from "@/lib/api/config"

export default function RestaurantSignup() {
    const router = useRouter()
    const { toast } = useToast() // ✅ Correct way to trigger a toast

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        businessName: "",
        businessEmail: "",
        businessPhone: "",
        businessAddress: "",
        password: "",
        agreeToTerms: false,
    })
    const [showPassword, setShowPassword] = useState(false)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        
        // Format phone number for UK format
        if (name === "businessPhone") {
            // Only allow numbers, +, and spaces
            const cleaned = value.replace(/[^\d+\s]/g, '')
            setFormData({
                ...formData,
                [name]: cleaned,
            })
        } else {
            setFormData({
                ...formData,
                [name]: value,
            })
        }
        
        // Clear error for this field
        if (fieldErrors[name]) {
            setFieldErrors({
                ...fieldErrors,
                [name]: "",
            })
        }
    }

    const validateForm = () => {
        const errors: Record<string, string> = {}

        // Step 1: Check for empty/required fields
        if (!formData.firstName.trim()) {
            errors.firstName = "First name is required"
        }

        if (!formData.lastName.trim()) {
            errors.lastName = "Last name is required"
        }

        if (!formData.businessName.trim()) {
            errors.businessName = "Business name is required"
        }

        if (!formData.businessEmail.trim()) {
            errors.businessEmail = "Business email is required"
        }

        if (!formData.businessPhone.trim()) {
            errors.businessPhone = "Business phone number is required"
        }

        if (!formData.businessAddress.trim()) {
            errors.businessAddress = "Business address is required"
        }

        if (!formData.password.trim()) {
            errors.password = "Password is required"
        }

        if (!formData.agreeToTerms) {
            errors.agreeToTerms = "You must agree to the terms and privacy policy"
        }

        // If any required field is missing, return errors immediately
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors)
            return false
        }

        // Step 2: Format validations (only if fields are filled)
        
        // Name validation
        const nameRegex = /^[a-zA-Z\s]{2,}$/
        if (!nameRegex.test(formData.firstName)) {
            errors.firstName = "First name must contain only letters and be at least 2 characters"
        }

        if (!nameRegex.test(formData.lastName)) {
            errors.lastName = "Last name must contain only letters and be at least 2 characters"
        }

        // Email validation - check for @ and .
        if (!formData.businessEmail.includes("@")) {
            errors.businessEmail = "Email must contain @ symbol"
        } else if (!formData.businessEmail.includes(".")) {
            errors.businessEmail = "Email must contain a domain (e.g., .com, .co.uk)"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.businessEmail)) {
            errors.businessEmail = "Please enter a valid email address (e.g., info@restaurant.com)"
        }

        // Phone validation - UK format only
        const ukPhoneRegex = /^(?:(?:\+44\s?|0)(?:\d\s?){10})$/
        if (!ukPhoneRegex.test(formData.businessPhone.replace(/\s/g, ''))) {
            errors.businessPhone = "Please enter a valid UK phone number (e.g., +44 7700 900123 or 07700900123)"
        }

        // Password validation
        if (formData.password.length < 8) {
            errors.password = "Password must be at least 8 characters long"
        } else {
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)/
            if (!passwordRegex.test(formData.password)) {
                errors.password = "Password must contain at least one letter and one number"
            }
        }

        // If there are format errors, show them
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors)
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/restaurant/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong")
            }

            // ✅ Don't save to localStorage - redirect to login
            // ✅ Trigger toast
            toast({
                title: "Restaurant Created Successfully! Please sign in.",
                duration: 3000,
            })

            // Redirect to login page after signup
            setTimeout(() => {
                router.push("/restaurant-signIn")
            }, 2000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center bg-[#e9e9e9] items-center min-h-screen relative">
            {/* ✅ Render Toaster */}
            <Toaster />

            <Card className="w-full max-w-md lg:max-w-sm bg-white max-sm:mx-4 p-4 ">
                <CardHeader className="text-center space-y-4">
                    <Link href="/">
                    <img
                        src="/chopNow.png"
                        alt="ChopNow Logo"
                        className="mx-auto w-40  object-cover"
                    />
                   </Link>

                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} noValidate={true} className="space-y-4">
                        {/* First Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">First Name</label>
                            <Input
                                type="text"
                                name="firstName"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="border text-foreground placeholder:text-gray-400/60 border-primary/40"
                            />
                            {fieldErrors.firstName && <p className="text-red-500 text-sm">{fieldErrors.firstName}</p>}
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Last Name</label>
                            <Input
                                type="text"
                                name="lastName"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="border text-foreground placeholder:text-gray-400/60 border-primary/40"
                            />
                             {fieldErrors.lastName && <p className="text-red-500 text-sm">{fieldErrors.lastName}</p>}
                        </div>

                        {/* Business Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Business Name</label>
                            <Input
                                type="text"
                                name="businessName"
                                placeholder="The Curry House"
                                value={formData.businessName}
                                onChange={handleChange}
                                className="border text-foreground placeholder:text-gray-400/60 border-primary/40"
                            />
                            {fieldErrors.businessName && <p className="text-red-500 text-sm">{fieldErrors.businessName}</p>}
                        </div>

                        {/* Business Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Business Email</label>
                            <Input
                                type="email"
                                name="businessEmail"
                                placeholder="info@thecurryhouse.co.uk"
                                value={formData.businessEmail}
                                onChange={handleChange}
                                className="border text-foreground placeholder:text-gray-400/60 border-primary/40"
                            />
                            {fieldErrors.businessEmail && <p className="text-red-500 text-sm">{fieldErrors.businessEmail}</p>}
                        </div>

                        {/* Business Phone Number */}
                        <div className="space-y-2 relative">
                            <label className="text-sm font-medium text-gray-700">Business Phone Number</label>
                           
                            <Input
                                type="tel"
                                name="businessPhone"
                                placeholder="+44 7700 900123"
                                value={formData.businessPhone}
                                onChange={handleChange}
                                className=" border text-foreground placeholder:text-gray-400/60 border-primary/40"
                            />
                            {fieldErrors.businessPhone && <p className="text-red-500 text-sm">{fieldErrors.businessPhone}</p>}
                        </div>

                        {/* Business Address */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Business Address</label>
                            <Input
                                type="text"
                                name="businessAddress"
                                placeholder="123 High Street, London"
                                value={formData.businessAddress}
                                onChange={handleChange}
                                className="border text-foreground placeholder:text-gray-400/60 border-primary/40"
                            />
                            {fieldErrors.businessAddress && <p className="text-red-500 text-sm">{fieldErrors.businessAddress}</p>}
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
                                className="pr-10 border text-foreground placeholder:text-gray-400/60 border-primary/40"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-6 inset-y-0 right-3 my-auto text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                            {fieldErrors.password && <p className="text-red-500 text-sm">{fieldErrors.password}</p>}
                        </div>

                        {/* Agree to Terms & Privacy Policy */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="agreeToTerms"
                                    className="border border-primary"
                                    checked={formData.agreeToTerms}
                                    onCheckedChange={(checked) => {
                                        setFormData({...formData, agreeToTerms: checked as boolean})
                                        // Clear error for agreeToTerms
                                        if (fieldErrors.agreeToTerms) {
                                            setFieldErrors({
                                                ...fieldErrors,
                                                agreeToTerms: "",
                                            })
                                        }
                                    }}
                                />
                                <label htmlFor="agreeToTerms" className="text-sm font-medium text-gray-700">Agree to Terms & Privacy Policy</label>
                            </div>
                            {fieldErrors.agreeToTerms && <p className="text-red-500 text-sm">{fieldErrors.agreeToTerms}</p>}
                        </div>

                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 cursor-pointer text-white rounded-lg px-2 py-2">
                            {loading ? "Signing up..." : "Sign Up"}
                        </Button>

                        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
                    </form>

                </CardContent>
            </Card>
        </div>
    )
}
