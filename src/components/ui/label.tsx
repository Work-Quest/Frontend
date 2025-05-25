import type * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm sm:text-base leading-none font-semibold select-none",
        "font-baloo2 text-gray-700 transition-colors duration-200",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        "peer-focus:text-blue-600 peer-focus:drop-shadow-sm",
        "relative",
        "hover:text-gray-800 cursor-pointer",
        "before:absolute before:-left-1 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-1",
        "before:bg-blue-400/60 before:rounded-full before:opacity-0 before:transition-opacity before:duration-200",
        "peer-focus:before:opacity-100",
        className,
      )}
      {...props}
    />
  )
}

export { Label }
