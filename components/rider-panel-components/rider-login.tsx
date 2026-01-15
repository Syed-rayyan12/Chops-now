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

      <Card className="w-full max-w-md lg:max-w-sm bg-white px-6 py-6">
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
          </form>

          {/* Google Sign In Button */}
          <div className="mt-4">
            <Button
              type="button"
              onClick={() => {
                const GOOGLE_CLIENT_ID = "840672697083-d3a8pdf9a9ap4mlaph1l8uj4m9rksvei.apps.googleusercontent.com"
                const redirectUri = `${window.location.origin}/auth/callback`
                const scope = "openid email profile"
                const state = JSON.stringify({ role: 'RIDER', redirect: '/rider-dashboard' })
                const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}`
                window.location.href = googleAuthUrl
              }}
              variant="outline"
              className="w-full cursor-pointer border-gray-300  hover:rounded-lg flex items-center justify-center gap-2"
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
              onClick={() => router.push("/rider-signup")}
              className="text-secondary font-medium cursor-pointer  hover:underline"
            >
              Sign up
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
