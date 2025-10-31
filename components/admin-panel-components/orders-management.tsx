"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader } from "@/components/ui/loader"
import { getAdminOrders } from "@/lib/api/admin.api"

import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  ChefHat,
  MoreHorizontal,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { OrderDetailsModal } from "./order-details-modal"

// ---------- STATUS BADGES ----------
const getStatusBadge = (status: string) => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case "delivered":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Delivered
        </Badge>
      )
    case "preparing":
      return (
        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
          <ChefHat className="w-3 h-3 mr-1" />
          Preparing
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    case "ready_for_pickup":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <ChefHat className="w-3 h-3 mr-1" />
          Ready
        </Badge>
      )
    case "picked_up":
    case "out_for_delivery":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <Truck className="w-3 h-3 mr-1" />
          Out for Delivery
        </Badge>
      )
    case "cancelled":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelled
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getPaymentStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
    case "pending":
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>
    case "refunded":
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Refunded</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

// ---------- MAIN COMPONENT ----------
export function OrdersManagement() {
  const [orders, setOrders] = useState<any[]>([])
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    preparing: 0,
    ready_for_pickup: 0,
    picked_up: 0,
    out_for_delivery: 0,
    delivered: 0,
    cancelled: 0,
  })
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [searchTerm, statusFilter, activeTab])

  const fetchOrders = async () => {
    try {
      setTableLoading(true)
      if (!searchTerm && statusFilter === "all" && activeTab === "all") {
        setLoading(true)
      }

      const status = activeTab !== "all" ? activeTab : (statusFilter !== "all" ? statusFilter : undefined)
      
      const data = await getAdminOrders({
        search: searchTerm || undefined,
        status: status,
        sortBy: "createdAt",
        sortOrder: "desc",
      })

      setOrders(data.orders)
      setOrderStats(data.stats)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
      setTableLoading(false)
    }
  }

  const filteredOrders = orders

  const tabs = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "preparing", label: "Preparing" },
    { value: "ready_for_pickup", label: "Ready" },
    { value: "picked_up", label: "Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0">
        <div className="bg-secondary rounded-lg p-6 text-white w-full flex justify-between items-center">
          <div>
          <h1 className="text-2xl font-bold text-white">ORDERS MANAGEMENT</h1>
          <p className="text-white text-sm mt-2 font-ubuntu">Manage and track all customer orders</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button  className="border border-white bg-transparent text-white cursor-pointer hover:bg-secondary  rounded-lg">
              <Download className="w-4 h-4 mr-2" />
              Export Orders
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        {loading ? (
          <Card className="col-span-6 bg-white rounded-lg shadow-none">
            <CardContent className="p-8 flex justify-center items-center">
              <Loader size="md" />
            </CardContent>
          </Card>
        ) : (
          Object.entries(orderStats).map(([key, value]) => (
            <Card key={key} className=" bg-white rounded-lg shadow-none">
              <CardContent className="p-4 flex gap-2 flex-col">
                <div className="text-2xl font-bold font-ubuntu text-foreground">{value}</div>
                <div className="text-sm text-primary">{key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 max-sm:gap-3">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 h-4 w-4" />
                <Input
                  placeholder="Search orders, customers, restaurants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full bg-white border text-gray-300 border-gray-200 h-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 border-primary bg-white cursor-pointer flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white boder ">
                  <SelectItem value="all" className="text-black">All Status</SelectItem>
                  <SelectItem value="pending" className="text-black">Pending</SelectItem>
                  <SelectItem value="preparing" className="text-black">Preparing</SelectItem>
                  <SelectItem value="out-for-delivery" className="text-black">Out for Delivery</SelectItem>
                  <SelectItem value="delivered" className="text-black">Delivered</SelectItem>
                  <SelectItem value="cancelled" className="text-black">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

      {/* Filters and Search */}
      <Card className=" bg-white shadow-none w-full mx-auto">
        <CardHeader>
          {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 max-sm:gap-3">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 h-4 w-4" />
                <Input
                  placeholder="Search orders, customers, restaurants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-80  focus:border-orange-400 focus:ring-orange-400 cursor-pointer"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40  cursor-pointer flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white boder ">
                  <SelectItem value="all" className="text-black">All Status</SelectItem>
                  <SelectItem value="pending" className="text-black">Pending</SelectItem>
                  <SelectItem value="preparing" className="text-black">Preparing</SelectItem>
                  <SelectItem value="out-for-delivery" className="text-black">Out for Delivery</SelectItem>
                  <SelectItem value="delivered" className="text-black">Delivered</SelectItem>
                  <SelectItem value="cancelled" className="text-black">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div> */}
        </CardHeader>
        <CardContent className="w-full overflow-x-auto p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className=" gap-2 hidden overflow-x-auto lg:grid lg:grid-cols-6 w-full text-white">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-gray-400 border border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary min-w-[120px]"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <Table className="min-w-[700px] md:min-w-full ">
                <TableHeader>
                  <TableRow className="border border-gray-400 rounded-lg p-4">
                    <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Order ID</TableHead>
                    <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Customer</TableHead>
                    <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Restaurant</TableHead>
                    <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Amount</TableHead>
                    <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Status</TableHead>
                    <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Payment</TableHead>
                    <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Order Time</TableHead>
                    <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-64 text-center">
                        <div className="flex justify-center items-center">
                          <Loader size="lg" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-64 text-center text-gray-400">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                    <TableRow key={order.id} className="border-b border-gray-300 p-4">
                      <TableCell className="font-medium text-foreground font-ubuntu">{order.orderId}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-500 font-ubuntu">{order.customer}</div>
                          <div className="text-sm text-primary/80 font-ubuntu">{order.customerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500 font-ubuntu">{order.restaurant}</TableCell>
                      <TableCell className="text-secondary font-medium font-ubuntu">£{order.amount.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="font-ubuntu">{getPaymentStatusBadge("paid")}</TableCell>
                      <TableCell className="font-ubuntu text-gray-500">{new Date(order.time).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                            className=" hover:bg-primary"
                          >
                            <Eye className="w-4 h-4 hover:text-white" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  )
}
