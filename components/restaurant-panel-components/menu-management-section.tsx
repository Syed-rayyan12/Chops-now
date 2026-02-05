"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { MenuItem, MenuCategory } from "@/types/menu"
import { EditModal } from "./editModal"
import { DeleteModal } from "./deleteModal"
import { menuCategories, menuItems as menuItemsApi } from "@/lib/api/restaurant.api"
import { useToast } from "@/hooks/use-toast"
import { CategoryManagement } from "./category-management"


export function MenuManagementSection() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [menuSearchQuery, setMenuSearchQuery] = useState("")
  const [showAddMenuItem, setShowAddMenuItem] = useState(false)
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    description: "",
    allergy: "",
    categoryId: "",
    price: "",
    available: true,
    image: "",
  })
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  // ✅ For editing
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)

  // Fetch guards to prevent duplicate calls
  const catLoadingRef = useRef(false)
  const catLastFetchRef = useRef(0)
  const itemsLoadingRef = useRef(false)
  const itemsLastFetchRef = useRef(0)

  // Fetch categories and menu items on mount; refresh on focus and cross-tab events
  useEffect(() => {
    const restaurantSlug = localStorage.getItem("restaurantSlug")
    if (!restaurantSlug) return

    // Initial load
    loadCategories(restaurantSlug, true)
    loadMenuItems(restaurantSlug, true)

    // Cross-tab updates via BroadcastChannel only
    const channel = new BroadcastChannel("chop-restaurant-updates")
    const onMessage = (evt: MessageEvent) => {
      const msg = evt.data as any
      if (msg?.slug === restaurantSlug && (msg?.type === "menuUpdated" || msg?.type === "categoriesUpdated")) {
        loadCategories(restaurantSlug)
        loadMenuItems(restaurantSlug)
      }
    }
    channel.addEventListener("message", onMessage)

    return () => {
      channel.removeEventListener("message", onMessage)
      channel.close()
    }
  }, [])

  const loadCategories = async (slug: string, skipThrottle = false) => {
    const now = Date.now()
    if (!skipThrottle) {
      if (catLoadingRef.current) return
      if (now - catLastFetchRef.current < 2000) return
    }
    try {
      catLoadingRef.current = true
      const data = await menuCategories.getAll(slug)
      setCategories(data)
    } catch (error) {
      console.error("Failed to load categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      })
    } finally {
      catLoadingRef.current = false
      catLastFetchRef.current = Date.now()
    }
  }

  const loadMenuItems = async (slug: string, skipThrottle = false) => {
    const now = Date.now()
    if (!skipThrottle) {
      if (itemsLoadingRef.current) return
      if (now - itemsLastFetchRef.current < 2000) return
    }
    try {
      itemsLoadingRef.current = true
      const data = await menuItemsApi.getAll(slug)
      setMenuItems(data)
    } catch (error) {
      console.error("Failed to load menu items:", error)
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive",
      })
    } finally {
      itemsLoadingRef.current = false
      itemsLastFetchRef.current = Date.now()
    }
  }

  const toggleMenuItemAvailability = async (id: number) => {
    const restaurantSlug = localStorage.getItem("restaurantSlug")
    if (!restaurantSlug) return

    const item = menuItems.find(i => i.id === id)
    if (!item || !item.categoryId) return

    try {
      await menuItemsApi.update(restaurantSlug, id, {
        categoryId: item.categoryId,
        isAvailable: !item.isAvailable
      })
      
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
        )
      )
      // Notify other tabs/pages
      try {
        const channel = new BroadcastChannel("chop-restaurant-updates")
        channel.postMessage({ type: "menuUpdated", slug: restaurantSlug })
        channel.close()
      } catch {}
      
      toast({
        title: "Success",
        description: "Item availability updated",
      })
    } catch (error) {
      console.error("Failed to update availability:", error)
      toast({
        title: "Error",
        description: "Failed to update item availability",
        variant: "destructive",
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      // Add new files to existing ones
      const newFiles = [...selectedImages, ...files]
      setSelectedImages(newFiles)
      
      // Generate previews for all images
      const newPreviews: string[] = []
      newFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviews.push(reader.result as string)
          if (newPreviews.length === newFiles.length) {
            setImagePreviews(newPreviews)
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setNewMenuItem({
      name: "",
      description: "",
      allergy: "",
      categoryId: "",
      price: "",
      available: true,
      image: "",
    })
    setSelectedImages([])
    setImagePreviews([])
  }

  const handleAddMenuItem = async () => {
    if (newMenuItem.name && newMenuItem.categoryId && newMenuItem.price) {
      const restaurantSlug = localStorage.getItem("restaurantSlug")
      if (!restaurantSlug) {
        toast({
          title: "Error",
          description: "Restaurant not found",
          variant: "destructive",
        })
        return
      }

      try {
        const formData = new FormData()
        formData.append("name", newMenuItem.name)
        formData.append("description", newMenuItem.description)
        formData.append("price", newMenuItem.price)
        formData.append("categoryId", newMenuItem.categoryId)
        formData.append("isAvailable", String(newMenuItem.available))
        formData.append("allergyInfo", newMenuItem.allergy)
        
        // Append all selected images
        if (selectedImages.length > 0) {
          selectedImages.forEach((image) => {
            formData.append("images", image)
          })
        }

        const createdItem = await menuItemsApi.create(restaurantSlug, formData)
        
        // Reload menu items to get the latest data
        await loadMenuItems(restaurantSlug)
        // Notify other tabs/pages
        try {
          const channel = new BroadcastChannel("chop-restaurant-updates")
          channel.postMessage({ type: "menuUpdated", slug: restaurantSlug })
          channel.close()
        } catch {}
        
        toast({
          title: "Success",
          description: "Menu item created successfully",
        })
        
        resetForm()
        setShowAddMenuItem(false)
      } catch (error: any) {
        console.error("Failed to create menu item:", error)
        toast({
          title: "Error",
          description: error.message || "Failed to create menu item",
          variant: "destructive",
        })
      }
    }
  }

  const handleEdit = (item: MenuItem) => {
    setSelectedItem(item)
    setIsEditOpen(true)
  }

  const handleDelete = async (id: number) => {
    const restaurantSlug = localStorage.getItem("restaurantSlug")
    if (!restaurantSlug) return
    
    const item = menuItems.find(i => i.id === id)
    if (!item || !item.categoryId) {
      toast({
        title: "Error",
        description: "Cannot delete item: category information missing",
        variant: "destructive",
      })
      return
    }

    try {
      await menuItemsApi.delete(restaurantSlug, id, item.categoryId)
      setMenuItems(prev => prev.filter(item => item.id !== id))
      setIsDeleteOpen(false)
      setSelectedItem(null)
      // Notify other tabs/pages
      try {
        const channel = new BroadcastChannel("chop-restaurant-updates")
        channel.postMessage({ type: "menuUpdated", slug: restaurantSlug })
        channel.close()
      } catch {}
      
      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      })
    } catch (error) {
      console.error("Failed to delete menu item:", error)
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      })
    }
  }

  const handleSave = async (updatedItem: any) => {
    const restaurantSlug = localStorage.getItem("restaurantSlug")
    if (!restaurantSlug) return

    try {
      const formData = new FormData()
      formData.append("name", updatedItem.name)
      formData.append("description", updatedItem.description || "")
      formData.append("price", String(updatedItem.price))
      if (updatedItem.categoryId) {
        formData.append("categoryId", String(updatedItem.categoryId))
      }
      formData.append("isAvailable", String(updatedItem.isAvailable))
      formData.append("allergyInfo", updatedItem.allergyInfo || updatedItem.allergy || "")

      // Add image file if uploaded
      if (updatedItem.imageFile) {
        formData.append("image", updatedItem.imageFile)
      }

      await menuItemsApi.update(restaurantSlug, updatedItem.id, formData)
      
      // Reload menu items to get fresh data with updated image URL
      await loadMenuItems(restaurantSlug)
      
      // Notify other tabs/pages
      try {
        const channel = new BroadcastChannel("chop-restaurant-updates")
        channel.postMessage({ type: "menuUpdated", slug: restaurantSlug })
        channel.close()
      } catch {}
      
      setIsEditOpen(false)
      toast({
        title: "Success",
        description: "Menu item updated successfully",
      })
    } catch (error) {
      console.error("Failed to update menu item:", error)
      toast({
        title: "Error",
        description: "Failed to update menu item",
        variant: "destructive",
      })
    }
  }

  const filteredMenuItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(menuSearchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(menuSearchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-secondary rounded-lg p-6 text-white mb-6">
        <div>
        <h2 className="text-2xl font-bold font-ubuntu mb-2">MENU MANAMGEMENT</h2>
        <p className="text-white font-ubuntu text-sm">Easily manage and update your restaurant's menu.</p>
        </div>
        <Dialog
          open={showAddMenuItem}
          onOpenChange={(open) => {
            setShowAddMenuItem(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild className="">
            <Button className="bg-white text-secondary cursor-pointer rounded-lg py-5">
              <Plus className="h-4 w-4 mr-2 text-secondary" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[30%] w-[50%] max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader className="bg-white p-4">
              <DialogTitle className="text-foreground font-bold text-xl">Add New Menu</DialogTitle>
              <DialogDescription className="text-secondary">
              Fill in the details for your new menu item.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 bg-[#f5f6fb] p-4 overflow-y-auto flex-1 pr-2">
              <div>
                <Label htmlFor="name" className="mb-2 text-gray-400">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter item name"
                  value={newMenuItem.name}
                  onChange={(e) =>
                    setNewMenuItem((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="border border-gray-400 bg-white"
                />
              </div>
              <div>
                <Label htmlFor="description" className="mb-2 text-gray-400">Description</Label>
                <Textarea
                  id="description"
                  className="border border-gray-400 bg-white"
                  placeholder="Enter item description"
                  value={newMenuItem.description}
                  onChange={(e) =>
                    setNewMenuItem((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="allergy" className="mb-2 text-gray-400">Allergy</Label>
                <Input
                  id="allergy"
                  className="border border-gray-400 bg-white"
                  placeholder="e.g., Dairy, Nuts, Gluten"
                  value={newMenuItem.allergy}
                  onChange={(e) =>
                    setNewMenuItem((prev) => ({
                      ...prev,
                      allergy: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="category" className="mb-2 text-gray-700">Category</Label>
                <Select
                  value={newMenuItem.categoryId}
                  onValueChange={(value) =>
                    setNewMenuItem((prev) => ({
                      ...prev,
                      categoryId: value,
                    }))
                  }
                >
                  <SelectTrigger className="border border-gray-400 bg-white">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length === 0 ? (
                      <SelectItem value="no-categories" disabled>
                        No categories available - Create one first
                      </SelectItem>
                    ) : (
                      categories
                        .filter((cat) => cat.isActive)
                        .map((category) => (
                          <SelectItem key={category.id} value={String(category.id)}>
                            {category.name}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price" className="mb-2 text-gray-400">Price</Label>
                <Input
                  id="price"
                  className="border border-gray-400 bg-white"
                  type="number"
                  placeholder="0.00"
                  value={newMenuItem.price}
                  onChange={(e) =>
                    setNewMenuItem((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="images" className="mb-2 text-gray-400">Images (Multiple)</Label>
                <div className="space-y-3">
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="border border-gray-400 bg-white"
                  />
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 rounded-md object-cover border-2 border-orange-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">You can upload multiple images for this menu item</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={newMenuItem.available}
                  onCheckedChange={(checked) =>
                    setNewMenuItem((prev) => ({ ...prev, available: checked }))
                  }
                />
                <Label htmlFor="available">Available</Label>
              </div>
              <Button
                className="w-full bg-secondary rounded-md transition-none cursor-pointer"
                onClick={handleAddMenuItem}
              >
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      
      </div>


        <CategoryManagement />
      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform  -translate-y-1/2 text-primary h-4 w-4" />
          <Input
            placeholder="Search menu items..."
            value={menuSearchQuery}
            onChange={(e) => setMenuSearchQuery(e.target.value)}
            className="pl-10 border-primary/50 bg-white"
          />
        </div>
        {menuSearchQuery && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMenuSearchQuery("")}
            className="text-orange-600 border-orange-200 hover:bg-orange-50"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <Card className="border-primary/50 bg-white">
        <CardContent className="p-2 sm:p-4">
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full min-w-[800px]">
              <thead className="border-b border-primary/50  rounded-lg">
                <tr className="border border-gray-400 rounded-lg h-12">
                  <th className="text-left text-foreground font-bold font-ubuntu text-xs sm:text-[16px] px-2 sm:px-4 py-2 whitespace-nowrap">
                    Photo
                  </th>
                  <th className="text-left text-foreground font-bold font-ubuntu text-xs sm:text-[16px] px-2 sm:px-4 py-2 whitespace-nowrap">
                    Name
                  </th>
                  <th className="text-left text-foreground font-bold font-ubuntu text-xs sm:text-[16px] px-2 sm:px-4 py-2 whitespace-nowrap">
                    Description
                  </th>
                  <th className="text-left text-foreground font-bold font-ubuntu text-xs sm:text-[16px] px-2 sm:px-4 py-2 whitespace-nowrap">
                    Allergy
                  </th>
                  <th className="text-left text-foreground font-bold font-ubuntu text-xs sm:text-[16px] px-2 sm:px-4 py-2 whitespace-nowrap">
                    Category
                  </th>
                  <th className="text-left text-foreground font-bold font-ubuntu text-xs sm:text-[16px] px-2 sm:px-4 py-2 whitespace-nowrap">
                    Price
                  </th>
                  <th className="text-left text-foreground font-bold font-ubuntu text-xs sm:text-[16px] px-2 sm:px-4 py-2 whitespace-nowrap">
                    Available
                  </th>
                  <th className="text-left text-foreground font-bold font-ubuntu text-xs sm:text-[16px] px-2 sm:px-4 py-2 whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMenuItems.length > 0 ? (
                  filteredMenuItems.map((item) => (
                    <tr key={item.id} className="border-b border-orange-100">
                      <td className="px-4 py-2 text-left">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-4 py-2 text-left font-medium text-md text-gray-400">
                        {item.name}
                      </td>
                      <td className="px-4 py-2 font-normal text-sm text-left text-gray-400 max-w-[220px] truncate" title={item.description}>
                        {item.description || "—"}
                      </td>
                      <td className="px-4 py-2 font-normal text-sm text-left text-gray-400 max-w-[160px] truncate" title={item.allergyInfo}>
                        {item.allergyInfo || "—"}
                      </td>
                      <td className="px-4 py-2 font-normal text-sm text-left text-gray-400">{item.category}</td>
                      <td className="px-4 py-2 text-left font-medium text-sm text-secondary">
                      £{item.price}
                      </td>
                      <td className="px-4 py-2 text-left">
                        <Switch
                          checked={item.isAvailable}
                          onCheckedChange={() =>
                            toggleMenuItemAvailability(item.id)
                          }
                        />
                      </td>
                      <td className="px-4 py-2 text-left">
                        <div className="flex space-x-2">
                          <Button
                          variant="edit"
                           className=""
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-6 w-6" />
                          </Button>
                          <Button
                             variant="delete"
                            onClick={() => {
                              setSelectedItem(item)     // store the item to delete
                              setIsDeleteOpen(true)  // open the delete modal
                            }}
                          >
                            <Trash2 className="h-10 w-10 text-secondary" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-8 text-center text-gray-500"
                    >
                      {menuSearchQuery
                        ? "No menu items found matching your search."
                        : "No menu items available."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ✅ Edit Modal */}
      {selectedItem && (
        <EditModal
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          item={selectedItem}
          onSave={handleSave}
        />
      )}

      {selectedItem && (
        <DeleteModal
          open={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          item={selectedItem}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
