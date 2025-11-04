"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { MenuItem } from "@/types/menu"


interface EditMenuItemModalProps {
  open: boolean
  onClose: () => void
  item: MenuItem | null
  onSave: (updatedItem: MenuItem) => void
}

export  function EditModal({
  open,
  onClose,
  item,
  onSave,
}: EditMenuItemModalProps) {
  const [editItem, setEditItem] = useState<MenuItem | null>(item)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)

  // Sync item into local state when modal opens
  useEffect(() => {
    if (item) {
      setEditItem(item)
      setImagePreview(item.image || null)
      setSelectedImageFile(null) // Reset file when opening new item
    }
  }, [item])

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImageFile(file) // Store the actual file
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string) // Show preview
      }
      reader.readAsDataURL(file)
    }
  }

  // Save handler
  const handleSave = () => {
    if (editItem) {
      // Attach the image file to the item if uploaded
      const itemToSave = {
        ...editItem,
        imageFile: selectedImageFile, // Add file for upload
      }
      onSave(itemToSave as any)
      onClose()
    }
  }

  if (!editItem) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[50%] w-[40%] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="bg-white p-4">
          <DialogTitle className="text-foreground font-bold text-xl">Edit Menu Item</DialogTitle>
          <DialogDescription className="text-secondary">
          Fill in the details for your new menu item.
              </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 bg-[#f5f6fb] p-4">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="mb-2 text-gray-400">Name</Label>
            <Input
              id="name"
              className="bg-white border border-gray-400"
              value={editItem.name}
              onChange={(e) =>
                setEditItem({ ...editItem, name: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="mb-2 text-gray-400">Description</Label>
            <Textarea
            className="bg-white border border-gray-400"
              id="description"
              value={editItem.description}
              onChange={(e) =>
                setEditItem({ ...editItem, description: e.target.value })
              }
            />
          </div>

          {/* Allergy */}
          <div>
            <Label htmlFor="allergy" className="mb-2 text-gray-400">Allergy</Label>
            <Input
              className="bg-white border border-gray-400"
              id="allergy"
              placeholder="e.g., Dairy, Nuts, Gluten"
              value={editItem.allergy || ""}
              onChange={(e) =>
                setEditItem({ ...editItem, allergy: e.target.value })
              }
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category" className="mb-2 text-gray-400">Category</Label>
            <Input
            className="bg-white border border-gray-400"
              id="category"
              value={editItem.category}
              onChange={(e) =>
                setEditItem({ ...editItem, category: e.target.value })
              }
            />
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price" className="mb-2 text-gray-400">Price</Label>
            <Input
            className="bg-white border border-gray-400"
              id="price"
              type="number"
              value={editItem.price}
              onChange={(e) =>
                setEditItem({
                  ...editItem,
                  price: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>

          {/* Image */}
          <div>
            <Label htmlFor="image" className="mb-2 text-gray-400">Image</Label>
            <div className="space-y-2">
              <Input
              className="bg-white border border-gray-400"
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {imagePreview && (
                <div className="flex justify-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-lg object-cover border-2 border-orange-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center space-x-2">
            <Switch
              id="available"
              checked={editItem.isAvailable}
              onCheckedChange={(checked) =>
                setEditItem({ ...editItem, isAvailable: checked })
              }
            />
            <Label htmlFor="available">Available</Label>
          </div>
          <div className="text-right flex gap-3 justify-end">

          <Button  onClick={onClose} className="rounded-lg border hover:bg-secondary hover:text-white border-secondary bg-transparent text-secondary">
            Cancel
          </Button>
          <Button
            className="bg-secondary  hover:bg-transparent hover:border-secondary border border-transparent hover:text-secondary  rounded-lg"
            onClick={handleSave}
            >
            Save Changes
          </Button>
            </div>
        </div>

        <DialogFooter>
        
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
