"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Star, Download, Filter } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts"
import { CalendarDateRangePicker } from "./date-range-picker"
import { RecentSales } from "./recent-sales"

const revenueData = [
  { name: "Jan", revenue: 45000, orders: 1200, users: 850 },
  { name: "Feb", revenue: 52000, orders: 1400, users: 920 },
  { name: "Mar", revenue: 48000, orders: 1300, users: 890 },
  { name: "Apr", revenue: 61000, orders: 1650, users: 1100 },
  { name: "May", revenue: 55000, orders: 1500, users: 1050 },
  { name: "Jun", revenue: 67000, orders: 1800, users: 1200 },
  { name: "Jul", revenue: 72000, orders: 1950, users: 1350 },
  { name: "Aug", revenue: 69000, orders: 1850, users: 1300 },
  { name: "Sep", revenue: 78000, orders: 2100, users: 1450 },
  { name: "Oct", revenue: 82000, orders: 2200, users: 1500 },
  { name: "Nov", revenue: 89000, orders: 2400, users: 1650 },
  { name: "Dec", revenue: 95000, orders: 2550, users: 1750 },
]

const categoryData = [
  { name: "African Cuisine", value: 45, color: "#014421" },
  { name: "Indian Cuisine", value: 25, color: "#0F3D2E" },
  { name: "Fast Food", value: 15, color: "#222222" },
  { name: "Desserts", value: 10, color: "#92400e" },
  { name: "Beverages", value: 5, color: "#78350f" },
]

const restaurantPerformance = [
  { name: "Udupi Kitchen", orders: 450, revenue: 12500, rating: 4.8 },
  { name: "African Delights", orders: 380, revenue: 11200, rating: 4.7 },
  { name: "Spice Garden", orders: 320, revenue: 9800, rating: 4.6 },
  { name: "Curry House", orders: 290, revenue: 8900, rating: 4.5 },
  { name: "Jollof Palace", orders: 250, revenue: 7800, rating: 4.4 },
]

const hourlyOrders = [
  { hour: "6AM", orders: 12 },
  { hour: "7AM", orders: 25 },
  { hour: "8AM", orders: 45 },
  { hour: "9AM", orders: 35 },
  { hour: "10AM", orders: 28 },
  { hour: "11AM", orders: 42 },
  { hour: "12PM", orders: 85 },
  { hour: "1PM", orders: 95 },
  { hour: "2PM", orders: 78 },
  { hour: "3PM", orders: 52 },
  { hour: "4PM", orders: 38 },
  { hour: "5PM", orders: 48 },
  { hour: "6PM", orders: 72 },
  { hour: "7PM", orders: 88 },
  { hour: "8PM", orders: 92 },
  { hour: "9PM", orders: 75 },
  { hour: "10PM", orders: 45 },
  { hour: "11PM", orders: 25 },
]


