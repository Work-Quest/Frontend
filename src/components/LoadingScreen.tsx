import LoadingSpinner from "./LoadingSpinner"

interface LoadingScreenProps {
  message?: string
  className?: string
}

export default function LoadingScreen({
  message = "Loading your quest...",
  className = "",
}: LoadingScreenProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[200px] gap-4 ${className}`}
      role="status"
      aria-live="polite"
    >
      <LoadingSpinner size="lg" />
      <p className="font-['Baloo_2'] text-brown/80 text-sm font-medium animate-pulse">
        {message}
      </p>
    </div>
  )
}
