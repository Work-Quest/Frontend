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

 export default function TutorialImagePagination({
   items,
   reverse = false,
   className = "",
 }: TutorialImagePaginationProps) {
   const [activeIndex, setActiveIndex] = useState(0)

   const safeItems = items.length > 0 ? items : []
   const activeItem = safeItems[activeIndex] ?? safeItems[0]

   if (!activeItem) return null

   return (
     <div
       className={cn(
         "flex flex-col lg:justify-center lg:items-center justify-center items-center gap-8 lg:gap-12 max-w-6xl mx-auto",
         reverse ? "lg:flex-row-reverse" : "lg:flex-row",
         className,
       )}
     >
       <div
         className={cn(
           "flex flex-col justify-center items-center max-w-md lg:max-w-lg",
           reverse ? "lg:items-end text-center lg:text-right" : "lg:items-start text-center lg:text-left",
         )}
       >
         <h2 className="!text-red text-xl sm:text-2xl lg:text-3xl font-bold mb-4">{activeItem.title}</h2>
         <p className="text-sm sm:text-base">{activeItem.description}</p>
       </div>

       <div className={cn("flex flex-col items-center", reverse ? "lg:items-start" : "lg:items-end")}>
         <img
           src={activeItem.imageSrc}
           alt={activeItem.imageAlt}
           className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80 object-contain"
         />

         {/* Thumbnails pagination - click to change tutorial text/image */}
         {safeItems.length > 1 && (
           <div className={cn("mt-3 flex gap-3 justify-center", reverse ? "lg:justify-start" : "lg:justify-end")}>
             {safeItems.map((item, idx) => {
               const isActive = idx === activeIndex
               return (
                 <button
                   key={`${item.title}-${idx}`}
                   type="button"
                   onClick={() => setActiveIndex(idx)}
                   aria-label={`Tutorial step ${idx + 1}`}
                   className={cn(
                     "rounded-lg border-2 overflow-hidden transition-all",
                     isActive ? "border-orange" : "border-transparent hover:border-veryLightBrown",
                   )}
                 >
                   <img
                     src={item.imageSrc}
                     alt={item.imageAlt}
                     className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain bg-offWhite/40"
                   />
                 </button>
               )
             })}
           </div>
         )}
       </div>
     </div>
   )
 }


