"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, Calendar, Clock, Target, Award } from "lucide-react"


const statsData = [
  {
    title: "Today's Total",
    value: "£52.50",
    icon: DollarSign,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "This Week",
    value: "£615.25",
    icon: TrendingUp,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Weekly Goal",
    value: "82%",
    icon: Target,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Avg/Hour",
    value: "£12.50",
    icon: Award,
    gradient: "from-orange-500 to-red-500",
  },
];

export function EarningsSection() {
  const todayEarnings = [
    { time: "09:00 - 10:00", orders: 2, earnings: "£12.50" },
    { time: "10:00 - 11:00", orders: 3, earnings: "£18.75" },
    { time: "11:00 - 12:00", orders: 1, earnings: "£6.25" },
    { time: "12:00 - 13:00", orders: 2, earnings: "£15.00" },
  ]

  const weeklyStats = [
    { day: "Monday", orders: 12, earnings: "£68.50" },
    { day: "Tuesday", orders: 15, earnings: "£82.25" },
    { day: "Wednesday", orders: 10, earnings: "£55.75" },
    { day: "Thursday", orders: 18, earnings: "£95.00" },
    { day: "Friday", orders: 22, earnings: "£125.50" },
    { day: "Saturday", orders: 25, earnings: "£142.75" },
    { day: "Sunday", orders: 8, earnings: "£45.50" },
  ]

  return (
    <div className=" space-y-6">
      <div className="mb-6 bg-secondary rounded-lg p-4">
        <h1 className="text-2xl font-bold text-white">Earnings</h1>
        <p className="text-white text-sm">Track your income and performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        {statsData.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card
              key={idx}
              className=" text-secondary  bg-white"
            >
              <CardContent className="p-4">
                <div className="flex flex-col justify-between space-x-2">
             
                    <div className="flex items-center justify-between">
                      <p className="text-[17px] text-secondary">{stat.title}</p>
                      <div className="border border-primary rounded-full flex justify-center items-center w-9 h-9">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>


      {/* Detailed Breakdown */}
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
                <p className="text-primary text-sm font-normal">View detailed sales and order trends by the hour.ers</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {todayEarnings.map((hour, index) => (
                <div key={index} className="flex items-center justify-between p-3  border border-gray-400 bg-white rounded-lg">
                  <div>
                    <p className="font-bold text-foreground">{hour.time}</p>
                    <p className="text-sm text-secondary">{hour.orders} orders completed</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{hour.earnings}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="space-y-4 ">
          <Card className="bg-white border-primary/50 p-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="flex flex-col gap-2">
                <span className="text-foreground">Daily Breakdown</span>
                <p className="text-primary text-sm font-normal">Track orders, earnings, and trends day by day.</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {weeklyStats.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-primary/50 bg-white  rounded-lg">
                  <div>
                    <p className="font-bold text-foreground">{day.day}</p>
                    <p className="text-sm text-secondary">{day.orders} orders completed</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{day.earnings}</p>
                    <p className="text-xs text-gray-400">
                      £{(Number.parseFloat(day.earnings.replace("£", "")) / day.orders).toFixed(2)}/order
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
