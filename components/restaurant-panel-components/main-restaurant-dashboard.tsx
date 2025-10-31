// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import {
//   Bell,
//   ChefHat,
//   Clock,
//   CreditCard,
//   DollarSign,
//   HelpCircle,
//   Home,
//   Menu,
//   Package,
//   Search,
//   ShoppingCart,
//   Star,
//   TrendingUp,
//   User,
//   X,
//   Check,
//   Eye,
//   Edit,
//   Trash2,
//   Plus,
//   Download,
//   Reply,
//   CheckCircle,
//   CircleX,
// } from "lucide-react"

// type OrderStatus = "pending" | "in-progress" | "completed" | "cancelled"
// type NotificationStatus = "unread" | "read"

// interface Order {
//   id: string
//   items: string[]
//   customerName: string
//   totalPrice: number
//   time: string
//   status: OrderStatus
// }

// interface MenuItem {
//   id: string
//   name: string
//   category: string
//   price: number
//   available: boolean
//   image: string
// }

// interface Review {
//   id: string
//   customerName: string
//   rating: number
//   comment: string
//   date: string
//   replied: boolean
// }

// interface Transaction {
//   id: string
//   orderId: string
//   amount: number
//   date: string
//   status: "completed" | "pending"
// }

// interface Notification {
//   id: string
//   type: "order" | "stock" | "payout"
//   message: string
//   time: string
//   status: NotificationStatus
// }

// export default function MainRestaurantDashboard() {
//   const [activeSection, setActiveSection] = useState("overview")
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
//   const [activeOrderTab, setActiveOrderTab] = useState("new")
//   const [showAddMenuItem, setShowAddMenuItem] = useState(false)
//   const [isEditingProfile, setIsEditingProfile] = useState(false)
//   const [restaurantData, setRestaurantData] = useState<any>(null)
//   const [profileData, setProfileData] = useState({
//     restaurantName: "",
//     phone: "",
//     email: "",
//     cuisine: "italian",
//     address: "",
//     openTime: "09:00",
//     closeTime: "22:00",
//   })

//   useEffect(() => {
//     // Load restaurant data from localStorage
//     const storedRestaurant = localStorage.getItem("restaurant")
//     const storedUser = localStorage.getItem("user")

//     if (storedRestaurant) {
//       const restaurant = JSON.parse(storedRestaurant)
//       setRestaurantData(restaurant)
//       setProfileData({
//         restaurantName: restaurant.name || "",
//         phone: restaurant.phone || "",
//         email: storedUser ? JSON.parse(storedUser).email : "",
//         cuisine: "italian",
//         address: restaurant.address || "",
//         openTime: "09:00",
//         closeTime: "22:00",
//       })
//     }
//   }, [])

//   const [orders] = useState<Order[]>([
//     {
//       id: "ORD001",
//       items: ["Margherita Pizza", "Caesar Salad"],
//       customerName: "John Doe",
//       totalPrice: 28.5,
//       time: "10:30 AM",
//       status: "pending",
//     },
//     {
//       id: "ORD002",
//       items: ["Chicken Burger", "Fries"],
//       customerName: "Jane Smith",
//       totalPrice: 15.99,
//       time: "10:45 AM",
//       status: "in-progress",
//     },
//     {
//       id: "ORD003",
//       items: ["Pasta Carbonara"],
//       customerName: "Mike Johnson",
//       totalPrice: 18.75,
//       time: "11:00 AM",
//       status: "completed",
//     },
//   ])

//   const [menuItems, setMenuItems] = useState<MenuItem[]>([
//     {
//       id: "1",
//       name: "Margherita Pizza",
//       category: "Pizza",
//       price: 16.99,
//       available: true,
//       image: "/margherita-pizza.png",
//     },
//     {
//       id: "2",
//       name: "Chicken Burger",
//       category: "Burgers",
//       price: 12.99,
//       available: true,
//       image: "/delicious-chicken-burger.png",
//     },
//     {
//       id: "3",
//       name: "Caesar Salad",
//       category: "Salads",
//       price: 11.5,
//       available: false,
//       image: "/caesar-salad.png",
//     },
//   ])

