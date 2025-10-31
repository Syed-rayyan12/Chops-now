"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Phone, Mail, MapPin, Settings, HelpCircle, LogOut, ChevronRight, CreditCard, Bell, Shield } from "lucide-react"

interface RecentOrder {
  code: string
  amount: number
  deliveredAt?: string
}

interface ProfileSectionProps {
  loading?: boolean
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string | null
  recentOrders?: RecentOrder[]
}

export function ProfileSection({
  loading = false,
  firstName,
  lastName,
  email,
  phone,
  address,
  recentOrders = [],
}: ProfileSectionProps) {
  const menuItems = [
    { icon: Settings, label: "Account Settings" },
    { icon: CreditCard, label: "Payment Methods" },
    { icon: Bell, label: "Notifications" },
    { icon: Shield, label: "Privacy & Security" },
    { icon: HelpCircle, label: "Help & Support" },
  ]

  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase()
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "-"

  return (
    <div className="p-4 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary">Profile</h1>
        <p className="text-secondary/60">Manage your account and preferences</p>
      </div>

      <Card className="border border-secondary/70">
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary" />
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/rider-avatar.png" />
                <AvatarFallback className="bg-secondary/10 text-secondary text-xl font-semibold">{initials || "R"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-secondary">{fullName}</h2>
                <p className="text-secondary/60"><span className="text-secondary">Email:</span> {email ?? "-"}</p>
                <p className="text-secondary/60"><span className="text-secondary">Phone:</span> {phone ?? "-"}</p>
                {address && (
                  <p className="text-secondary/60"><span className="text-secondary">Address:</span> {address}</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border border-secondary/70">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-secondary/60" />
            <span className="text-secondary">Recent Orders</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-4">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-gray-500">No recent orders</p>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((o) => (
                <div key={o.code} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{o.code}</p>
                    <p className="text-xs text-gray-400">{o.deliveredAt ? new Date(o.deliveredAt).toLocaleString() : "-"}</p>
                  </div>
                  <div className="text-sm font-medium">£{(o.amount ?? 0).toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border border-secondary/70">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-secondary/60" />
            <span className="text-secondary">Contact Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-secondary/60" />
            <div>
              <p className="font-medium text-secondary">{phone ?? "-"}</p>
              <p className="text-sm text-secondary/60">Primary phone</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-secondary/60" />
            <div>
              <p className="font-medium text-secondary">{email ?? "-"}</p>
              <p className="text-sm text-secondary/60">Email address</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-secondary/60" />
            <div>
              <p className="font-medium text-secondary">{address ?? "-"}</p>
              <p className="text-sm text-secondary/60">Service area</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-secondary/70">
        <CardContent className="p-0">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={index}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                aria-label={item.label}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-secondary/60" />
                  <span className="font-medium text-secondary">{item.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            )
          })}
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-transparent">
        <LogOut className="h-4 w-4 mr-2 text-secondary" />
        <span className="text-secondary">Sign Out</span>
      </Button>
    </div>
  )
}
