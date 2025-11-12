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
      toast({
        title: "Login Failed",
        description: err.message || "Please check your credentials",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center bg-[#e9e9e9] justify-center p-4 relative">
      {/* ✅ Render Toaster */}
      <Toaster />

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
            <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/restaurant-signup")}
              className="text-secondary font-medium cursor-pointer hover:underline"
            >
              Sign up
            </button>
          </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
