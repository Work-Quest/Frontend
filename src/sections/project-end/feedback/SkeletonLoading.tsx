const SkeletonLoading = () => {
  return (
    <div className="animate-pulse">
      <div className="mt-6 border-t border-veryLightBrown pt-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-7 w-32 bg-cream rounded-lg" />
          <div className="h-6 w-24 bg-yellow/40 rounded-full" />
        </div>

        <div className="p-4 bg-cream/60 rounded-lg border-2 border-veryLightBrown">
          <div className="h-5 w-48 bg-veryLightBrown/80 rounded mb-3" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-veryLightBrown/60 rounded" />
            <div className="h-3 w-full bg-veryLightBrown/60 rounded" />
            <div className="h-3 w-[80%] bg-veryLightBrown/60 rounded" />
            <div className="h-3 w-[83%] bg-veryLightBrown/60 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonLoading
