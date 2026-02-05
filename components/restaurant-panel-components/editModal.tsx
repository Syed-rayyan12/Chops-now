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
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([])

  // Sync item into local state when modal opens
  useEffect(() => {
    if (item) {
      setEditItem(item)
      // Load existing images
      if (item.images && item.images.length > 0) {
        setImagePreviews(item.images)
      } else if (item.image) {
        setImagePreviews([item.image])
      } else {
        setImagePreviews([])
      }
      setSelectedImageFiles([]) // Reset files when opening new item
    }
  }, [item])

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      // Add new files to existing ones
      const newFiles = [...selectedImageFiles, ...files]
      setSelectedImageFiles(newFiles)
      
      // Generate previews for new files
      const newPreviews: string[] = []
      files.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviews.push(reader.result as string)
          if (newPreviews.length === files.length) {
            setImagePreviews(prev => [...prev, ...newPreviews])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    setSelectedImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Save handler
  const handleSave = () => {
    if (editItem) {
      // Attach the image files to the item if uploaded
      const itemToSave = {
        ...editItem,
        imageFiles: selectedImageFiles.length > 0 ? selectedImageFiles : undefined, // Add files for upload
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

          {/* Images */}
          <div>
            <Label htmlFor="images" className="mb-2 text-gray-400">Images (Multiple)</Label>
            <div className="space-y-3">
              <Input
                className="bg-white border border-gray-400"
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
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
