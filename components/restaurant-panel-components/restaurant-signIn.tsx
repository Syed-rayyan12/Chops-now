"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Phone, Lock, Mail } from "lucide-react"
import Toaster from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { loginRestaurant, getRestaurantProfile } from "@/lib/api/restaurant.api"
import { OTPModal } from "../otp-modal"

interface RiderLoginProps {
  onLogin: () => void
}

export function RestaurantSignIn({ onLogin }: RiderLoginProps) {
  const router = useRouter()
  const { toast } = useToast() // ✅ Correct way to trigger a toast

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Step 1: Login to get token
      const loginData = await loginRestaurant(formData)

      if (!loginData.token) {
        throw new Error("Invalid response from server")
      }

      // Store token and email immediately
      localStorage.setItem("restaurantToken", loginData.token)
      if (loginData.email) {
        localStorage.setItem("restaurantEmail", loginData.email)
      }

      toast({
        title: "Login Successful!",
        description: "Redirecting to dashboard...",
        duration: 1500,
      })

      // Fetch profile in background (don't await)
      getRestaurantProfile()
        .then((profile) => {
          if (profile.slug) {
            localStorage.setItem("restaurantSlug", profile.slug)
          }
        })
        .catch((err) => {
          console.warn("Failed to fetch restaurant profile:", err)
        })

      // Redirect immediately without waiting for profile
      setTimeout(() => {
        router.push("/restaurant-dashboard")
      }, 300)
      
    } catch (err: any) {
      setError(err.message || "Login failed")
      
      // Check if email verification is required
      if (err.statusCode === 403 || err.message?.includes("verify your email")) {
        setUserEmail(formData.email)
        setShowOTPModal(true)
        toast({
          title: "Email Verification Required",
          description: err.message || "Please verify your email before logging in.",
          duration: 4000,
        })
      } else {
        toast({
          title: "Login Failed",
          description: err.message || "Please check your credentials",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOTPVerified = () => {
    setShowOTPModal(false)
    toast({
      title: "Email Verified! ✓",
      description: "You can now sign in to your account.",
      duration: 3000,
    })
    // Automatically attempt login again after verification
    setTimeout(() => {
      handleLogin({ preventDefault: () => {} } as any)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center bg-[#e9e9e9] justify-center p-4 relative">
      {/* ✅ Render Toaster */}
      <Toaster />

      {/* ✅ OTP Modal */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={userEmail}
        role="RESTAURANT"
        onVerified={handleOTPVerified}
      />

      <Card className="w-full max-w-md lg:max-w-sm bg-white p-4">
        <CardHeader className="text-center py-6 px-6">
          <Link href="/">
        <img
            src="/chopNow.png"
            alt="ChopNow Logo"
            className="mx-auto w-40 object-cover"
        />
         </Link>

        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 border text-foreground border-primary/40"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 border text-foreground border-primary/40"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 rounded-lg cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
          </form>

          {/* Google Sign In Button */}
          <div className="mt-4">
            <Button
              type="button"
              onClick={() => {
                const GOOGLE_CLIENT_ID = "840672697083-d3a8pdf9a9ap4mlaph1l8uj4m9rksvei.apps.googleusercontent.com"
                const redirectUri = `${window.location.origin}/auth/callback`
                const scope = "openid email profile"
                const state = JSON.stringify({ role: 'RESTAURANT', redirect: '/restaurant-dashboard' })
                const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}`
                window.location.href = googleAuthUrl
              }}
              variant="outline"
              className="w-full  hover:rounded-lg cursor-pointer border-gray-300  hover:rounded-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/restaurant-signup")}
              className="text-secondary font-medium cursor-pointer hover:underline"
            >
              Sign up
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
