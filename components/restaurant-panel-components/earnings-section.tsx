"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, DownloadIcon, PoundSterlingIcon } from "lucide-react"
import { API_CONFIG } from "@/lib/api/config"

interface Transaction {
  orderId: string
  amount: number
  date: string
  status: "COMPLETED" | "PENDING" | "FAILED" | "REFUNDED"
}

interface Earnings {
  today: number
  weekly: number
  monthly: number
}

export function EarningsSection() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [earnings, setEarnings] = useState<Earnings>({ today: 0, weekly: 0, monthly: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEarnings()
    fetchTransactions()
  }, [])

  const fetchEarnings = async () => {
    try {
      const restaurantToken = localStorage.getItem('restaurantToken')
      const restaurantSlug = localStorage.getItem('restaurantSlug')
      
      if (!restaurantToken || !restaurantSlug) return

      const response = await fetch(`${API_CONFIG.BASE_URL}/restaurant/${restaurantSlug}/earnings`, {
        headers: {
          'Authorization': `Bearer ${restaurantToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setEarnings(data.earnings)
      }
    } catch (error) {
      console.error('Error fetching earnings:', error)
    }
  }

  const fetchTransactions = async () => {
    try {
      const restaurantToken = localStorage.getItem('restaurantToken')
      const restaurantSlug = localStorage.getItem('restaurantSlug')
      
      if (!restaurantToken || !restaurantSlug) return

      const response = await fetch(`${API_CONFIG.BASE_URL}/restaurant/${restaurantSlug}/transactions`, {
        headers: {
          'Authorization': `Bearer ${restaurantToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-secondary rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
          <h2 className="text-2xl font-bold font-ubuntu mb-2">EARNINGS & PAYMENTS</h2>
          <p className="text-white font-ubuntu text-sm">View your food revenue from completed orders (100% of food prices).</p>
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
              <span className="text-md font-medium text-secondary">Today's Food Revenue</span>
              <span className="text-xl font-bold text-foreground">
                £{earnings.today.toFixed(2)}
              </span>
            </div>   
            <div className="border border-primary w-12 h-12 flex justify-center items-center rounded-full">
              <PoundSterlingIcon className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="p-4 border-primary/50 bg-white">
          <CardContent className="flex justify-between items-center space-y-4">
            <div className="flex flex-col gap-2 pt-6 justify-center">
              <span className="text-md font-medium text-secondary">This Week's Revenue</span>
              <span className="text-xl font-bold text-foreground">
                £{earnings.weekly.toFixed(2)}
              </span>
            </div>   
            <div className="border border-primary w-12 h-12 flex justify-center items-center rounded-full">
              <PoundSterlingIcon className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="p-4 border-primary/50 bg-white">
          <CardContent className="flex justify-between items-center space-y-4">
            <div className="flex flex-col gap-2 pt-6 justify-center">
              <span className="text-md font-medium text-secondary">This Month's Revenue</span>
              <span className="text-xl font-bold text-foreground">
                £{earnings.monthly.toFixed(2)}
              </span>
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
          <h1 className="text-foreground  font-bold">Payment History</h1>
          <CardDescription className="text-primary">Your food revenue from completed orders (100% of food prices).</CardDescription>
          </div>
         
        </CardHeader>
        <CardContent className="mt-4">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[600px]">
              <thead className="border-b border-orange-200">
                <tr className="border border-gray-400 rounded-lg h-12 ">
                  <th className="px-2 sm:px-4 py-3 text-left text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap">Order ID</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap">Date</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap">Amount</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-foreground font-bold font-ubuntu text-xs sm:text-[16px] whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      No transactions yet
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction, index) => (
                    <tr key={index} className="">
                      <td className="px-4 py-3 text-left font-medium text-[16px] text-foreground">#{transaction.orderId}</td>
                      <td className="px-4 py-3 text-left text-[16px] text-gray-400">{formatDate(transaction.date)}</td>
                      <td className="px-4 py-3 text-left font-medium text-sm text-secondary">£{transaction.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-left">
                        <Badge
                          className={
                            transaction.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "PENDING"
                              ? "bg-amber-100 text-amber-700"
                              : transaction.status === "FAILED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
