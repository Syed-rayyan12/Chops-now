"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAdminUsers } from "@/lib/api/admin.api"

import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
  UserPlus,
  Mail,
  Phone,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserDetailsModal } from "./user-details-modal"
import { Loader } from "@/components/ui/loader"

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  averageOrder: number;
  lastOrder: string;
  favoriteRestaurant: string;
  avatar: string | null;
  address?: string;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Badge>
      )
    case "inactive":
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          <XCircle className="w-3 h-3 mr-1" />
          Inactive
        </Badge>
      )
    case "banned":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Banned
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [tableLoading, setTableLoading] = useState(false);

  // Fetch users from API with search and status filters
  const fetchUsers = async (searchTerm?: string, statusFilter?: string) => {
    try {
      setTableLoading(true);
      setLoading(true);

      const data = await getAdminUsers({ 
        search: searchTerm, 
        status: statusFilter && statusFilter !== 'all' ? statusFilter : undefined 
      });
      
      const usersWithAddress = data.map((user: any) => ({
        ...user,
        address: "N/A", // Placeholder for address
      }));
      setUsers(usersWithAddress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setTableLoading(false);
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Effect to fetch users when debounced search or status changes
  useEffect(() => {
    fetchUsers(debouncedSearchTerm, statusFilter);
  }, [debouncedSearchTerm, statusFilter]);

  // Effect to fetch users when tab changes
  useEffect(() => {
    fetchUsers(debouncedSearchTerm, activeTab === "all" ? "all" : activeTab);
  }, [activeTab, debouncedSearchTerm]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchTerm ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const userStats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    banned: users.filter((u) => u.status === "banned").length,
    totalRevenue: users.reduce((sum, u) => sum + u.totalSpent, 0),
    avgOrderValue: users.reduce((sum, u) => sum + u.averageOrder, 0) / users.length,
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
          <h1 className="text-2xl font-bold font-ubuntu text-white">USER MANAGEMENT</h1>
          <p className="text-white text-sm mt-2 font-ubuntu">Manage customer accounts and user activity</p>
          </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-white bg-transparent  rounded-lg text-white hover:bg-white hover:text-secondary cursor-pointer">
            <Download className="w-4 h-4 mr-2" />
            Export Users
          </Button>
        </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className=" rounded-lg bg-white shadow-none">
          <CardContent className="p-4 flex gap-2 flex-col">
            <div className="text-2xl font-bold text-foreground">{userStats.total}</div>
            <div className="text-sm text-primary">Total Users</div>
          </CardContent>
        </Card>
        <Card className=" bg-white shadow-none">
          <CardContent className="p-4 flex gap-2 flex-col">
            <div className="text-2xl font-bold  text-foreground font-ubuntu">{userStats.active}</div>
            <div className="text-sm text-primary font-ubuntu">Active</div>
          </CardContent>
        </Card>
        <Card className=" bg-white shadow-none">
          <CardContent className="p-4 flex gap-2 flex-col">
            <div className="text-2xl font-bold  text-foreground font-ubuntu">{userStats.inactive}</div>
            <div className="text-sm text-primary font-ubuntu">Inactive</div>
          </CardContent>
        </Card>
        <Card className=" bg-white shadow-none">
          <CardContent className="p-4 flex gap-2 flex-col">
            <div className="text-2xl font-bold text-foreground font-ubuntu">{userStats.banned}</div>
            <div className="text-sm text-primary font-ubuntu">Banned</div>
          </CardContent>
        </Card>
        <Card className=" bg-white shadow-none">
          <CardContent className="p-4 flex gap-2 flex-col">
            <div className="text-2xl font-bold text-foreground font-ubuntu">£{userStats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-primary font-ubuntu">Total Revenue</div>
          </CardContent>
        </Card>
        <Card className=" bg-white shadow-none">
          <CardContent className="p-4 flex gap-2 flex-col">
            <div className="text-2xl font-bold text-foreground font-ubuntu">£{userStats.avgOrderValue.toFixed(2)}</div>
            <div className="text-sm text-primary font-ubuntu">Avg Order Value</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex max-sm:flex-col max-sm:gap-3 gap-3 items-center">
              <div className="relative max-sm:w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 h-4 w-4" />
                <Input
                  placeholder="Search users by name, email, phone, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 max-sm:w-full border-gray-400 bg-white cursor-pointer"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 max-sm:w-full  bg-white cursor-pointer">
                  <Filter className="w-4 h-4 mr-2 text-primary" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className=" bg-white">
                  <SelectItem value="all" className="text-foreground">All Status</SelectItem>
                  <SelectItem value="active" className="text-foreground">Active</SelectItem>
                  <SelectItem value="inactive" className="text-foreground">Inactive</SelectItem>
                  <SelectItem value="banned" className="text-foreground">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>
      {/* Filters and Search */}
      <Card className=" bg-white shadow-none">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
           
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className=" gap-2 hidden overflow-x-auto lg:flex lg:justify-between w-full text-white">
              <TabsTrigger
                value="all"
                className="text-gray-400 border border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary"
              >
                All Users
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="text-gray-400 border border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary">
                Active
              </TabsTrigger>
              <TabsTrigger
                value="inactive"
                className="text-gray-400 border border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary">
                Inactive
              </TabsTrigger>
              <TabsTrigger
                value="banned"
                className=" text-gray-400 border border-gray-400 rounded-md data-[state=active]:rounded-lg data-[state=active]:bg-[#dcfce7] data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:opacity-[15px] cursor-pointer data-[state=active]:text-primary"             >
                Banned
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
                      <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">User</TableHead>
                      <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Contact</TableHead>
                      <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Orders</TableHead>
                      <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Total Spent</TableHead>
                      <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Avg Order</TableHead>
                      <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Last Order</TableHead>
                      <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Status</TableHead>
                      <TableHead className="text-foreground font-bold font-ubuntu text-[16px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id} className="border-orange-100 hover:bg-amber-50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback className="bg-secondary text-white">
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-primary font-ubuntu">{user.name}</div>
                                <div className="text-sm text-gray-400 font-ubuntu">{user.id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm font-ubuntu text-primary/80">
                                <Mail className="w-3 h-3 mr-1" />
                                {user.email}
                              </div>
                              <div className="flex items-center text-sm font-ubuntu text-gray-400">
                                <Phone className="w-3 h-3 mr-1" />
                                {user.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-gray-400 font-ubuntu">{user.totalOrders}</TableCell>
                          <TableCell className="font-medium text-secondary font-ubuntu">£{user.totalSpent.toFixed(2)}</TableCell>
                          <TableCell className="text-gray-400 font-ubuntu">£{user.averageOrder.toFixed(2)}</TableCell>
                          <TableCell className="text-gray-400 font-ubuntu">{user.lastOrder}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                                className="hover:bg-primary "
                              >
                                <Eye className="w-4 h-4  hover:text-white" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-primary "
                                  >
                                    <MoreHorizontal className="w-4 h-4  hover:text-white" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white border border-gray-200">
                                  <DropdownMenuItem className="text-gray-700 hover:bg-gray-100 cursor-pointer focus:bg-gray-100">
                                    Update Status
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600 hover:bg-red-50 cursor-pointer focus:bg-red-50">
                                    Ban User
                                  </DropdownMenuItem>
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

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal user={selectedUser as any} isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  )
}