const stats = [
  {
    title: "Total Revenue",
    value: "£89,420",
    change: "+12.5% from last month",
    icon: DollarSign,
    iconColor: "text-amber-600",
    changeColor: "text-green-600",
    trend: TrendingUp,
  },
  {
    title: "Total Orders",
    value: "2,547",
    change: "+8.2% from last month",
    icon: ShoppingCart,
    iconColor: "text-amber-600",
    changeColor: "text-green-600",
    trend: TrendingUp,
  },
  {
    title: "Active Users",
    value: "1,750",
    change: "+15.3% from last month",
    icon: Users,
    iconColor: "text-amber-600",
    changeColor: "text-green-600",
    trend: TrendingUp,
  },
  {
    title: "Avg. Order Value",
    value: "£35.12",
    change: "-2.1% from last month",
    icon: DollarSign,
    iconColor: "text-amber-600",
    changeColor: "text-red-600",
    trend: TrendingDown,
  },
];

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState("30d")
  const [activeLabel, setActiveLabel] = useState<string | null>(null)
  const tabsListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (tabsListRef.current) {
      console.log("TabsList width:", tabsListRef.current.offsetWidth)
      console.log("TabsList parent width:", tabsListRef.current.parentElement?.offsetWidth)
    }
  }, [])

  return (
    <>
     
      <div className="space-y-4">
        {/* Header Controls */}
        <div className="bg-secondary rounded-lg p-6 text-white w-full flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">ANALYTICS</h1>
          <p className="text-white text-sm mt-2 font-ubuntu">Manage partner restaurants and their performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-white bg-transparent  rounded-lg text-white hover:bg-white hover:text-secondary cursor-pointer">
            <Download className="w-4 h-4 mr-2" />
            Export Orders
          </Button>
        </div>
      </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <TabsTrigger value="restaurants" className="w-full text-gray-400 border bg-white border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary min-w-[120px]">Restaurants</TabsTrigger>
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
                        label: "Revenue",
                        color: "#",
                      },
                      orders: {
                        label: "Orders",
                        color: "#",
                      },
                    }}
                    className="h-[300px] w-[100%]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={revenueData}
                        onMouseMove={(e) => setActiveLabel(e.activeLabel || null)}
                        onMouseLeave={() => setActiveLabel(null)}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" axisLine={{ stroke: 'hsl(var(--secondary))', strokeDasharray: '3 3' }} />
                        {/* <YAxis axisLine={{ stroke: '#F47A20', strokeDasharray: '4 3' }} /> */}
                        <ChartTooltip content={<ChartTooltipContent />} cursor={{ stroke: '#F47A20', strokeDasharray: '3 3', strokeWidth: 2 }} />
                        {activeLabel !== null && (
                          <ReferenceLine x={activeLabel} stroke="#0F3D2E" strokeDasharray="3 3" />
                        )}
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stackId="1"
                          stroke="#F47A20"
                          fill="#fff"
                          dot={{ fill: 'none', stroke: '#F47A20', strokeWidth: 2, r: 4 }}

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
                      label: "Revenue",
                      color: "#",
                    },
                    orders: {
                      label: "Orders",
                      color: "#",
                    },
                  }}
                  className="h-[400px] w-[100%]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={revenueData}
                      onMouseMove={(e) => setActiveLabel(e.activeLabel || null)}
                      onMouseLeave={() => setActiveLabel(null)}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} cursor={{ stroke: '#F47A20', strokeWidth: 2 }} />
                      {activeLabel !== null && (
                          <ReferenceLine x={activeLabel} stroke="#0D713C" strokeDasharray="3 3" />
                        )}
                      {/* <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#F47A20"
                        strokeWidth={4}
                        dot={false}
                      /> */}
                      <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#F47A20"
                        strokeWidth={4}
                     
                        dot={false}
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
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="orders" barSize={25} activeBar={false}>
                        {revenueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#F47A20" : "#0F3D2E"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="restaurants" className="space-y-4">
            <Card className=" bg-white p-4">
              <CardHeader>
                <CardTitle className="text-foreground font-bold font-ubuntu">Restaurant Performance</CardTitle>
                <CardDescription className="text-primary">Top performing restaurants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3">
                  <table className="w-full">
                    <tbody>
                      {restaurantPerformance.map((restaurant, index) => (
                        <tr key={restaurant.name} className="border-b border-gray-400">
                          <td className="flex items-center gap-2 pr-4  py-4">
                            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold text-white">#{index + 1}</span>
                            </div>
                            <p className="font-medium text-[17px] text-primary">{restaurant.name}</p>
                          </td>

                          <td className="pl-4 pr-4 text-center py-4">
                            <div className="flex items-center justify-center space-x-1">
                              <Star className="h-4 w-4 fill-current text-secondary" />
                              <span className="text-secondary">{restaurant.rating}</span>
                            </div>
                          </td>
                          <td className="pl-4 pr-4 text-right py-4">
                            <p className="font-medium text-[16px] text-gray-400">£{restaurant.revenue.toLocaleString()}</p>
                          </td>
                          <td className="pl-4 pr-4 text-right py-4">
                            <p className="text-sm text-secondary">{restaurant.orders} orders</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card className="bg-white p-4">
              <CardHeader>
                <CardTitle className="text-foreground font-bold font-ubuntu">User Growth</CardTitle>
                <CardDescription className="text-primary">User acquisition and retention</CardDescription>
              </CardHeader>
              <CardContent className="">
                <ChartContainer
                  config={{
                    users: {
                      label: "Users",
                      color: "#",
                    },
                  }}
                  className="h-[400px] w-[100%] pt-4"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={revenueData}
                      onMouseMove={(e) => setActiveLabel(e.activeLabel || null)}
                      onMouseLeave={() => setActiveLabel(null)}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      {activeLabel !== null && (
                        <ReferenceLine x={activeLabel} stroke="#0D713C" strokeDasharray="4 3" />
                      )}
                      <Area type="monotone" dataKey="users" stroke="#0F3D2E" fill="none" />
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