//   const [reviews] = useState<Review[]>([
//     {
//       id: "1",
//       customerName: "Alice Brown",
//       rating: 5,
//       comment: "Amazing food and fast delivery!",
//       date: "2024-01-15",
//       replied: false,
//     },
//     {
//       id: "2",
//       customerName: "Bob Wilson",
//       rating: 4,
//       comment: "Good quality, will order again.",
//       date: "2024-01-14",
//       replied: true,
//     },
//   ])

//   const [transactions] = useState<Transaction[]>([
//     { id: "TXN001", orderId: "ORD001", amount: 28.5, date: "2024-01-15", status: "completed" },
//     { id: "TXN002", orderId: "ORD002", amount: 15.99, date: "2024-01-15", status: "pending" },
//   ])

//   const [notifications, setNotifications] = useState<Notification[]>([
//     { id: "1", type: "order", message: "New order received from John Doe", time: "2 min ago", status: "unread" },
//     { id: "2", type: "stock", message: "Caesar Salad is out of stock", time: "1 hour ago", status: "unread" },
//     { id: "3", type: "payout", message: "Weekly payout of $1,250 processed", time: "2 hours ago", status: "read" },
//     { id: "4", type: "order", message: "New order received from Jane Smith", time: "5 min ago", status: "unread" },
//   ])

//   const sidebarItems = [
//     { id: "overview", label: "Overview", icon: Home },
//     { id: "orders", label: "Orders", icon: ShoppingCart },
//     { id: "menu", label: "Menu Management", icon: ChefHat },
//     { id: "earnings", label: "Earnings & Payments", icon: CreditCard },
//     { id: "reviews", label: "Reviews & Ratings", icon: Star },
//     { id: "support", label: "Support", icon: HelpCircle },
//   ]

//   const markNotificationAsRead = (id: string) => {
//     setNotifications((prev) =>
//       prev.map((notif) => (notif.id === id ? { ...notif, status: "read" as NotificationStatus } : notif)),
//     )
//   }

//   const toggleMenuItemAvailability = (id: string) => {
//     setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item)))
//   }

//   const getOrdersByStatus = (status: OrderStatus) => {
//     return orders.filter((order) => order.status === status)
//   }

//   const getStatusColor = (status: OrderStatus) => {
//     switch (status) {
//       case "pending":
//         return "bg-amber-100 text-amber-700"
//       case "in-progress":
//         return "bg-blue-100 text-blue-800"
//       case "completed":
//         return "bg-green-100 text-green-800"
//       case "cancelled":
//         return "bg-red-100 text-red-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   const renderOverview = () => (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Card className="border-orange-200 bg-white">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-orange-700">Pending Orders</CardTitle>
//             <div className="bg-orange-100 p-2 rounded-full">
//               <Clock className="h-4 w-4 text-orange-600" />
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-orange-800">{getOrdersByStatus("pending").length}</div>
//           </CardContent>
//         </Card>
//         <Card className="border-orange-200 bg-white">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-orange-700">In Progress</CardTitle>
//             <div className="bg-amber-100 rounded-full p-2">
//               <Package className="h-4 w-4 text-amber-600" />
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-orange-800">{getOrdersByStatus("in-progress").length}</div>
//           </CardContent>
//         </Card>
//         <Card className="border-orange-200 bg-white">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-orange-700">Completed</CardTitle>
//             <div className="bg-green-100 p-2 rounded-full">
//               <CheckCircle className="h-4 w-4 text-green-600" />
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-orange-800">{getOrdersByStatus("completed").length}</div>
//           </CardContent>
//         </Card>
//         <Card className="border-orange-200 bg-white">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-orange-700">Cancelled</CardTitle>
//             <div className="rounded-full bg-orange-100 p-2">
//               <CircleX className="h-4 w-4 text-orange-600" />
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-orange-800">{getOrdersByStatus("cancelled").length}</div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card className="border-orange-200 bg-white">
//           <CardHeader>
//             <CardTitle className="text-orange-800">Today's Earnings</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold text-orange-800 mb-2">$342.50</div>
//             <div className="text-sm text-green-600 flex items-center">
//               <TrendingUp className="h-4 w-4 mr-1" />
//               +12% from yesterday
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-amber-200 bg-white">
//           <CardHeader>
//             <CardTitle className="text-orange-800">Weekly Earnings</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold text-orange-800 mb-2">$1,250.00</div>
//             <div className="text-sm text-green-600 flex items-center">
//               <TrendingUp className="h-4 w-4 mr-1" />
//               +8% from last week
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card className="border-orange-200">
//         <CardHeader>
//           <CardTitle className="text-orange-800">Top Selling Dishes</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-3">
//             {menuItems.slice(0, 3).map((item, index) => (
//               <div key={item.id} className="flex items-center justify-between">
//                 <div className="flex items-center ">
//                   <div className="bg-orange-100 text-orange-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
//                     {index + 1}
//                   </div>
//                   <span className="font-medium text-orange-700">{item.name}</span>
//                 </div>
//                 <span className="text-orange-600 font-medium">${item.price}</span>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )

