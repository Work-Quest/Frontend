import type React from "react"
import type { Task } from "./types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteConfirmationOverlayProps {
  task: Task
  onCancel: () => void
  onConfirm: () => void
}

export const DeleteConfirmationOverlay: React.FC<DeleteConfirmationOverlayProps> = ({ task, onCancel, onConfirm }) => {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md bg-offWhite">
        <DialogHeader>
          <DialogTitle className="text-darkBrown">Delete Task?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span className="font-semibold">{task.title}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={onCancel} className="!bg-offWhite !border-lightBrown !text-darkBrown hover:!bg-cream !font-['Baloo_2']">
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="!bg-red hover:!bg-red-500 !font-['Baloo_2']">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
