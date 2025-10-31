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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
        // Clear error for this field
        if (fieldErrors[e.target.name]) {
            setFieldErrors({
                ...fieldErrors,
                [e.target.name]: "",
            })
        }
    }

    const validateForm = () => {
        const errors: Record<string, string> = {}

        if (!formData.firstName.trim()) {
            errors.firstName = "First Name is required"
        }

        if (!formData.lastName.trim()) {
            errors.lastName = "Last Name is required"
        }

        if (!formData.businessName.trim()) {
            errors.businessName = "Business Name is required"
        }

        if (!formData.businessEmail.trim()) {
            errors.businessEmail = "Business Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.businessEmail)) {
            errors.businessEmail = "Invalid email format"
        }

        if (!formData.businessPhone.trim()) {
            errors.businessPhone = "Business Phone Number is required"
        } else if (!/^\+44\s\d{4}\s\d{6}$/.test(formData.businessPhone)) {
            errors.businessPhone = "Invalid phone format (e.g., +44 7700 900123)"
        }

        if (!formData.businessAddress.trim()) {
            errors.businessAddress = "Business Address is required"
        }

        if (!formData.password.trim()) {
            errors.password = "Password is required"
        } else if (formData.password.length < 6) {
            errors.password = "Password must be at least 6 characters long"
        }

        if (!formData.agreeToTerms) {
            errors.agreeToTerms = "You must agree to the terms and privacy policy"
        }

        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            const res = await fetch("http://localhost:4000/api/restaurant/signup", {
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

            <Card className="w-full max-w-md bg-white max-sm:mx-4 p-4 ">
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
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* First Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">First Name</label>
                            <Input
                                type="text"
                                name="firstName"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="border text-foreground border-primary/40"
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
                                className="border text-foreground border-primary/40"
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
                                className="border text-foreground border-primary/40"
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
                                className="border text-foreground border-primary/40"
                            />
                            {fieldErrors.businessEmail && <p className="text-red-500 text-sm">{fieldErrors.businessEmail}</p>}
                        </div>

                        {/* Business Phone Number */}
                        <div className="space-y-2 relative">
                            <label className="text-sm font-medium text-gray-700">Business Phone Number</label>
                            <Phone className="absolute top-6 inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
                            <Input
                                type="tel"
                                name="businessPhone"
                                placeholder="+44 7700 900123"
                                value={formData.businessPhone}
                                onChange={handleChange}
                                className="pl-10 border text-foreground border-primary/40"
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
                                className="border text-foreground border-primary/40"
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
                                className="pr-10 border text-foreground border-primary/40"
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