//   const renderOrders = () => (
//     <div className="space-y-6">
//       <Tabs value={activeOrderTab} onValueChange={setActiveOrderTab}>
//         <TabsList className="grid w-full grid-cols-4 bg-orange-100 border border-orange-200">
//           <TabsTrigger
//             value="new"
//             className="data-[state=active]:bg-white data-[state=active]:text-orange-700"
//           >
//             New Orders
//           </TabsTrigger>
//           <TabsTrigger
//             value="progress"
//             className="data-[state=active]:bg-white data-[state=active]:text-orange-700"
//           >
//             In Progress
//           </TabsTrigger>
//           <TabsTrigger
//             value="completed"
//             className="data-[state=active]:bg-white data-[state=active]:text-orange-700"
//           >
//             Completed
//           </TabsTrigger>
//           <TabsTrigger
//             value="cancelled"
//             className="data-[state=active]:bg-white data-[state=active]:text-orange-700"
//           >
//             Cancelled
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="new" className="space-y-4">
//           {getOrdersByStatus("pending").map((order) => (
//             <Card key={order.id} className="border-orange-200 bg-white">
//               <CardContent className="p-4">
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-2">
//                     <div className="flex items-center space-x-2">
//                       <span className="font-semibold text-orange-800">#{order.id}</span>
//                       <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
//                     </div>
//                     <div className="text-sm text-gray-600">
//                       <p className="text-orange-600">
//                         <strong className="text-orange-700">Customer:</strong> {order.customerName}
//                       </p>
//                       <p className="text-orange-600">
//                         <strong className="text-orange-700">Items:</strong> {order.items.join(", ")}
//                       </p>
//                       <p className="text-orange-600">
//                         <strong className="text-orange-700">Total:</strong> ${order.totalPrice}
//                       </p>
//                       <p className="text-orange-600">
//                         <strong className="text-orange-700">Time:</strong> {order.time}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex space-x-2">
//                     <Button size="sm" className="bg-green-600 hover:bg-green-700">
//                       <Check className="h-4 w-4 mr-1" />
//                       Accept
//                     </Button>
//                     <Button size="sm" variant="destructive">
//                       <X className="h-4 w-4 mr-1" />
//                       Reject
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </TabsContent>

//         <TabsContent value="progress" className="space-y-4">
//           {getOrdersByStatus("in-progress").map((order) => (
//             <Card key={order.id} className="border-orange-200 bg-white">
//               <CardContent className="p-4">
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-2">
//                     <div className="flex items-center space-x-2">
//                       <span className="font-semibold text-orange-800">#{order.id}</span>
//                       <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
//                     </div>
//                     <div className="text-sm text-gray-600">
//                       <p className="text-orange-600">
//                         <strong className="text-orange-700">Customer:</strong> {order.customerName}
//                       </p>
//                       <p className="text-orange-600">
//                         <strong className="text-orange-700">Items:</strong> {order.items.join(", ")}
//                       </p>
//                       <p className="text-orange-600">
//                         <strong className="text-orange-700">Total:</strong> ${order.totalPrice}
//                       </p>
//                       <p className="text-orange-600">
//                         <strong className="text-orange-700">Time:</strong> {order.time}
//                       </p>
//                     </div>
//                   </div>
//                   <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
//                     Mark Ready
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </TabsContent>

