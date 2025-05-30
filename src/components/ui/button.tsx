import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-150 relative cursor-pointer select-none uppercase leading-none focus:!outline-none hover!outline-none hover!border-none",
  {
    variants: {
      variant: {
        default: "!bg-offWhite text-orange !border-veryLightBrown !border-2 shadow-[0_4px_0_0_#d6cec4] hover:shadow-[0_2px_0_0_#d6cec4] hover:translate-y-0.5 active:shadow-[0_0px_0_0_#d6cec4] active:translate-y-1 !font-['Baloo_2']",
        destructive: "bg-red-600 text-white shadow-[0_4px_0_0_#b91c1c] hover:shadow-[0_2px_0_0_#b91c1c] hover:translate-y-0.5 active:shadow-[0_0px_0_0_#b91c1c] active:translate-y-1 font-['Baloo_2']",
        success: "bg-green-600 text-white shadow-[0_4px_0_0_#15803d] hover:shadow-[0_2px_0_0_#15803d] hover:translate-y-0.5 active:shadow-[0_0px_0_0_#15803d] active:translate-y-1 font-['Baloo_2']",
        warning: "bg-orange-600 text-white shadow-[0_4px_0_0_#c2410c] hover:shadow-[0_2px_0_0_#c2410c] hover:translate-y-0.5 active:shadow-[0_0px_0_0_#c2410c] active:translate-y-1 font-['Baloo_2']",
        purple: "bg-purple-600 text-white shadow-[0_4px_0_0_#7e22ce] hover:shadow-[0_2px_0_0_#7e22ce] hover:translate-y-0.5 active:shadow-[0_0px_0_0_#7e22ce] active:translate-y-1 font-['Baloo_2']",
        pink: "bg-pink-600 text-white shadow-[0_4px_0_0_#be185d] hover:shadow-[0_2px_0_0_#be185d] hover:translate-y-0.5 active:shadow-[0_0px_0_0_#be185d] active:translate-y-1 font-['Baloo_2']",
        orange: "!bg-orange text-white shadow-[0_4px_0_0_#c2410c] hover:shadow-[0_2px_0_0_#c2410c] hover:translate-y-0.5 active:shadow-[0_0px_0_0_#c2410c] active:translate-y-1 font-['Baloo_2']",
        cream: "!bg-cream text-darkBrown shadow-[0_4px_0_0_#948B81] hover:shadow-[0_2px_0_0_#948B81] hover:translate-y-0.5 active:shadow-[0_0px_0_0_#948B81] active:translate-y-1 !font-['Baloo_2']",
        golden: "bg-yellow-500 text-yellow-900 shadow-[0_4px_0_0_#ca8a04] hover:shadow-[0_2px_0_0_#ca8a04] hover:translate-y-0.5 active:shadow-[0_0px_0_0_#ca8a04] active:translate-y-1 font-['Baloo_2']",
        outline: "bg-gray-200 text-gray-800 shadow-[0_4px_0_0_#4b5563] hover:shadow-[0_2px_0_0_#4b5563] hover:translate-y-0.5 active:shadow-[0_0px_0_0_#4b5563] active:translate-y-1 font-['Baloo_2']",
        ghost: "bg-transparent text-offWhite/50 shadow-none hover:text-offWhite font-['Baloo_2']",
        neon: "bg-cyan-600 text-white shadow-[0_4px_0_0_#0e7490] hover:shadow-[0_2px_0_0_#0e7490] hover:translate-y-0.5 active:shadow-[0_0px_0_0_#0e7490] active:translate-y-1 font-['Baloo_2']",
        pagination: "bg-transparent !text-offWhite border-transparent font-['Baloo_2']",
        shadow: "!border !border-b-5 !border-black/30 text-gray-800 active:translate-y-1 !font-['Baloo_2']"
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
