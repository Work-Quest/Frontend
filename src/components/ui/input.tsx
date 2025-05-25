import type * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="relative">
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
          "flex h-10 sm:h-11 w-full min-w-0 rounded-lg border-2 px-3 sm:px-4 py-2 text-sm sm:text-base outline-none",
          "transition-colors duration-200 ease-out font-baloo2",
          "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "bg-gradient-to-b from-white via-gray-50 to-gray-100",
          "border-gray-300 focus:border-blue-400",
          "focus:bg-gradient-to-b focus:from-blue-50 focus:via-white focus:to-blue-50",
          "relative overflow-hidden",
          "before:absolute before:top-2 before:left-3 before:w-3 before:h-3 before:bg-white/60 before:rounded-full before:blur-sm before:pointer-events-none",
          "after:absolute after:top-1.5 after:left-2.5 after:w-1.5 after:h-1.5 after:bg-white/80 after:rounded-full after:pointer-events-none",
          "sm:before:w-3.5 sm:before:h-3.5 sm:after:w-2 sm:after:h-2",
          "focus-visible:ring-4 focus-visible:ring-blue-200/50",
          "aria-invalid:border-red-400 aria-invalid:bg-gradient-to-b aria-invalid:from-red-50 aria-invalid:via-white aria-invalid:to-red-50",
          "aria-invalid:ring-4 aria-invalid:ring-red-200/50",
          className,
        )}
        {...props}
      />
    </div>
  )
}

export { Input }