//         <TabsContent value="completed" className="space-y-4  bg-white">
//           {getOrdersByStatus("completed").map((order) => (
//             <Card key={order.id} className="border-orange-200 ">
//               <CardContent className="p-4">
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-2">
//                     <div className="flex items-center space-x-2">
//                       <span className="font-semibold text-orange-700">#{order.id}</span>
//                       <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
//                     </div>
//                     <div className="text-sm text-gray-600">
//                       <p className="text-orange-600">
//                         <strong className="text-orange-700">Customer:</strong> {order.customerName}
//                       </p>
//                       <p className="text-orange-600">
//                         <strong className="text-orange-700">Items:</strong> {order.items.join(", ")}
//                       </p>
//                       <p className="text-orange-600">
//                         <strong className="text-orange-700">Total:</strong> ${order.totalPrice}
//                       </p>
//                       <p className="text-orange-600">
//                         <strong className="text-orange-700">Time:</strong> {order.time}
//                       </p>
//                     </div>
//                   </div>
//                   <Button size="sm" variant="outline">
//                     <Eye className="h-4 w-4 mr-1" />
//                     View Details
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </TabsContent>

//         <TabsContent value="cancelled" className="space-y-4">
//           <div className="text-center py-8 text-gray-500">No cancelled orders today</div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )

//   const [menuSearchQuery, setMenuSearchQuery] = useState("")

//   const [newMenuItem, setNewMenuItem] = useState({
//     name: "",
//     description: "",
//     category: "",
//     price: "",
//     available: true,
//     image: "",
//   })
//   const [selectedImage, setSelectedImage] = useState<File | null>(null)
//   const [imagePreview, setImagePreview] = useState<string>("")

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       setSelectedImage(file)
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const resetForm = () => {
//     setNewMenuItem({
//       name: "",
//       description: "",
//       category: "",
//       price: "",
//       available: true,
//       image: "",
//     })
//     setSelectedImage(null)
//     setImagePreview("")
//   }

//   const handleAddMenuItem = () => {
//     if (newMenuItem.name && newMenuItem.category && newMenuItem.price) {
//       const newItem: MenuItem = {
//         id: Date.now().toString(),
//         name: newMenuItem.name,
//         category: newMenuItem.category,
//         price: Number.parseFloat(newMenuItem.price),
//         available: newMenuItem.available,
//         image: imagePreview || "/vibrant-food-dish.png",
//       }
//       setMenuItems((prev) => [...prev, newItem])
//       resetForm()
//       setShowAddMenuItem(false)
//     }
//   }

//   const renderMenuManagement = () => {
//     const filteredMenuItems = menuItems.filter(
//       (item) =>
//         item.name.toLowerCase().includes(menuSearchQuery.toLowerCase()) ||
//         item.category.toLowerCase().includes(menuSearchQuery.toLowerCase()),
//     )

//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-orange-800">Menu Management</h2>
//           <Dialog
//             open={showAddMenuItem}
//             onOpenChange={(open) => {
//               setShowAddMenuItem(open)
//               if (!open) resetForm()
//             }}
//           >
//             <DialogTrigger asChild>
//               <Button className="bg-orange-500 hover:bg-orange-600">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add New Item
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-md">
//               <DialogHeader>
//                 <DialogTitle>Add New Menu Item</DialogTitle>
//                 <DialogDescription>Fill in the details for your new menu item.</DialogDescription>
//               </DialogHeader>
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="name">Name</Label>
//                   <Input
//                     id="name"
//                     placeholder="Enter item name"
//                     value={newMenuItem.name}
//                     onChange={(e) => setNewMenuItem((prev) => ({ ...prev, name: e.target.value }))}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="description">Description</Label>
//                   <Textarea
//                     id="description"
//                     placeholder="Enter item description"
//                     value={newMenuItem.description}
//                     onChange={(e) => setNewMenuItem((prev) => ({ ...prev, description: e.target.value }))}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="category">Category</Label>
//                   <Input
//                     id="category"
//                     placeholder="Enter category (e.g., Pizza, Burgers, Salads)"
//                     value={newMenuItem.category}
//                     onChange={(e) => setNewMenuItem((prev) => ({ ...prev, category: e.target.value }))}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="price">Price</Label>
//                   <Input
//                     id="price"
//                     type="number"
//                     placeholder="0.00"
//                     value={newMenuItem.price}
//                     onChange={(e) => setNewMenuItem((prev) => ({ ...prev, price: e.target.value }))}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="image">Image</Label>
//                   <div className="space-y-2">
//                     <Input
//                       id="image"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       className="cursor-pointer"
//                     />
//                     {imagePreview && (
//                       <div className="flex justify-center">
//                         <img
//                           src={imagePreview || "/placeholder.svg"}
//                           alt="Preview"
//                           className="w-20 h-20 rounded-lg object-cover border-2 border-orange-200"
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Switch
//                     id="available"
//                     checked={newMenuItem.available}
//                     onCheckedChange={(checked) => setNewMenuItem((prev) => ({ ...prev, available: checked }))}
//                   />
//                   <Label htmlFor="available">Available</Label>
//                 </div>
//                 <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={handleAddMenuItem}>
//                   Add Item
//                 </Button>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>

//         <div className="flex items-center space-x-4">
//           <div className="relative flex-1 max-w-md">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//             <Input
//               placeholder="Search menu items..."
//               value={menuSearchQuery}
//               onChange={(e) => setMenuSearchQuery(e.target.value)}
//               className="pl-10 border-orange-200 focus:border-orange-400"
//             />
//           </div>
//           {menuSearchQuery && (
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setMenuSearchQuery("")}
//               className="text-orange-600 border-orange-200 hover:bg-orange-50"
//             >
//               Clear
//             </Button>
//           )}
//         </div>

