import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none relative cursor-pointer select-none border-2 uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white border-blue-300 shadow-[0_4px_0_0_#1e40af] hover:shadow-[0_5px_0_0_#1e40af] active:shadow-[0_2px_0_0_#1e40af] active:translate-y-1 font-['Baloo_2']",
        destructive: "bg-red-600 text-white border-red-300 shadow-[0_4px_0_0_#dc2626] hover:shadow-[0_5px_0_0_#dc2626] active:shadow-[0_2px_0_0_#dc2626] active:translate-y-1 font-['Baloo_2']",
        success: "bg-green-600 text-white border-green-300 shadow-[0_4px_0_0_#16a34a] hover:shadow-[0_5px_0_0_#16a34a] active:shadow-[0_2px_0_0_#16a34a] active:translate-y-1 font-['Baloo_2']",
        warning: "bg-orange-600 text-white border-orange-300 shadow-[0_4px_0_0_#ea580c] hover:shadow-[0_5px_0_0_#ea580c] active:shadow-[0_2px_0_0_#ea580c] active:translate-y-1 font-['Baloo_2']",
        purple: "bg-purple-600 text-white border-purple-300 shadow-[0_4px_0_0_#9333ea] hover:shadow-[0_5px_0_0_#9333ea] active:shadow-[0_2px_0_0_#9333ea] active:translate-y-1 font-['Baloo_2']",
        pink: "bg-pink-600 text-white border-pink-300 shadow-[0_4px_0_0_#db2777] hover:shadow-[0_5px_0_0_#db2777] active:shadow-[0_2px_0_0_#db2777] active:translate-y-1 font-['Baloo_2']",
        golden: "bg-yellow-500 text-yellow-900 border-yellow-200 shadow-[0_4px_0_0_#d97706] hover:shadow-[0_5px_0_0_#d97706] active:shadow-[0_2px_0_0_#d97706] active:translate-y-1 font-['Baloo_2']",
        outline: "bg-gray-200 text-gray-800 border-gray-300 shadow-[0_4px_0_0_#6b7280] hover:shadow-[0_5px_0_0_#6b7280] active:shadow-[0_2px_0_0_#6b7280] active:translate-y-1 font-['Baloo_2']",
        ghost: "bg-transparent !text-offWhite/50 border-transparent hover:!text-offWhite font-['Baloo_2']",
        neon: "bg-cyan-600 text-white border-cyan-300 shadow-[0_4px_0_0_#0891b2] hover:shadow-[0_5px_0_0_#0891b2] active:shadow-[0_2px_0_0_#0891b2] active:translate-y-1 font-['Baloo_2']",
        pagination: "bg-transparent !text-offWhite border-transparent font-['Baloo_2']",
      },
      size: {
        default: "h-12 px-6 py-3 text-base has-[>svg]:px-4",
        sm: "h-10 px-4 py-2 text-sm has-[>svg]:px-3",
        lg: "h-14 px-8 py-4 text-lg has-[>svg]:px-6",
        xl: "h-16 px-10 py-5 text-xl has-[>svg]:px-8",
        icon: "size-12 text-lg",
        "icon-sm": "size-10 text-sm",
        "icon-lg": "size-14 text-xl",
      },
      glow: {
        none: "",
        subtle: "before:absolute before:inset-0 before:rounded-xl before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-200",
        intense: "before:absolute before:inset-0 before:rounded-xl before:bg-white/20",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: "none",
    },
  }
)

function Button({
  className,
  variant,
  size,
  glow,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    glow?: "none" | "subtle" | "intense"
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, glow, className }))}
      {...props}
    >
      {children}
    </Comp>
  )
}

export { Button, buttonVariants }
