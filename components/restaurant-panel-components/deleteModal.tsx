"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MenuItem } from "@/types/menu"

type DeleteMenuItemModalProps = {
  open: boolean
  onClose: () => void
  item: MenuItem | null
  onDelete: (id: number) => void
}

export function DeleteModal({ open, onClose, item, onDelete }: DeleteMenuItemModalProps) {
  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="bg-white p-4">
          <DialogTitle>Delete Menu Item</DialogTitle>
          <DialogDescription className="text-secondary">
          Remove this dish from your active menu.
              </DialogDescription>
        </DialogHeader>
        <div className="bg-[#f5f6fb] p-4">
        <p className="text-sm text-gray-400 mb-3">
          Are you sure you want to delete <strong>{item.name}</strong>? This action cannot be undone.
        </p>
        <DialogFooter>
          <Button  className="rounded-lg border hover:bg-secondary hover:text-white border-secondary bg-transparent text-secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-secondary  hover:bg-transparent hover:border-secondary border border-transparent hover:text-secondary  rounded-lg" onClick={() => onDelete(item.id)}>
            Delete
          </Button>
        </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
