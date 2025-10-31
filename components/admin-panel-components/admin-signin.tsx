"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { EyeOff, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import Toaster from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { loginAdmin } from "@/lib/api/admin.api"

export default function AdminSignIn() {
  const router = useRouter()
  const { toast } = useToast()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await loginAdmin(formData)

      if (data.token) {
        localStorage.setItem("adminToken", data.token)
        if (data.admin) {
          localStorage.setItem("adminUser", JSON.stringify(data.admin))
        }

        toast({
          title: "Admin Login Successful!",
          duration: 3000,
        })

        setTimeout(() => {
          router.push("/admin-dashboard")
        }, 3000)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#e9e9e9]  relative">
      <Toaster />

      <Card className="w-full max-w-[25%] max-sm:mx-4 p-4 bg-white">
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
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="admin@chopnow.com"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 border text-foreground border-primary/50"
                required
              />
            </div>

            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="pr-10 border text-foreground border-primary/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-6 inset-y-0 right-3 my-auto text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button type="submit" className="w-full bg-primary text-white rounded-lg px-2 py-2 cursor-pointer">
              {loading ? "Logging in..." : "Login"}
            </Button>

            {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}