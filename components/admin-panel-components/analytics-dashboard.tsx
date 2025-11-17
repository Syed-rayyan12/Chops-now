"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Download } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts"
import { RecentSales } from "./recent-sales"
import { getAdminAnalytics, type AnalyticsResponse } from "@/lib/api/admin.api"

export function AnalyticsDashboard() {
  const [activeLabel, setActiveLabel] = useState<string | null>(null)
  const tabsListRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const data = await getAdminAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error("Failed to load analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const stats = analytics ? [
    {
      title: "Total Revenue",
      value: `£${analytics.stats.totalRevenue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: analytics.stats.revenueChange,
      icon: DollarSign,
      iconColor: "text-amber-600",
      changeColor: analytics.stats.revenueChange.startsWith('+') ? "text-green-600" : "text-red-600",
      trend: analytics.stats.revenueChange.startsWith('+') ? TrendingUp : TrendingDown,
    },
    {
      title: "Total Orders",
      value: analytics.stats.totalOrders.toLocaleString(),
      change: analytics.stats.ordersChange,
      icon: ShoppingCart,
      iconColor: "text-amber-600",
      changeColor: analytics.stats.ordersChange.startsWith('+') ? "text-green-600" : "text-red-600",
      trend: analytics.stats.ordersChange.startsWith('+') ? TrendingUp : TrendingDown,
    },
    {
      title: "Active Users",
      value: analytics.stats.activeUsers.toLocaleString(),
      change: analytics.stats.usersChange,
      icon: Users,
      iconColor: "text-amber-600",
      changeColor: analytics.stats.usersChange.startsWith('+') ? "text-green-600" : "text-red-600",
      trend: analytics.stats.usersChange.startsWith('+') ? TrendingUp : TrendingDown,
    },
  ] : []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-secondary"></div>
          <p className="mt-4 text-lg font-medium text-secondary">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-lg text-muted-foreground">Failed to load analytics data</p>
      </div>
    )
  }

  return (
    <>
     
      <div className="space-y-4">
        {/* Header Controls */}
        <div className="bg-secondary rounded-lg p-6 text-white w-full flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">ANALYTICS</h1>
            <p className="text-white text-sm mt-2 font-ubuntu">Real-time insights and performance metrics</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="border-white bg-transparent rounded-lg text-white hover:bg-white hover:text-secondary cursor-pointer">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const Trend = stat.trend;

            return (


              <Card key={index} className=" p-4 bg-white ">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-secondary">
                    {stat.title}
                  </CardTitle>
                 <div className="border border-primary rounded-full flex justify-center w-10 h-10 items-center">
                  <Icon className={`h-5 w-5 text-primary ${stat.iconColor}`} />
                 </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className={`flex items-center text-xs ${stat.changeColor}`}>
                    <Trend className="mr-1 h-3 w-3" />
                    {stat.change}
                  </div>
                </CardContent>
              </Card>

            );
          })}
        </div>

        {/* Charts and Analytics */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList ref={tabsListRef} className="gap-2 flex w-full text-white">
            <TabsTrigger value="overview" className="w-full text-gray-400 border bg-white border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary min-w-[120px]">Overview</TabsTrigger>
            <TabsTrigger value="revenue" className="w-full text-gray-400 border bg-white border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary min-w-[120px]">Revenue</TabsTrigger>
            <TabsTrigger value="orders" className="w-full text-gray-400 border bg-white border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary min-w-[120px]">Orders</TabsTrigger>
            <TabsTrigger value="users" className="w-full text-gray-400 border bg-white border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary min-w-[120px]">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="flex justify-between gap-4 max-sm:flex-col">
              <Card className="w-full bg-white  p-4 ">
                <CardHeader>
                  <CardTitle className="text-foreground">Revenue Overview</CardTitle>
                  <CardDescription className="text-primary">Monthly revenue and order trends</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 max-sm:pl-0 overflow-hidden">
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Revenue (£)",
                        color: "#F47A20",
                      },
                    }}
                    className="h-[300px] w-[100%]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={analytics.revenueData}
                        onMouseMove={(e) => setActiveLabel(e.activeLabel || null)}
                        onMouseLeave={() => setActiveLabel(null)}
                        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F47A20" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#F47A20" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#6b7280"
                          fontSize={12}
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="#6b7280"
                          fontSize={12}
                          tickLine={false}
                          tickFormatter={(value) => `£${value.toLocaleString()}`}
                        />
                        <ChartTooltip 
                          content={<ChartTooltipContent />} 
                          cursor={{ stroke: '#F47A20', strokeDasharray: '3 3', strokeWidth: 2 }} 
                        />
                        {activeLabel !== null && (
                          <ReferenceLine x={activeLabel} stroke="#0F3D2E" strokeDasharray="3 3" />
                        )}
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#F47A20"
                          strokeWidth={3}
                          fill="url(#colorRevenue)"
                          dot={{ fill: '#F47A20', stroke: '#F47A20', strokeWidth: 2, r: 5 }}
                          activeDot={{ r: 7, fill: '#F47A20' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="w-full  p-4 bg-white">
                <CardHeader>
                  <CardTitle className="text-foreground">Recent Activity</CardTitle>
                  <CardDescription className="text-primary">Latest orders and transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
              {/* <Card className="w-full bg-white ">
                <CardHeader className="text-center">
                  <CardTitle className="text-primary">Order Categories</CardTitle>
                  <CardDescription className="text-foreground/80">Distribution by cuisine type</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  <ChartContainer
                    config={{
                      value: {
                        label: "Percentage",
                      },
                    }}
                    className="h-[300px] w-full flex flex-col items-center justify-center"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="40%" // move pie slightly up to give space for legend
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip
                          contentStyle={{ textAlign: "center" }}
                          content={<ChartTooltipContent />}
                        />
                        <Legend
                          layout="horizontal"
                          align="center"
                          verticalAlign="bottom"
                          wrapperStyle={{ marginTop: 20 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card> */}
            </div>

            <div className="flex gap-4 justify-between max-sm:flex-col">
              {/* <Card className=" w-full bg-white ">
                <CardHeader>
                  <CardTitle className="text-primary">Hourly Order Pattern</CardTitle>
                  <CardDescription className="text-foreground/80">Orders throughout the day</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      orders: {
                        label: "Orders",
                        color: "#014421",
                      },
                    }}
                    className="h-[200px] w-[100%]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hourlyOrders}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis axisLine={{ stroke: '#F47A20', strokeDasharray: '3 3' }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="orders" fill="#014421" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card> */}

           
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <Card className=" bg-white p-4">
              <CardHeader>
                <CardTitle className="text-foreground font-bold font-ubuntu">Revenue Analytics</CardTitle>
                <CardDescription className="text-primary">Detailed revenue breakdown and trends</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Revenue (£)",
                      color: "#F47A20",
                    },
                  }}
                  className="h-[400px] w-[100%]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analytics.revenueData}
                      onMouseMove={(e) => setActiveLabel(e.activeLabel || null)}
                      onMouseLeave={() => setActiveLabel(null)}
                      margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        tickFormatter={(value) => `£${value.toLocaleString()}`}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent />} 
                        cursor={{ stroke: '#F47A20', strokeWidth: 2, strokeDasharray: '5 5' }} 
                      />
                      {activeLabel !== null && (
                        <ReferenceLine x={activeLabel} stroke="#0F3D2E" strokeDasharray="3 3" strokeWidth={2} />
                      )}
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#F47A20"
                        strokeWidth={3}
                        dot={{ fill: '#F47A20', r: 4 }}
                        activeDot={{ r: 6, fill: '#F47A20', stroke: '#fff', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card className=" p-4 bg-white">
              <CardHeader>
                <CardTitle className="text-foreground font-bold font-ubuntu">Order Analytics</CardTitle>
                <CardDescription className="text-primary">Order volume and patterns</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ChartContainer
                  config={{
                    orders: {
                      label: "Orders",
                      color: "#F47A20",
                    },
                  }}
                  className="h-[400px] w-[100%]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={analytics.revenueData}
                      margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        label={{ value: 'Orders', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent />} 
                        cursor={{ fill: 'rgba(244, 122, 32, 0.1)' }}
                      />
                      <Bar 
                        dataKey="orders" 
                        radius={[8, 8, 0, 0]}
                        maxBarSize={50}
                      >
                        {analytics.revenueData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index % 2 === 0 ? "#F47A20" : "#0F3D2E"} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card className="bg-white p-4">
              <CardHeader>
                <CardTitle className="text-foreground font-bold font-ubuntu">User Growth</CardTitle>
                <CardDescription className="text-primary">User acquisition and retention</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ChartContainer
                  config={{
                    users: {
                      label: "Active Users",
                      color: "#0F3D2E",
                    },
                  }}
                  className="h-[400px] w-[100%]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={analytics.revenueData}
                      onMouseMove={(e) => setActiveLabel(e.activeLabel || null)}
                      onMouseLeave={() => setActiveLabel(null)}
                      margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0F3D2E" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0F3D2E" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        label={{ value: 'Users', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent />} 
                        cursor={{ stroke: '#0F3D2E', strokeDasharray: '3 3', strokeWidth: 2 }}
                      />
                      {activeLabel !== null && (
                        <ReferenceLine x={activeLabel} stroke="#0F3D2E" strokeDasharray="3 3" strokeWidth={2} />
                      )}
                      <Area 
                        type="monotone" 
                        dataKey="users" 
                        stroke="#0F3D2E" 
                        strokeWidth={3}
                        fill="url(#colorUsers)" 
                        dot={{ fill: '#0F3D2E', r: 4 }}
                        activeDot={{ r: 6, fill: '#0F3D2E', stroke: '#fff', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