//         <Card className="border-orange-200 bg-white">
//           <CardContent className="p-0">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className=" border-b border-orange-200">
//                   <tr>
//                     <th className="text-left p-4 font-medium text-orange-800">Photo</th>
//                     <th className="text-left p-4 font-medium text-orange-800">Name</th>
//                     <th className="text-left p-4 font-medium text-orange-800">Category</th>
//                     <th className="text-left p-4 font-medium text-orange-800">Price</th>
//                     <th className="text-left p-4 font-medium text-orange-800">Available</th>
//                     <th className="text-left p-4 font-medium text-orange-800">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredMenuItems.length > 0 ? (
//                     filteredMenuItems.map((item) => (
//                       <tr key={item.id} className="border-b border-orange-100">
//                         <td className="p-4">
//                           <img
//                             src={item.image || "/placeholder.svg"}
//                             alt={item.name}
//                             className="w-12 h-12 rounded-lg object-cover"
//                           />
//                         </td>
//                         <td className="p-4 font-medium text-orange-800">{item.name}</td>
//                         <td className="p-4 text-amber-600">{item.category}</td>
//                         <td className="p-4 font-medium text-orange-800">${item.price}</td>
//                         <td className="p-4">
//                           <Switch
//                             checked={item.available}
//                             onCheckedChange={() => toggleMenuItemAvailability(item.id)}
//                           />
//                         </td>
//                         <td className="p-4">
//                           <div className="flex space-x-2">
//                             <Button size="sm" variant="outline">
//                               <Edit className="h-4 w-4" />
//                             </Button>
//                             <Button size="sm" variant="destructive">
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={6} className="p-8 text-center text-gray-500">
//                         {menuSearchQuery ? "No menu items found matching your search." : "No menu items available."}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   const renderEarnings = () => (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card className="border-orange-200  bg-white">
//           <CardHeader>
//             <CardTitle className="text-orange-800">Today</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-orange-800">$342.50</div>
//           </CardContent>
//         </Card>
//         <Card className="border-orange-200 bg-white">
//           <CardHeader>
//             <CardTitle className="text-orange-800">This Week</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-amber-800">$1,250.00</div>
//           </CardContent>
//         </Card>
//         <Card className="border-orange-200 bg-white">
//           <CardHeader>
//             <CardTitle className="text-orange-800">This Month</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-orange-800">$4,890.00</div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card className="border-orange-200 bg-white">
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle className="text-orange-800">Transaction History</CardTitle>
//           <div className="flex space-x-2">
//             <Button size="sm" variant="outline">
//               <Download className="h-4 w-4 mr-2" />
//               Export CSV
//             </Button>
//             <Button size="sm" variant="outline">
//               <Download className="h-4 w-4 mr-2" />
//               Export PDF
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className=" border-b border-orange-200">
//                 <tr>
//                   <th className="text-left p-3 font-medium text-orange-800">Order ID</th>
//                   <th className="text-left p-3 font-medium text-orange-800">Date</th>
//                   <th className="text-left p-3 font-medium text-orange-800">Amount</th>
//                   <th className="text-left p-3 font-medium text-orange-800">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {transactions.map((transaction) => (
//                   <tr key={transaction.id} className="border-b hover:bg-orange-50 border-orange-100">
//                     <td className="p-3 font-medium text-orange-800">#{transaction.orderId}</td>
//                     <td className="p-3 text-orange-700">{transaction.date}</td>
//                     <td className="p-3 font-medium text-orange-800">${transaction.amount}</td>
//                     <td className="p-3">
//                       <Badge
//                         className={
//                           transaction.status === "completed"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-amber-100 text-amber-700"
//                         }
//                       >
//                         {transaction.status}
//                       </Badge>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )

