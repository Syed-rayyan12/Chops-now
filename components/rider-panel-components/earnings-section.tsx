"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp } from "lucide-react"
import { logger } from "@/lib/logger";

interface Earnings {
  today: number
  thisWeek: number
}

interface HourBucket {
  hour: number
  label: string
  orders: number
  earnings: number
}

interface DayBucket {
  day: string
  date: string
  orders: number
  earnings: number
  avgPerOrder: number
}

interface EarningsResponse {
  earnings: Earnings
  todayBreakdown: HourBucket[]
  weekBreakdown: DayBucket[]
}

const statsData = [
  { title: "Today's Total", icon: DollarSign, key: 'today' as const },
  { title: "This Week", icon: TrendingUp, key: 'thisWeek' as const },
];

export function EarningsSection() {
  const [earnings, setEarnings] = useState<Earnings>({ today: 0, thisWeek: 0 })
  const [todayBreakdown, setTodayBreakdown] = useState<HourBucket[]>([])
  const [weekBreakdown, setWeekBreakdown] = useState<DayBucket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEarnings()
  }, [])

  const fetchEarnings = async () => {
    try {
      const riderToken = localStorage.getItem('riderToken')
      if (!riderToken) return

      const { apiRequest } = await import("@/lib/api/client")
      const { STORAGE_KEYS } = await import("@/lib/api/config")
      const data = await apiRequest<EarningsResponse>("/rider/earnings", {
        tokenKey: STORAGE_KEYS.RIDER_TOKEN,
      })
      setEarnings(data.earnings)
      setTodayBreakdown(data.todayBreakdown || [])
      setWeekBreakdown(data.weekBreakdown || [])
    } catch (error) {
      logger.error('Error fetching earnings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatValue = (key: 'today' | 'thisWeek') => {
    if (loading) return "£0.00"
    return `£${earnings[key].toFixed(2)}`
  }

  return (
    <div className=" space-y-6">
      <div className="mb-6 bg-secondary rounded-lg p-4">
        <h1 className="text-2xl font-bold text-white">Earnings</h1>
        <p className="text-white text-sm">Track your income and performance</p>
      </div>

      {/* Summary Cards - live totals from /rider/earnings */}
      <div className="grid grid-cols-2 gap-4">
        {statsData.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className=" text-secondary  bg-white">
              <CardContent className="p-4">
                <div className="flex flex-col justify-between space-x-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[17px] text-secondary">{stat.title}</p>
                      <div className="border border-primary rounded-full flex justify-center items-center w-9 h-9">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{getStatValue(stat.key)}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Breakdown - wired to real completed-delivery earnings */}
      <Tabs defaultValue="today" className="space-y-4 rounded-lg">
        <TabsList className="gap-2 hidden overflow-x-auto lg:flex lg:justify-between w-full text-white">
          <TabsTrigger className="text-gray-400 border bg-white border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary" value="today">Today</TabsTrigger>
          <TabsTrigger className="text-gray-400 border bg-white border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary" value="week">This Week</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4 ">
          <Card className="p-4 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="flex flex-col gap-2">
                <span className="text-foreground font-bold">Hourly Breakdown</span>
                <p className="text-primary text-sm font-normal">Completed deliveries and earnings by the hour.</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {loading ? (
                <p className="text-center py-8 text-gray-400">Loading…</p>
              ) : todayBreakdown.length === 0 ? (
                <p className="text-center py-8 text-gray-400">No completed deliveries yet today</p>
              ) : (
                todayBreakdown.map((hour) => (
                  <div key={hour.hour} className="flex items-center justify-between p-3  border border-gray-400 bg-white rounded-lg">
                    <div>
                      <p className="font-bold text-foreground">{hour.label}</p>
                      <p className="text-sm text-secondary">{hour.orders} {hour.orders === 1 ? "order" : "orders"} completed</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">£{hour.earnings.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="space-y-4 ">
          <Card className="bg-white border-primary/50 p-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="flex flex-col gap-2">
                <span className="text-foreground">Daily Breakdown</span>
                <p className="text-primary text-sm font-normal">Completed deliveries and earnings day by day.</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {loading ? (
                <p className="text-center py-8 text-gray-400">Loading…</p>
              ) : weekBreakdown.every((d) => d.orders === 0) ? (
                <p className="text-center py-8 text-gray-400">No completed deliveries in the last 7 days</p>
              ) : (
                weekBreakdown.map((day) => (
                  <div key={day.date} className="flex items-center justify-between p-3 border border-primary/50 bg-white  rounded-lg">
                    <div>
                      <p className="font-bold text-foreground">{day.day}</p>
                      <p className="text-sm text-secondary">{day.orders} {day.orders === 1 ? "order" : "orders"} completed</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">£{day.earnings.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">£{day.avgPerOrder.toFixed(2)}/order</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
