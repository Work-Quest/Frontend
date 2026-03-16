import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeMap = {
  sm: "w-6 h-6 border-2",
  md: "w-10 h-10 border-[3px]",
  lg: "w-14 h-14 border-4",
}

export default function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "rounded-full border-orange/30 border-t-orange animate-spin",
        sizeMap[size],
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  )
}
