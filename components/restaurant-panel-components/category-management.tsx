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
import { Plus, Edit, Trash2 } from "lucide-react"
import { 
  getMenuCategories, 
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
  type MenuCategory
} from "@/lib/api/restaurant.api"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"

export function CategoryManagement() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  })

   // Get restaurant slug from localStorage
   const [restaurantSlug, setRestaurantSlug] = useState("")

   useEffect(() => {
     const restaurantData = localStorage.getItem("restaurantData")
     if (restaurantData) {
       try {
         const parsed = JSON.parse(restaurantData)
         setRestaurantSlug(parsed?.slug || "")
         console.log("🔵 Restaurant slug from localStorage:", parsed?.slug)
       } catch (e) {
         console.error("❌ Error parsing restaurant data:", e)
       }
     }
   }, [])

  useEffect(() => {
    console.log("🔵 CategoryManagement - user:", user)
    console.log("🔵 CategoryManagement - restaurantSlug:", restaurantSlug)
    if (!restaurantSlug) {
      console.log("⚠️ No restaurant slug in CategoryManagement")
      return
    }

    // Initial load
    loadCategories()

    // Cross-tab updates via BroadcastChannel only
    const channel = new BroadcastChannel("chop-restaurant-updates")
    const onMessage = (evt: MessageEvent) => {
      const msg = evt.data as any
      if (msg?.type === "menuUpdated" && msg?.slug === restaurantSlug) {
        loadCategories()
      }
      if (msg?.type === "categoriesUpdated" && msg?.slug === restaurantSlug) {
        loadCategories()
      }
    }
    channel.addEventListener("message", onMessage)

    return () => {
      channel.removeEventListener("message", onMessage)
      channel.close()
    }
  }, [restaurantSlug])

  // Prevent duplicate/rapid fetches
  const catLoadingRef = useRef(false)
  const catLastFetchRef = useRef(0)

  const loadCategories = async () => {
     const now = Date.now()
     if (catLoadingRef.current) return
     if (now - catLastFetchRef.current < 2000) return
     console.log("🔵 Loading categories for slug:", restaurantSlug)
    try {
      catLoadingRef.current = true
      const data = await getMenuCategories(restaurantSlug)
       console.log("✅ Categories loaded:", data)
      setCategories(data as unknown as MenuCategory[])
    } catch (error: any) {
       console.error("❌ Error loading categories:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load categories",
        variant: "destructive",
      })
    } finally {
      catLoadingRef.current = false
      catLastFetchRef.current = Date.now()
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      isActive: true,
    })
  }

  const handleAdd = async () => {
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }

    try {
      await createMenuCategory(restaurantSlug, formData)
      await loadCategories()
      // Notify other tabs/pages
      try {
        const channel = new BroadcastChannel("chop-restaurant-updates")
        channel.postMessage({ type: "categoriesUpdated", slug: restaurantSlug })
        channel.close()
      } catch {}
      toast({
        title: "Success",
        description: "Category created successfully",
      })
      resetForm()
      setShowAddDialog(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (category: MenuCategory) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      isActive: category.isActive,
    })
    setShowEditDialog(true)
  }

  const handleUpdate = async () => {
    if (!selectedCategory || !formData.name) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }

    try {
      await updateMenuCategory(restaurantSlug, selectedCategory.id, formData)
      await loadCategories()
      // Notify other tabs/pages
      try {
        const channel = new BroadcastChannel("chop-restaurant-updates")
        channel.postMessage({ type: "categoriesUpdated", slug: restaurantSlug })
        channel.close()
      } catch {}
      toast({
        title: "Success",
        description: "Category updated successfully",
      })
      resetForm()
      setShowEditDialog(false)
      setSelectedCategory(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update category",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!selectedCategory) return

    try {
      await deleteMenuCategory(restaurantSlug, selectedCategory.id)
      await loadCategories()
      // Notify other tabs/pages
      try {
        const channel = new BroadcastChannel("chop-restaurant-updates")
        channel.postMessage({ type: "categoriesUpdated", slug: restaurantSlug })
        channel.close()
      } catch {}
      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
      setShowDeleteDialog(false)
      setSelectedCategory(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4 mb-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-primary font-ubuntu">Menu Categories</h3>
        <Dialog open={showAddDialog} onOpenChange={(open) => {
          setShowAddDialog(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button variant="part1" className="bg-secondary hover:bg-secondary/90 rounded-lg px-6 py-4 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md w-[100%] max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="bg-white p-4">
              <DialogTitle className="text-foreground font-bold text-xl">Add New Category</DialogTitle>
              <DialogDescription className="text-secondary">
                Create a new menu category.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 bg-[#f5f6fb] p-4 overflow-y-auto flex-1">
              <div>
                <Label htmlFor="name" className="text-gray-700">Category Name*</Label>
                <Input
                  id="name"
                  placeholder="e.g., Funzo, Main Dishes, Desserts"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white border border-gray-400 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-gray-700">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Optional category description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-white border border-gray-400 mt-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive" className="text-gray-700">Active</Label>
              </div>
              <Button onClick={handleAdd} className="w-full bg-secondary rounded-md cursor-pointer">
                Create Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-primary/50 bg-white">
        <CardContent className="p-4">
          {categories.length > 0 ? (
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{category.name}</h4>
                    {category.description && (
                      <p className="text-sm text-gray-500">{category.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {category.menuItems?.length || 0} items • {category.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="edit" onClick={() => handleEdit(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="delete" onClick={() => {
                      setSelectedCategory(category)
                      setShowDeleteDialog(true)
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No categories yet. Create your first category to organize your menu items.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md w-[100%] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="bg-white p-4">
            <DialogTitle className="text-foreground font-bold text-xl">Edit Category</DialogTitle>
            <DialogDescription className="text-secondary">
              Update category details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 bg-[#f5f6fb] p-4 overflow-y-auto flex-1">
            <div>
              <Label htmlFor="edit-name" className="text-gray-700">Category Name*</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Funzo, Main Dishes, Desserts"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white border border-gray-400 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-description" className="text-gray-700">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Optional category description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-white border border-gray-400 mt-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="edit-isActive" className="text-gray-700">Active</Label>
            </div>
            <Button onClick={handleUpdate} className="w-full bg-secondary rounded-md cursor-pointer">
              Update Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md border-none rounded-lg">
          <DialogHeader className="bg-white p-4 rounded-lg">
            <DialogTitle className="text-foreground font-bold text-xl">Delete Category</DialogTitle>
            <DialogDescription className="text-secondary">
              Are you sure you want to delete "{selectedCategory?.name}"? All menu items in this category will also be deleted. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 bg-[#f5f6fb] p-4">
            <Button 
              variant="outline" 
              className="border-secondary text-secondary hover:bg-secondary hover:text-white"
              onClick={() => {
                setShowDeleteDialog(false)
                setSelectedCategory(null)
              }}
            >
              Cancel
            </Button>
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
