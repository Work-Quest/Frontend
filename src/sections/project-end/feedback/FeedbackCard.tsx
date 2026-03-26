import type { FeedbackResponse } from './types'
import WorkloadChart from './WorkloadChart'
import SkeletonLoading from './SkeletonLoading'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Users, Gauge, Medal, ListChecks, BriefcaseBusiness } from 'lucide-react'
import { WorkCategoryPanel } from '@/sections/project-end/feedback/WorkCategoryPanel'

interface FeedbackCardProps {
  feedbackData: FeedbackResponse | null
  loading?: boolean
  error?: string
  memberName?: string
}

function avgSpeedMinutes(work_speed: string | null | undefined): string {
  if (!work_speed) return '—'
  try {
    const arr = JSON.parse(work_speed) as unknown
    if (!Array.isArray(arr)) return '—'
    const nums = arr
      .map((x) => (typeof x === 'number' ? x : Number(x)))
      .filter((n) => Number.isFinite(n) && n !== 0)
    if (!nums.length) return '—'
    const sum = nums.reduce((a, b) => a + b, 0)
    return (sum / nums.length).toFixed(2)
  } catch {
    return '—'
  }
}

const FeedbackCard = ({ feedbackData, loading, error, memberName }: FeedbackCardProps) => {
  const teamwork =
    feedbackData?.team_work != null ? `${Number(feedbackData.team_work).toFixed(2)}%` : '—'
  const speed = avgSpeedMinutes(feedbackData?.work_speed ?? null)
  const quality =
    feedbackData?.overall_quality_score != null
      ? `${Number(feedbackData.overall_quality_score).toFixed(2)}/5`
      : '—'
  const diligence =
    feedbackData?.diligence != null ? `${Number(feedbackData.diligence).toFixed(2)}%` : '—'
  const roleAssigned = feedbackData?.role_assigned?.trim() || '—'

  return (
    <div className="rounded-2xl border border-brown/10 bg-white shadow-sm overflow-hidden w-full min-w-0 max-w-full">
      <div className="px-5 md:px-8 pt-6 pb-2">
        <h2 className="!text-2xl !font-bold !text-darkBrown border-b border-brown/10 pb-2">
          Individual
        </h2>
        <p className="!text-lightBrown !font-baloo2 !mt-1 !text-base">
          {memberName ? (
            <span className="text-darkBrown font-semibold">{memberName}</span>
          ) : (
            'Your performance'
          )}
        </p>
      </div>

      <div className="px-5 md:px-8 pb-6 w-full min-w-0">
        {loading ? (
          <div className="flex justify-end mb-4 items-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-cream/50 rounded-xl border border-veryLightBrown">
              <LoadingSpinner size="sm" />
              <span className="font-baloo2 text-brown/80 text-sm">Loading…</span>
            </div>
          </div>
        ) : null}

        {feedbackData && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div className="rounded-xl border border-brown/10 bg-offWhite p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-lightBrown">
                      <Users className="w-5 h-5 text-orange shrink-0" />
                      <span className="text-xs font-semibold font-baloo2 uppercase tracking-wide">
                        Teamwork
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-darkBrown font-baloo2 tabular-nums">
                      {teamwork}
                    </p>
                  </div>
                  <div className="rounded-xl border border-brown/10 bg-offWhite p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-lightBrown">
                      <Gauge className="w-5 h-5 text-orange shrink-0" />
                      <span className="text-xs font-semibold font-baloo2 uppercase tracking-wide">
                        Speed
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-darkBrown font-baloo2 tabular-nums">
                      {speed}
                      {speed !== '—' ? (
                        <span className="text-sm font-normal text-lightBrown ml-1">min</span>
                      ) : null}
                    </p>
                  </div>
                  <div className="rounded-xl border border-brown/10 bg-offWhite p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-lightBrown">
                      <Medal className="w-5 h-5 text-orange shrink-0" />
                      <span className="text-xs font-semibold font-baloo2 uppercase tracking-wide">
                        Quality score
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-darkBrown font-baloo2 tabular-nums">
                      {quality}
                    </p>
                  </div>
                  <div className="rounded-xl border border-brown/10 bg-offWhite p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-lightBrown">
                      <ListChecks className="w-5 h-5 text-orange shrink-0" />
                      <span className="text-xs font-semibold font-baloo2 uppercase tracking-wide">
                        Diligence
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-darkBrown font-baloo2 tabular-nums">
                      {diligence}
                    </p>
                  </div>
                  <div className="rounded-xl border border-brown/10 bg-offWhite p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-lightBrown">
                      <BriefcaseBusiness className="w-5 h-5 text-orange shrink-0" />
                      <span className="text-xs font-semibold font-baloo2 uppercase tracking-wide">
                        Role
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-darkBrown font-baloo2 break-words">
                      {roleAssigned}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 font-baloo2 text-darkBrown leading-relaxed">
                  {feedbackData.feedback_text ? (
                    <p className="text-sm md:text-base text-brown/90">
                      {feedbackData.feedback_text}
                    </p>
                  ) : null}
                </div>
              </div>

              <WorkCategoryPanel strength={feedbackData.strength} />
            </div>

            <div className="w-full min-w-0">
              <WorkloadChart work_load_per_day={feedbackData.work_load_per_day} />
            </div>
          </>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm font-baloo2">
            {error}
          </div>
        )}

        {loading && <SkeletonLoading />}
      </div>
    </div>
  )
}

export default FeedbackCard
