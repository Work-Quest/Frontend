import { useState } from "react"; // Import useState
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "./ui/button"

type NotificationDialogProps = {
  title: string
  description: string
  trigger?: React.ReactNode
  onConfirm?: () => void
  onCancel?: () => void
}

export default function NotificationDialog({
  title,
  description,
  trigger,
  onConfirm,
  onCancel,
}: NotificationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleCancel = () => {
    setIsOpen(false);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}> 
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>{trigger}</DialogTrigger> 
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button onClick={handleCancel}>Cancel</Button>
          {onConfirm && <Button onClick={() => { setIsOpen(false); onConfirm(); }}>Confirm</Button>} 
        </div>
      </DialogContent>
    </Dialog>
  )
}