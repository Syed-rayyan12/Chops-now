"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAdminRiders } from "@/lib/api/admin.api"

import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
  Mail,
  Phone,
  Bike,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader } from "@/components/ui/loader"

interface Rider {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  joinDate: string;
  totalDeliveries: number;
  earnings: number;
  lastDelivery: string;
  avatar: string | null;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "online":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Online
        </Badge>
      )
    case "offline":
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          <XCircle className="w-3 h-3 mr-1" />
          Offline
        </Badge>
      )
    case "busy":
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Busy
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function RiderManagement() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [tableLoading, setTableLoading] = useState(false);

  // Fetch riders from API
  const fetchRiders = async (searchTerm?: string, statusFilter?: string) => {
    try {
      setTableLoading(true);
      setLoading(true);

      const data = await getAdminRiders({ 
        search: searchTerm, 
        status: statusFilter && statusFilter !== 'all' ? statusFilter : undefined 
      });
      
      setRiders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch riders');
    } finally {
      setTableLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchRiders(debouncedSearchTerm, statusFilter);
  }, [debouncedSearchTerm, statusFilter]);

  useEffect(() => {
    fetchRiders(debouncedSearchTerm, activeTab === "all" ? "all" : activeTab);
  }, [activeTab, debouncedSearchTerm]);

  const riderStats = {
    total: riders.length,
    online: riders.filter((r) => r.status === "online").length,
    offline: riders.filter((r) => r.status === "offline").length,
    busy: riders.filter((r) => r.status === "busy").length,
    totalDeliveries: riders.reduce((sum, r) => sum + r.totalDeliveries, 0),
    totalEarnings: riders.reduce((sum, r) => sum + r.earnings, 0),
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex max-sm:flex-col max-sm:gap-4 max-sm:items-start items-center justify-between">
        <div className="bg-secondary rounded-lg p-6 text-white w-full flex justify-between items-center">
          <div className="">
            <h1 className="text-2xl font-bold font-ubuntu text-white">RIDER MANAGEMENT</h1>
            <p className="text-white text-sm mt-2 font-ubuntu">Manage delivery riders and their performance</p>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" className="border-white bg-transparent rounded-lg text-white hover:bg-white hover:text-secondary cursor-pointer">
              <Download className="w-4 h-4 mr-2" />
              Export Riders
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="rounded-lg bg-white shadow-none">
          <CardContent className="p-4 flex gap-2 flex-col">
            <div className="text-2xl font-bold text-foreground">{riderStats.total}</div>
            <div className="text-sm text-primary">Total Riders</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-none">
          <CardContent className="p-4 flex gap-2 flex-col">
            <div className="text-2xl font-bold text-foreground font-ubuntu">{riderStats.online}</div>
            <div className="text-sm text-green-600 font-ubuntu">Online</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-none">
          <CardContent className="p-4 flex gap-2 flex-col">
            <div className="text-2xl font-bold text-foreground font-ubuntu">{riderStats.busy}</div>
            <div className="text-sm text-amber-600 font-ubuntu">Busy</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-none">
          <CardContent className="p-4 flex gap-2 flex-col">
            <div className="text-2xl font-bold text-foreground font-ubuntu">{riderStats.offline}</div>
            <div className="text-sm text-gray-600 font-ubuntu">Offline</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-none">
          <CardContent className="p-4 flex gap-2 flex-col">
            <div className="text-2xl font-bold text-foreground font-ubuntu">{riderStats.totalDeliveries}</div>
            <div className="text-sm text-primary font-ubuntu">Total Deliveries</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-none">
          <CardContent className="p-4 flex gap-2 flex-col">
            <div className="text-2xl font-bold text-foreground font-ubuntu">£{riderStats.totalEarnings.toLocaleString()}</div>
            <div className="text-sm text-primary font-ubuntu">Total Earnings</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex max-sm:flex-col max-sm:gap-3 gap-3 items-center">
        <div className="relative max-sm:w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 h-4 w-4" />
          <Input
            placeholder="Search riders by name, email, phone, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-80 max-sm:w-full border-gray-400 bg-white cursor-pointer"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 max-sm:w-full bg-white cursor-pointer">
            <Filter className="w-4 h-4 mr-2 text-primary" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all" className="text-foreground">All Status</SelectItem>
            <SelectItem value="online" className="text-foreground">Online</SelectItem>
            <SelectItem value="busy" className="text-foreground">Busy</SelectItem>
            <SelectItem value="offline" className="text-foreground">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white shadow-none">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="gap-2 hidden overflow-x-auto lg:flex lg:justify-between w-full text-white">
              <TabsTrigger
                value="all"
                className="text-gray-400 border border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary"
              >
                All Riders
              </TabsTrigger>
              <TabsTrigger
                value="online"
                className="text-gray-400 border border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary">
                Online
              </TabsTrigger>
              <TabsTrigger
                value="busy"
                className="text-gray-400 border border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary">
                Busy
              </TabsTrigger>
              <TabsTrigger
                value="offline"
                className="text-gray-400 border border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary"
              >
                Offline
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {tableLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader size="md" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border border-gray-400 rounded-lg p-4">
                      <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Rider</TableHead>
                      <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Deliveries</TableHead>
                      <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Earnings</TableHead>
                      <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Status</TableHead>
                      <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {riders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No riders found
                        </TableCell>
                      </TableRow>
                    ) : (
                      riders.map((rider) => (
                        <TableRow key={rider.id} className="border-orange-100 hover:bg-amber-50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={rider.avatar || "/placeholder.svg"} alt={rider.name} />
                                <AvatarFallback className="bg-secondary text-white">
                                  {rider.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-primary font-ubuntu">{rider.name}</div>
                                <div className="text-sm text-gray-400 font-ubuntu">{rider.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-gray-400 font-ubuntu">{rider.totalDeliveries}</TableCell>
                          <TableCell className="font-medium text-secondary font-ubuntu">£{rider.earnings.toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(rider.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-primary"
                              >
                                <Eye className="w-4 h-4 hover:text-white" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-primary"
                                  >
                                    <MoreHorizontal className="w-4 h-4 hover:text-white" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>Send Message</DropdownMenuItem>
                                  <DropdownMenuItem>View Delivery History</DropdownMenuItem>
                                  <DropdownMenuItem>Update Status</DropdownMenuItem>
                                  <DropdownMenuItem>View Documents</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">Suspend Rider</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
