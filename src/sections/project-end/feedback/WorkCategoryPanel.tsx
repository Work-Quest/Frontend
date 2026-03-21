import { resolveWorkCategory } from '@/constants/workCategories'

type WorkCategoryPanelProps = {
  strength: string | null | undefined
}

export function WorkCategoryPanel({ strength }: WorkCategoryPanelProps) {
  const { title, description, imageSrc } = resolveWorkCategory(strength)

  return (
    <div className="rounded-2xl bg-orange p-5 sm:p-6 text-offWhite">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
        <div className="flex-1 min-w-0 space-y-3">
          <p className="!text-sm sm:text-base !font-medium !text-offWhite">Your Task Categories</p>
          <h3 className="!text-2xl sm:text-3xl !font-bold !text-offWhite leading-tight tracking-tight">
            {title}
          </h3>
          <p className="!font-medium !text-offWhite leading-relaxed">{description}</p>
        </div>

        <div className="shrink-0 flex justify-center sm:justify-end sm:w-[140px] md:w-[160px]">
          <img
            src={imageSrc}
            alt=""
            className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] object-contain select-none pointer-events-none"
            draggable={false}
            onError={(e) => {
              const el = e.currentTarget
              el.onerror = null
              el.style.opacity = '0'
            }}
          />
        </div>
      </div>
    </div>
  )
}
