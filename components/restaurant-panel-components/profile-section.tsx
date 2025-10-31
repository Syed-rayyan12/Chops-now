"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, User } from "lucide-react"

export function ProfileSection() {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    restaurantName: "Delicious Bites",
    phone: "+1 (555) 123-4567",
    email: "contact@deliciousbites.com",
    cuisine: "italian",
    address: "123 Main Street, City, State 12345",
    openTime: "09:00",
    closeTime: "22:00",
  })

  const handleUpdateProfile = () => {
    console.log("[v0] Profile updated:", profileData)
    setIsEditingProfile(false)
    alert("Profile updated successfully!")
  }

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-700">Profile Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/restaurant-owner.png" />
              <AvatarFallback className="bg-orange-100 text-orange-700 text-2xl">RO</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{profileData.restaurantName}</h3>
              <p className="text-gray-600">{profileData.email}</p>
              <p className="text-gray-600">{profileData.phone}</p>
              <Badge className="bg-orange-100 text-orange-700 capitalize">{profileData.cuisine} Cuisine</Badge>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button onClick={() => setIsEditingProfile(true)} className="bg-orange-600 hover:bg-orange-700">
              <Edit className="h-4 w-4 mr-2" />
              Update Profile
            </Button>
            <Button variant="outline">
              <User className="h-4 w-4 mr-2" />
              View Public Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {isEditingProfile && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-700">Edit Restaurant Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="restaurant-name">Restaurant Name</Label>
                <Input
                  id="restaurant-name"
                  value={profileData.restaurantName}
                  onChange={(e) => handleProfileChange("restaurantName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cuisine">Cuisine Type</Label>
                <Select value={profileData.cuisine} onValueChange={(value) => handleProfileChange("cuisine", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="italian">Italian</SelectItem>
                    <SelectItem value="american">American</SelectItem>
                    <SelectItem value="asian">Asian</SelectItem>
                    <SelectItem value="mexican">Mexican</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={profileData.address}
                onChange={(e) => handleProfileChange("address", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="open-time">Opening Time</Label>
                <Input
                  id="open-time"
                  type="time"
                  value={profileData.openTime}
                  onChange={(e) => handleProfileChange("openTime", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="close-time">Closing Time</Label>
                <Input
                  id="close-time"
                  type="time"
                  value={profileData.closeTime}
                  onChange={(e) => handleProfileChange("closeTime", e.target.value)}
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <Button onClick={handleUpdateProfile} className="bg-orange-600 hover:bg-orange-700">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
