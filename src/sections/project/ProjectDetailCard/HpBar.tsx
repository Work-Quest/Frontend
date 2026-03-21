type Props = {
  label: string
  current: number
  max: number
  color: string
}

function clamp(n: number, min: number, maxVal: number) {
  return Math.min(maxVal, Math.max(min, n))
}

const HpBar = ({ label, current, max, color }: Props) => {
  const displayMax = typeof max === 'number' && Number.isFinite(max) && max > 0 ? max : 0
  const safeMax = displayMax > 0 ? displayMax : 1
  const safeCurrent = typeof current === 'number' && Number.isFinite(current) ? current : 0
  const percent = clamp((safeCurrent / safeMax) * 100, 0, 100)

  return (
    <div className="flex w-full min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
      <div className="flex min-w-0 shrink-0 items-baseline justify-between gap-2 sm:block sm:w-[5.5rem] sm:shrink-0">
        <div className="truncate text-xs font-bold text-darkBrown font-baloo2 sm:text-sm">
          {label}
        </div>
        <div className="shrink-0 text-right tabular-nums -mt-2 sm:text-left">
          <span
            className={`text-xs font-bold font-baloo2 sm:text-sm ${
              color === 'green' ? 'text-green' : 'text-orange'
            }`}
          >
            {Math.round(safeCurrent)}
          </span>
          <span className="text-xs font-medium text-darkBrown font-baloo2 sm:text-sm">
            /{Math.round(displayMax)}
          </span>
        </div>
      </div>
      <div className="h-5 min-h-[1.25rem] w-full min-w-0 flex-1 overflow-hidden rounded-md bg-cream sm:h-6 sm:min-h-[1.5rem]">
        <div
          className={`h-full max-w-full rounded-md ${color === 'green' ? 'bg-green' : 'bg-orange'}`}
          style={{ width: `${percent}%` }}
          {...(displayMax > 0
            ? {
                role: 'progressbar' as const,
                'aria-valuenow': Math.round(safeCurrent),
                'aria-valuemin': 0,
                'aria-valuemax': Math.round(displayMax),
                'aria-label': label,
              }
            : { 'aria-hidden': true as const })}
        />
      </div>
    </div>
  )
}

export default HpBar