//   const renderReviews = () => (
//     <div className="space-y-6">
//       <Card className="border-orange-200">
//         <CardHeader>
//           <CardTitle className="text-orange-700">Average Rating</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex items-center space-x-2">
//             <div className="text-3xl font-bold text-orange-800">4.5</div>
//             <div className="flex">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <Star
//                   key={star}
//                   className={`h-6 w-6 ${star <= 4 ? "text-orange-400 fill-current" : "text-gray-300"}`}
//                 />
//               ))}
//             </div>
//             <span className="text-gray-600">(24 reviews)</span>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="space-y-4">
//         {reviews.map((review) => (
//           <Card key={review.id} className="border-orange-200">
//             <CardContent className="p-4">
//               <div className="flex items-start justify-between">
//                 <div className="space-y-2">
//                   <div className="flex items-center space-x-2">
//                     <span className="font-semibold">{review.customerName}</span>
//                     <div className="flex">
//                       {[1, 2, 3, 4, 5].map((star) => (
//                         <Star
//                           key={star}
//                           className={`h-4 w-4 ${star <= review.rating ? "text-orange-400 fill-current" : "text-gray-300"}`}
//                         />
//                       ))}
//                     </div>
//                     <span className="text-sm text-gray-500">{review.date}</span>
//                   </div>
//                   <p className="text-gray-700">{review.comment}</p>
//                   {review.replied && (
//                     <div className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400">
//                       <p className="text-sm text-orange-700">
//                         Thank you for your feedback! We're glad you enjoyed your meal.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//                 {!review.replied && (
//                   <Button size="sm" variant="outline">
//                     <Reply className="h-4 w-4 mr-1" />
//                     Reply
//                   </Button>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )

//   const handleSignOut = async () => {
//     try {
//       const token = localStorage.getItem("token")
//       if (token) {
//         await fetch("http://localhost:4000/api/restaurant/logout", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//           }
//         })
//       }
//     } catch (error) {
//       console.error("Logout API call failed:", error)
//     } finally {
//       // Always clear local storage and redirect, even if API call fails
//       localStorage.removeItem("token")
//       localStorage.removeItem("restaurant")
//       localStorage.removeItem("user")
//       window.location.href = "/restaurant-signIn"
//     }
//   }

//   const handleUpdateProfile = () => {
//     console.log("[v0] Profile updated:", profileData)
//     setIsEditingProfile(false)
//     alert("Profile updated successfully!")
//   }

//   const handleProfileChange = (field: string, value: string) => {
//     setProfileData((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

