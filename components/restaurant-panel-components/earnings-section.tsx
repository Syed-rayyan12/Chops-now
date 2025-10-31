"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, DownloadIcon, PoundSterlingIcon } from "lucide-react"

interface Transaction {
  id: string
  orderId: string
  amount: number
  date: string
  status: "completed" | "pending"
}

export function EarningsSection() {
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      orderId: "ORD001",
      amount: 25.50,
      date: "2023-10-01",
      status: "completed"
    },
    {
      id: "2",
      orderId: "ORD002",
      amount: 18.75,
      date: "2023-10-02",
      status: "completed"
    },
    {
      id: "3",
      orderId: "ORD003",
      amount: 32.00,
      date: "2023-10-03",
      status: "pending"
    },
    {
      id: "4",
      orderId: "ORD004",
      amount: 15.25,
      date: "2023-10-04",
      status: "completed"
    },
    {
      id: "5",
      orderId: "ORD005",
      amount: 28.90,
      date: "2023-10-05",
      status: "completed"
    }
  ])
  return (
    <div className="space-y-6">
      <div className="bg-secondary rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
          <h2 className="text-2xl font-bold font-ubuntu mb-2">EARNINGS & PAYMENTS</h2>
          <p className="text-white font-ubuntu text-sm">View your earnings and payment records.</p>
          </div>
          <div>
            
            <Button variant="pdf" className="bg-transparent border border-white rounded-lg">
            <DownloadIcon/>
              Export PDF
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4 border-primary/50 bg-white">
          <CardContent className="flex justify-between items-center space-y-4">
            <div className="flex flex-col gap-2 pt-6 justify-center">
              <span className="text-md font-medium text-secondary">Today</span>
              <span className="text-xl font-bold text-foreground">£342.50</span>
            </div>   
            <div className="border border-primary w-12 h-12 flex justify-center items-center rounded-full">
              <PoundSterlingIcon className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="p-4 border-primary/50 bg-white">
          <CardContent className="flex justify-between items-center space-y-4">
            <div className="flex flex-col gap-2 pt-6 justify-center">
              <span className="text-md font-medium text-secondary">This Week</span>
              <span className="text-xl font-bold text-foreground">£342.50</span>
            </div>   
            <div className="border border-primary w-12 h-12 flex justify-center items-center rounded-full">
              <PoundSterlingIcon className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="p-4 border-primary/50 bg-white">
          <CardContent className="flex justify-between items-center space-y-4">
            <div className="flex flex-col gap-2 pt-6 justify-center">
              <span className="text-md font-medium text-secondary">This Month</span>
              <span className="text-xl font-bold text-foreground">£342.50</span>
            </div>   
            <div className="border border-primary w-12 h-12 flex justify-center items-center rounded-full">
              <PoundSterlingIcon className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/50 bg-white p-4">
        <CardHeader className="flex max-sm:flex-col max-sm:items-start max-sm:gap-3 flex-row items-center justify-between">
          <div className="flex flex-col gap-1">   
          <h1 className="text-foreground  font-bold">Transaction History</h1>
          <CardDescription className="text-primary">Stay on top of your restaurant’s finances.</CardDescription>
          </div>
         
        </CardHeader>
        <CardContent className="mt-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-orange-200">
                <tr className="border border-gray-400 rounded-lg h-12 ">
                  <th className="px-4 py-3 text-left text-foreground font-bold font-ubuntu text-[16px]">Order ID</th>
                  <th className="px-4 py-3 text-left text-foreground font-bold font-ubuntu text-[16px]">Date</th>
                  <th className="px-4 py-3 text-left text-foreground font-bold font-ubuntu text-[16px]">Amount</th>
                  <th className="px-4 py-3 text-left text-foreground font-bold font-ubuntu text-[16px]">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-primary/50">
                    <td className="px-4 py-3 text-left font-medium text-[16px] text-foreground">#{transaction.orderId}</td>
                    <td className="px-4 py-3 text-left text-[16px] text-gray-400">{transaction.date}</td>
                    <td className="px-4 py-3 text-left font-medium text-sm text-secondary">${transaction.amount}</td>
                    <td className="px-4 py-3 text-left">
                      <Badge
                        className={
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-700"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
