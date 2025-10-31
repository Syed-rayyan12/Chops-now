"use client"

import { Home, Package, DollarSign, User } from "lucide-react"

interface RiderBottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function RiderBottomNav({ activeTab, onTabChange }: RiderBottomNavProps) {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "orders", label: "Orders", icon: Package },
    { id: "earnings", label: "Earnings", icon: DollarSign },
    { id: "profile", label: "Profile", icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive ? "text-secondary bg-secondary/10" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
