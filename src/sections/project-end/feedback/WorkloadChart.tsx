import { parseDailyWorkload } from './parseDailyWorkload'

const TRACK_HEIGHT_PX = 112
const BAR_COLOR = '#FFA166'
const BAR_MIN_VISIBLE_PX = 4

const MAX_DAYS = 30

type WorkloadChartProps = {
  work_load_per_day: unknown
}

const WorkloadChart = ({ work_load_per_day }: WorkloadChartProps) => {
  const loads = parseDailyWorkload(work_load_per_day)
  const series = loads.slice(-MAX_DAYS)
  const n = series.length
  const max = Math.max(...series.map((v) => (Number.isFinite(v) ? v : 0)), 0)
  const scale = max > 0 ? 1 / max : 0

  const heading =
    n === 0
      ? 'Daily workload'
      : n === 1
        ? 'Last 1 day daily workload'
        : `Last ${n} days daily workload`

  return (
    <div className="mt-8 pt-6 border-t border-brown/10 w-full min-w-0">
      <p className="text-base font-bold text-darkBrown font-baloo2 mb-4">{heading}</p>
      {n === 0 ? (
        <p className="text-sm text-lightBrown font-baloo2">
          No daily workload data available yet.
        </p>
      ) : (
        <div className="w-full min-w-0 px-3 py-5 sm:px-5 sm:py-6 box-border">
          <div className="grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] gap-2 sm:gap-3 items-center">
            <div className="text-[10px] sm:text-xs text-[#948B81] font-baloo2 leading-tight shrink-0 w-9 sm:w-11">
              <div>Month</div>
              <div>Ago</div>
            </div>

            <div
              className="grid w-full min-w-0 gap-1 sm:gap-1.5 items-center"
              style={{
                height: TRACK_HEIGHT_PX,
                gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
              }}
            >
              {series.map((load, i) => {
                const v = Number.isFinite(load) ? load : 0
                const hPx =
                  max > 0 && v > 0
                    ? Math.max(BAR_MIN_VISIBLE_PX, Math.round(v * scale * TRACK_HEIGHT_PX))
                    : 0
                return (
                  <div
                    key={i}
                    className="flex min-w-0 h-full w-full items-center justify-center"
                    title={`Day ${i + 1}: ${v}`}
                  >
                    <div
                      className="w-full rounded-md min-w-0 max-w-full"
                      style={{
                        height: hPx,
                        backgroundColor: BAR_COLOR,
                        boxShadow: hPx > 0 ? '0 1px 2px rgba(0,0,0,0.06)' : undefined,
                      }}
                    />
                  </div>
                )
              })}
            </div>

            <div className="text-[10px] sm:text-xs text-[#948B81] font-baloo2 leading-tight shrink-0 text-right w-9 sm:w-11">
              <div>End</div>
              <div>Day</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkloadChart
