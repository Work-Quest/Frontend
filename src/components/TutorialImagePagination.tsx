 "use client"

 import { useState } from "react"
 import { cn } from "@/lib/utils"

 export type TutorialImagePaginationItem = {
   title: string
   description: string
   imageSrc: string
   imageAlt: string
 }

 type TutorialImagePaginationProps = {
   items: TutorialImagePaginationItem[]
   reverse?: boolean
   className?: string
 }

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

 export default function TutorialImagePagination({
   items,
   reverse = false,
   className = "",
 }: TutorialImagePaginationProps) {
   const [activeIndex, setActiveIndex] = useState(0)
    
   const safeItems = items.length > 0 ? items : []
   const activeItem = safeItems[activeIndex] ?? safeItems[0]

  const isPrevDisabled = activeIndex <= 0
  const isNextDisabled = activeIndex >= safeItems.length - 1

  const goPrev = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0))
  }

  const goNext = () => {
    setActiveIndex((prev) => Math.min(prev + 1, safeItems.length - 1))
  }

   if (!activeItem) return null

   return (
     <div
       className={cn(
         "flex flex-col lg:items-center items-center gap-8 lg:gap-12 max-w-5xl mx-auto", className,
       )}
     >
       <div
         className={cn(
          "flex flex-col w-full",
          reverse ? "items-end text-right" : "items-start text-left",
         )}
       >
         <h2 className="!text-red text-xl sm:text-2xl lg:text-3xl font-bold mb-4">{activeItem.title}</h2>
         <p className="text-sm sm:text-base">{activeItem.description}</p>
       </div>

       <div className={cn("flex flex-col items-center", reverse ? "lg:items-start" : "lg:items-end")}>
         <img
           src={activeItem.imageSrc}
           alt={activeItem.imageAlt}
          className="w-full h-full"
         />

        {/* Arrow pagination - switch tutorial text/image */}
         {safeItems.length > 1 && (
          <div
            className={cn(
              "mt-3 flex items-center gap-3 justify-center",
              reverse ? "lg:justify-start" : "lg:justify-end",
            )}
          >
            <button
              type="button"
              onClick={goPrev}
              disabled={isPrevDisabled}
              aria-label="Previous tutorial step"
              className={cn(
                "rounded-full border transition-all p-2",
                isPrevDisabled
                  ? "border-veryLightBrown/50 text-veryLightBrown cursor-not-allowed"
                  : "border-veryLightBrown hover:border-orange text-brown",
              )}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={goNext}
              disabled={isNextDisabled}
              aria-label="Next tutorial step"
              className={cn(
                "rounded-full border transition-all p-2",
                isNextDisabled
                  ? "border-veryLightBrown/50 text-veryLightBrown cursor-not-allowed"
                  : "border-veryLightBrown hover:border-orange text-brown",
              )}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2" aria-label="Tutorial step indicator">
              {safeItems.map((_, index) => {
                const isActive = index === activeIndex
                return (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      isActive ? "bg-orange" : "bg-veryLightBrown",
                    )}
                    aria-hidden="true"
                  />
                )
              })}
            </div>
           </div>
         )}
       </div>
     </div>
   )
 }
