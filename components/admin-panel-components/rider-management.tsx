"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getAdminRiders, getAdminRiderDetails } from "@/lib/api/admin.api"

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
  MapPin,
  Calendar,
  Star,
  Shield,
  CreditCard,
  Clock,
  Package,
  TrendingUp,
  FileText,
  User,
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
  const [selectedRider, setSelectedRider] = useState<any>(null);
  const [riderDialogOpen, setRiderDialogOpen] = useState(false);
  const [riderLoading, setRiderLoading] = useState(false);

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

  const viewRiderDetails = async (riderId: string) => {
    setRiderLoading(true);
    setRiderDialogOpen(true);
    try {
      const data = await getAdminRiderDetails(riderId);
      setSelectedRider(data.rider);
    } catch (err) {
      console.error("Error fetching rider details:", err);
      setSelectedRider(null);
    } finally {
      setRiderLoading(false);
    }
  };

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
                                onClick={() => viewRiderDetails(rider.id)}
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

      {/* Rider Detail Dialog */}
      <Dialog open={riderDialogOpen} onOpenChange={setRiderDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-6 overflow-y-auto  bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-ubuntu text-foreground">
              Rider Details
            </DialogTitle>
          </DialogHeader>

          {riderLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader size="md" />
            </div>
          ) : selectedRider ? (
            <div className="space-y-6">
              {/* Rider Header */}
              <div className="flex items-center gap-4 pb-4 border-b">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedRider.image || selectedRider.selfie || "/placeholder.svg"} alt={selectedRider.name} />
                  <AvatarFallback className="bg-secondary text-white text-lg">
                    {selectedRider.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-bold font-ubuntu text-foreground">{selectedRider.name}</h3>
                  <p className="text-sm text-gray-400 font-ubuntu">{selectedRider.id}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(selectedRider.status)}
                    {selectedRider.isEmailVerified ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle className="w-3 h-3 mr-1" /> Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        <XCircle className="w-3 h-3 mr-1" /> Unverified
                      </Badge>
                    )}
                    {selectedRider.deliveryPartnerAgreementAccepted && (
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        <Shield className="w-3 h-3 mr-1" /> Agreement Accepted
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <Package className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold font-ubuntu text-foreground">{selectedRider.stats?.totalDeliveries || 0}</p>
                  <p className="text-xs text-gray-500 font-ubuntu">Deliveries</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-lg font-bold font-ubuntu text-foreground">£{(selectedRider.stats?.totalEarnings || 0).toFixed(2)}</p>
                  <p className="text-xs text-gray-500 font-ubuntu">Total Earnings</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <Star className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                  <p className="text-lg font-bold font-ubuntu text-foreground">{selectedRider.stats?.avgRating || "N/A"}</p>
                  <p className="text-xs text-gray-500 font-ubuntu">Avg Rating ({selectedRider.stats?.totalRatings || 0})</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <Bike className="w-5 h-5 text-secondary mx-auto mb-1" />
                  <p className="text-lg font-bold font-ubuntu text-foreground">{selectedRider.stats?.totalOrders || 0}</p>
                  <p className="text-xs text-gray-500 font-ubuntu">Total Orders</p>
                </div>
              </div>

              {/* Contact & Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold font-ubuntu text-foreground text-sm">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="text-gray-600 font-ubuntu">{selectedRider.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="text-gray-600 font-ubuntu">{selectedRider.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-gray-600 font-ubuntu">{selectedRider.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-gray-600 font-ubuntu">Joined {selectedRider.joinDate}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold font-ubuntu text-foreground text-sm">Vehicle & Payment</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Bike className="w-4 h-4 text-primary" />
                      <span className="text-gray-600 font-ubuntu">Vehicle: {selectedRider.vehicle}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="w-4 h-4 text-primary" />
                      <span className="text-gray-600 font-ubuntu">Account: {selectedRider.accountNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="w-4 h-4 text-primary" />
                      <span className="text-gray-600 font-ubuntu">Sort Code: {selectedRider.sortCode}</span>
                    </div>
                    {selectedRider.insurance && (
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="text-gray-600 font-ubuntu">Insurance on file</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-3">
                <h4 className="font-semibold font-ubuntu text-foreground text-sm">Documents</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRider.idDocument ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <FileText className="w-3 h-3 mr-1" /> ID Document ✓
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                      <FileText className="w-3 h-3 mr-1" /> ID Document ✗
                    </Badge>
                  )}
                  {selectedRider.proofOfAddress ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <FileText className="w-3 h-3 mr-1" /> Proof of Address ✓
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                      <FileText className="w-3 h-3 mr-1" /> Proof of Address ✗
                    </Badge>
                  )}
                  {selectedRider.selfie ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <User className="w-3 h-3 mr-1" /> Selfie ✓
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                      <User className="w-3 h-3 mr-1" /> Selfie ✗
                    </Badge>
                  )}
                </div>
              </div>

              {/* Recent Orders */}
              {selectedRider.recentOrders && selectedRider.recentOrders.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold font-ubuntu text-foreground text-sm">
                    Recent Orders ({selectedRider.recentOrders.length})
                  </h4>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {selectedRider.recentOrders.map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                        <div>
                          <span className="font-medium font-ubuntu text-foreground">{order.code}</span>
                          <span className="text-gray-400 font-ubuntu ml-2">{order.restaurant}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-secondary font-ubuntu font-medium">£{order.riderPayout.toFixed(2)}</span>
                          <Badge className={`text-xs ${
                            order.status === "DELIVERED" ? "bg-green-100 text-green-800" :
                            order.status === "PICKED_UP" ? "bg-blue-100 text-blue-800" :
                            order.status === "CANCELLED" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
                          } hover:bg-opacity-80`}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Ratings */}
              {selectedRider.recentRatings && selectedRider.recentRatings.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold font-ubuntu text-foreground text-sm">Recent Ratings</h4>
                  <div className="max-h-36 overflow-y-auto space-y-2">
                    {selectedRider.recentRatings.map((rating: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < rating.score ? "text-amber-500 fill-amber-500" : "text-gray-300"}`} />
                          ))}
                          {rating.comment && <span className="text-gray-500 font-ubuntu ml-2">{rating.comment}</span>}
                        </div>
                        <span className="text-gray-400 text-xs font-ubuntu">
                          {new Date(rating.createdAt).toLocaleDateString("en-GB")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Info */}
              {(selectedRider.latitude || selectedRider.longitude) && (
                <div className="text-xs text-gray-400 font-ubuntu border-t pt-3">
                  Last known location: {selectedRider.latitude?.toFixed(4)}, {selectedRider.longitude?.toFixed(4)}
                  {selectedRider.lastLocationUpdate && (
                    <span className="ml-2">
                      (Updated: {new Date(selectedRider.lastLocationUpdate).toLocaleString("en-GB")})
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-red-500 py-8">Failed to load rider details.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
