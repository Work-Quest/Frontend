'use client'

import { ReactNode } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from './ui/button'

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  footer?: ReactNode
  className?: string
  showCloseButton?: boolean
  variant?: 'normal' | 'fancy'
}

export default function Modal({
  open,
  onOpenChange,
  title,
  children,
  footer,
  className = '',
  showCloseButton = true,
  variant = 'normal',
}: ModalProps) {
  const defaultFooter = (
    <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-darkBrown/10 shrink-0">
      <Button
        variant="default"
        className="px-6 font-['Baloo_2'] !font-bold"
        onClick={() => onOpenChange(false)}
      >
        Close
      </Button>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        variant={variant}
        showCloseButton={showCloseButton}
        className={`!w-[66.666vw] !min-w-[320px] !max-w-[95vw] h-[80vh] min-h-[420px] max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col font-['Baloo_2'] ${className}`}
      >
        <div className="flex flex-col flex-1 min-h-0 rounded-lg overflow-hidden bg-offWhite/90">
          <DialogTitle className="sr-only">{title}</DialogTitle>

          <div className="flex items-center justify-between px-6 py-4 border-b border-darkBrown/10 shrink-0">
            <h2 className="text-2xl font-bold text-darkBrown font-['Baloo_2']">{title}</h2>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden px-6 py-6 bg-cream/40">
            <ScrollArea className="h-full pr-4">{children}</ScrollArea>
          </div>

          {footer !== undefined ? footer : defaultFooter}
        </div>
      </DialogContent>
    </Dialog>
  )
}

