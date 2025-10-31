"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import Toaster from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { STORAGE_KEYS, API_CONFIG } from "@/lib/api/config"

export function RiderLogin() {
  const router = useRouter()
  const { toast } = useToast() // ✅ useToast for showing toasts

  console.log("API_CONFIG.BASE_URL:", API_CONFIG.BASE_URL)

  const [showPassword, setShowPassword] = useState(false)
 
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const apiUrl = `${API_CONFIG.BASE_URL}/rider/login`
      console.log("Making API call to:", apiUrl)
      console.log("API_CONFIG.BASE_URL:", API_CONFIG.BASE_URL)
      
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      console.log("Response status:", res.status)
      console.log("Response headers:", Object.fromEntries(res.headers.entries()))

      const data = await res.json()
      console.log("Response data:", data)

      if (!res.ok) throw new Error(data.message || "Login failed")

      console.log("✅ Login successful, token received:", data.token ? "YES" : "NO")
      console.log("✅ Email received:", data.email)

      if (data.token && data.email) {
        // Save token to localStorage under rider token key
        console.log("💾 Saving token to:", STORAGE_KEYS.RIDER_TOKEN)
        localStorage.setItem(STORAGE_KEYS.RIDER_TOKEN, data.token)
        console.log("✅ Token saved successfully")

        toast({
          title: "Rider Login Successful!",
          duration: 2000,
        });

        console.log("🚀 Redirecting to /rider-dashboard in 1 second...")
        setTimeout(() => {
          router.push("/rider-dashboard");
        }, 1000);
      } else {
        console.error("❌ Missing token or email in response:", data)
        throw new Error("Invalid response from server")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      toast({
        title: "Login Failed",
        description: err.message,
        variant: "destructive",
        duration: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#e9e9e9] flex items-center justify-center p-4 relative">
      {/* ✅ Toaster */}
      <Toaster />

      <Card className="w-full max-w-[25%] bg-white px-6 py-6">
        <CardHeader className="text-center py-4">
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
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  name="email"
                  placeholder="Enter Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 border text-foreground focus:border-secondary border-gray-400"
                  required
                />
              </div>
            </div>

            {/* Password */}
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
                  className="pl-10 pr-10 text-foreground focus:border-secondary border-gray-400 h-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400  hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary cursor-pointer rounded-lg hover:bg-primary/90">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/rider-signup")}
              className="text-secondary font-medium cursor-pointer  hover:underline"
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
