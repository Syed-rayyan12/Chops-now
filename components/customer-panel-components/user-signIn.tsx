"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { API_CONFIG } from "@/lib/api/config"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export default function UserSignIn({ setLoading }: { setLoading: (val: boolean) => void }) {
 
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showSignupOptions, setShowSignupOptions] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  const router = useRouter()
  // store logged-in user
  const [user, setUser] = useState<any>(null)

  // Check if user logged in via Google OAuth
  useEffect(() => {
    if (status === 'authenticated' && session) {
      const token = (session as any).accessToken
      const userEmail = session.user?.email
      
      if (token && userEmail) {
        console.log('✅ Google OAuth successful, storing token')
        localStorage.setItem('token', token)
        localStorage.setItem('userEmail', userEmail)
        
        toast({
          title: "Success!",
          description: "Logged in with Google",
          duration: 1500,
        })
        
        setTimeout(() => {
          router.push('/customer-panel')
        }, 500)
      }
    }
  }, [status, session, router, toast])

  // Removed auto-redirect for logged-in users - allow them to access sign-in page

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setFieldErrors({})

    // Frontend validation - field-level
    const errors: typeof fieldErrors = {}
    if (!formData.email.trim()) errors.email = "Email is required"
    if (!formData.password.trim()) errors.password = "Password is required"

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!errors.email && !emailRegex.test(formData.email)) {
      errors.email = "Please provide a valid email address"
    }
    if (!errors.password && formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters"
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Something went wrong")

      console.log('✅ Login response:', data)

      // ✅ Store only token and email (backend now returns { email, token })
      if (data.token) {
        localStorage.setItem("token", data.token)
        console.log('✅ Token stored:', data.token.substring(0, 20) + '...')
      } else {
        console.error('❌ No token in response!')
      }
      
      const emailFromResp = data.email || data.user?.email
      if (emailFromResp) {
        localStorage.setItem("userEmail", emailFromResp)
        console.log('✅ Email stored:', emailFromResp)
      } else {
        console.error('❌ No email in response!')
      }

      // Small success toast (non-blocking)
      toast({
        title: "Success!",
        description: "Login successful. Redirecting...",
        duration: 800,
      })

      // Redirect to dashboard immediately (no history manipulation)
      router.replace("/customer-panel")
    } catch (err: any) {
      setError(err.message)
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

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userEmail")
    setUser(null)
    router.push("/")
  }

  // Show login form
  return (
    <div className="flex justify-center bg-[#e9e9e9] items-center min-h-screen px-4">
      <Card className="w-full max-w-md lg:max-w-md bg-card p-7">
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
            {/* Email */}
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <User className="absolute top-6 inset-y-0 left-3 my-auto h-4 w-4 text-gray-400" />
              <Input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 border text-foreground border-primary/40 h-10 focus:border-secondary"
                required
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
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
                className="pr-10 border text-foreground border-primary/40 h-10  focus:border-secondary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-6 inset-y-0 right-3  text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-primary cursor-pointer hover:bg-primary/90 text-white rounded-lg px-2 py-5"
            >
              Sign In
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
                const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`
                window.location.href = googleAuthUrl
              }}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg py-5 flex items-center justify-center gap-3"
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

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/user-signup")}
              className="text-primary font-medium cursor-pointer hover:underline"
            >
              Sign up
            </button>
          </p>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* One Create Account Button */}
          <div className="space-y-3">
            <Button
              onClick={() => setShowSignupOptions(true)}
              className="w-full bg-secondary cursor-pointer hover:bg-secondary/90 text-white rounded-lg py-5"
            >
              Get Started (Rider or Restaurant)
            </Button>
          </div>

          {/* Signup Options Modal */}
          {showSignupOptions && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
                <h2 className="text-lg font-semibold text-center text-gray-800">
                  Select Your Account Type
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card
                    className="p-4 cursor-pointer bg-white border hover:border-secondary/50 transition"
                    onClick={() => router.push("/rider-signup")}
                  >
                    <h3 className="text-center font-medium">Rider</h3>
                  </Card>
                  <Card
                    className="p-4 cursor-pointer bg-white border hover:border-primary/50 transition"
                    onClick={() => router.push("/restaurant-signup")}
                  >
                    <h3 className="text-center font-medium">Restaurant</h3>
                  </Card>
                </div>
                <Button
                  onClick={() => setShowSignupOptions(false)}
                  className="w-full bg-secondary hover:bg-secondary/90 cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