//   const renderProfile = () => (
//     <div className="space-y-6">
//       <Card className="border-orange-200">
//         <CardHeader>
//           <CardTitle className="text-orange-700">Profile Overview</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex items-center space-x-6 mb-6">
//             <Avatar className="h-20 w-20">
//               <AvatarImage src="/restaurant-owner.png" />
//               <AvatarFallback className="bg-orange-100 text-orange-700 text-2xl">RO</AvatarFallback>
//             </Avatar>
//             <div className="space-y-2">
//               <h3 className="text-xl font-semibold">{profileData.restaurantName}</h3>
//               <p className="text-gray-600">{profileData.email}</p>
//               <p className="text-gray-600">{profileData.phone}</p>
//               <Badge className="bg-orange-100 text-orange-700 capitalize">{profileData.cuisine} Cuisine</Badge>
//             </div>
//           </div>
//           <div className="flex space-x-3">
//             <Button onClick={() => setIsEditingProfile(true)} className="bg-orange-600 hover:bg-orange-700">
//               <Edit className="h-4 w-4 mr-2" />
//               Update Profile
//             </Button>
//             <Button variant="outline">
//               <User className="h-4 w-4 mr-2" />
//               View Public Profile
//             </Button>
//             <Button onClick={handleSignOut} variant="destructive">
//               <LogOut className="h-4 w-4 mr-2" />
//               Logout
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {isEditingProfile && (
//         <Card className="border-orange-200">
//           <CardHeader>
//             <CardTitle className="text-orange-700">Edit Restaurant Profile</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="restaurant-name">Restaurant Name</Label>
//                 <Input
//                   id="restaurant-name"
//                   value={profileData.restaurantName}
//                   onChange={(e) => handleProfileChange("restaurantName", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="phone">Phone</Label>
//                 <Input
//                   id="phone"
//                   value={profileData.phone}
//                   onChange={(e) => handleProfileChange("phone", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={profileData.email}
//                   onChange={(e) => handleProfileChange("email", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="cuisine">Cuisine Type</Label>
//                 <Select value={profileData.cuisine} onValueChange={(value) => handleProfileChange("cuisine", value)}>
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="italian">Italian</SelectItem>
//                     <SelectItem value="american">American</SelectItem>
//                     <SelectItem value="asian">Asian</SelectItem>
//                     <SelectItem value="mexican">Mexican</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div>
//               <Label htmlFor="address">Address</Label>
//               <Textarea
//                 id="address"
//                 value={profileData.address}
//                 onChange={(e) => handleProfileChange("address", e.target.value)}
//               />
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="open-time">Opening Time</Label>
//                 <Input
//                   id="open-time"
//                   type="time"
//                   value={profileData.openTime}
//                   onChange={(e) => handleProfileChange("openTime", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="close-time">Closing Time</Label>
//                 <Input
//                   id="close-time"
//                   type="time"
//                   value={profileData.closeTime}
//                   onChange={(e) => handleProfileChange("closeTime", e.target.value)}
//                 />
//               </div>
//             </div>
//             <div className="flex space-x-3">
//               <Button onClick={handleUpdateProfile} className="bg-orange-600 hover:bg-orange-700">
//                 Save Changes
//               </Button>
//               <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
//                 Cancel
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )

//   const renderNotifications = () => (
//     <div className="space-y-4">
//       {notifications.map((notification) => (
//         <Card
//           key={notification.id}
//           className={`border-orange-200 bg-white ${notification.status === "unread" ? "bg-white" : ""}`}
//         >
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-start space-x-3">
//                 <div
//                   className={`p-2 rounded-full ${notification.type === "order"
//                     ? "bg-orange-100 text-orange-600"
//                     : notification.type === "stock"
//                       ? "bg-red-100 text-red-600"
//                       : "bg-green-100 text-green-600"
//                     }`}
//                 >
//                   {notification.type === "order" && <ShoppingCart className="h-4 w-4" />}
//                   {notification.type === "stock" && <Package className="h-4 w-4" />}
//                   {notification.type === "payout" && <DollarSign className="h-4 w-4" />}
//                 </div>
//                 <div>
//                   <p className="font-medium">{notification.message}</p>
//                   <p className="text-sm text-gray-500">{notification.time}</p>
//                 </div>
//               </div>
//               {notification.status === "unread" && (
//                 <Button size="sm" variant="outline" onClick={() => markNotificationAsRead(notification.id)}>
//                   Mark as Read
//                 </Button>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   )

//   const renderSupport = () => (
//     <div className="space-y-6">
//       <Card className="border-orange-200 bg-white">
//         <CardHeader>
//           <CardTitle className="text-orange-800">Contact Admin</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <Label htmlFor="subject" className="pb-2">Subject</Label>
//             <Input className="border-orange-200" id="subject" placeholder="Enter subject" />
//           </div>
//           <div>
//             <Label htmlFor="message" className="pb-2">Message</Label>
//             <Textarea className="border-orange-200" id="message" placeholder="Describe your issue or question" rows={4} />
//           </div>
//           <Button className="bg-orange-500 hover:bg-orange-600">Send Message</Button>
//         </CardContent>
//       </Card>

//       <Card className="border-orange-200 bg-white">
//         <CardHeader>
//           <CardTitle className="text-orange-800">Frequently Asked Questions</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <h4 className="font-medium text-orange-600">How do I update my menu items?</h4>
//             <p className="text-sm text-gray-500">
//               Go to Menu Management section and click on the edit button next to any item.
//             </p>
//           </div>
//           <div className="space-y-2">
//             <h4 className="font-medium text-orange-600">When do I receive payments?</h4>
//             <p className="text-sm text-gray-500">
//               Payments are processed weekly every Monday for the previous week's orders.
//             </p>
//           </div>
//           <div className="space-y-2">
//             <h4 className="font-medium text-orange-600">How do I handle order cancellations?</h4>
//             <p className="text-sm text-gray-500">
//               You can cancel orders from the Orders section before they are marked as in-progress.
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )

//   const renderContent = () => {
//     switch (activeSection) {
//       case "overview":
//         return renderOverview()
//       case "orders":
//         return renderOrders()
//       case "menu":
//         return renderMenuManagement()
//       case "earnings":
//         return renderEarnings()
//       case "reviews":
//         return renderReviews()
//       case "profile":
//         return renderProfile()
//       case "notifications":
//         return renderNotifications()
//       case "support":
//         return renderSupport()
//       default:
//         return renderOverview()
//     }
//   }

//   return (
//     <div className="flex h-screen bg-background overflow-x-hidden">
//       <div
//         className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-64"
//           } flex flex-col`}
//       >
//         <div className="p-4 border-b border-sidebar-border">
//           <div className="flex items-center space-x-2">
//             <div className="bg-[#dd6636] p-2 rounded-lg">
//               <ChefHat className="h-6 w-6 text-white" />
//             </div>
//             {!sidebarCollapsed && (
//               <div>
//                 <h1 className="font-bold text-lg text-orange-900">Restaurant Panel</h1>
//                 <p className="text-xs text-amber-700">Welcome, {profileData.restaurantName || "Restaurant Owner"}</p>
//               </div>
//             )}
//           </div>
//         </div>

//         <nav className="flex-1 p-4 space-y-2">
//           {sidebarItems.map((item) => {
//             const Icon = item.icon
//             const isActive = activeSection === item.id
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveSection(item.id)}
//                 className={`w-full flex items-center space-x-3 text-amber-700 px-3 py-2 rounded-lg transition-colors ${isActive
//                   ? "bg-orange-100 text-amber-700 border border-orange-200"
//                   : " hover:bg-orange-50 hover:text-orange-800"
//                   }`}
//               >
//                 <Icon className="h-5 w-5 flex-shrink-0" />
//                 {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
//               </button>
//             )
//           })}
//         </nav>
//       </div>

//       <div className="flex-1 flex flex-col overflow-hidden">
//         <header className="bg-white border-b border-orange-200 px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <Button variant="ghost" size="sm" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
//                 <Menu className="h-5 w-5" />
//               </Button>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Search orders, menu items..."
//                   className="pl-10 w-80 border-orange-200 focus:border-orange-400"
//                 />
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="sm" className="relative hover:bg-transparent">
//                     <Bell className="h-5 w-5" />
//                     {notifications.filter((n) => n.status === "unread").length > 0 && (
//                       <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                         {notifications.filter((n) => n.status === "unread").length}
//                       </span>
//                     )}
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-80">
//                   {notifications.slice(0, 4).map((notification) => (
//                     <DropdownMenuItem key={notification.id} className="">
//                       <div className="">
//                         <p className="text-sm font-medium">{notification.message}</p>
//                         <p className="text-xs text-gray-500">{notification.time}</p>
//                       </div>
//                     </DropdownMenuItem>
//                   ))}
//                 </DropdownMenuContent>
//               </DropdownMenu>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" className="flex items-center space-x-2">
//                     <Avatar className="h-8 w-8">
//                       <AvatarImage src="/restaurant-owner.png" />
//                       <AvatarFallback className="bg-orange-100 text-orange-700">RO</AvatarFallback>
//                     </Avatar>
//                     <span className="text-sm font-medium">{profileData.restaurantName || "Restaurant Owner"}</span>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem onClick={() => setActiveSection("profile")}>
//                     <User className="h-4 w-4 mr-2" />
//                     Profile
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setActiveSection("notifications")}>
//                     <Bell className="h-4 w-4 mr-2" />
//                     Notifications
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setActiveSection("support")}>
//                     <HelpCircle className="h-4 w-4 mr-2" />
//                     Support
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
//                     <X className="h-4 w-4 mr-2" />
//                     Sign Out
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>
//         </header>

//         <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
//       </div>
//     </div>
//   )
// }
