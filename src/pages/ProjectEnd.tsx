import TeamSummaryBox from '@/sections/project-end/TeamSummaryBox'
import Leaderboard from '@/components/Leaderboard'
import Achievement from '@/sections/project-end/Achievement.tsx'
import SpecialAwards from '@/sections/project-end/SpecialAwards'
import AchievementModal from '@/components/AchievementModal'
import { useProjectEndSummary } from '@/hook/useProjectEndSummary'
import Feedback from '@/sections/project-end/feedback/Feedback.tsx'
import useFeedback from '@/sections/project-end/feedback/useFeedback'
import {
  ACHIEVEMENT_IDS,
  getAchievementDescription,
  getAchievementImagePath,
  getAchievementName,
  type AchievementId,
} from '@/lib/achievementConstants'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const ACHIEVEMENT_IDS_SET = new Set<string>(ACHIEVEMENT_IDS)

const END_SUMMARY_GRID =
  'grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-[430px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]'

function ProjectEnd() {
  const { projectId } = useParams()
  const { user } = useAuth()
  const { summary, loading, error } = useProjectEndSummary(projectId)

  const userData = useMemo(() => summary?.users ?? [], [summary?.users])
  const hasScoreReductions = summary?.reduction_percent
  const { feedback, loading: feedbackLoading, fetchFeedback } = useFeedback(projectId ?? '')
  const [achievementsModalOpen, setAchievementsModalOpen] = useState(false)

  useEffect(() => {
    if (projectId) void fetchFeedback()
  }, [projectId, fetchFeedback])

  const achievementNames = useMemo(() => {
    const ids = feedback?.achievement_ids ?? []
    return ids
      .filter((id): id is AchievementId => typeof id === 'string' && ACHIEVEMENT_IDS_SET.has(id))
      .map((id) => getAchievementName(id))
  }, [feedback?.achievement_ids])

  const unlockedAchievementIds = useMemo(() => {
    const ids = feedback?.achievement_ids ?? []
    return new Set(
      ids.filter((id): id is AchievementId => typeof id === 'string' && ACHIEVEMENT_IDS_SET.has(id))
    )
  }, [feedback?.achievement_ids])

  const achievementBadges = useMemo(
    () =>
      ACHIEVEMENT_IDS.map((id) => ({
        id,
        image: getAchievementImagePath(id),
        name: getAchievementName(id),
        description: getAchievementDescription(id),
        locked: !unlockedAchievementIds.has(id),
      })),
    [unlockedAchievementIds]
  )

  const sortedMembers = useMemo(() => {
    const uid = user?.id
    if (!uid) return userData
    return [...userData].sort((a, b) => {
      if (a.user_id === uid) return -1
      if (b.user_id === uid) return 1
      return 0
    })
  }, [userData, user?.id])

  if (loading) {
    return (
      <div className="flex flex-col min-h-[60vh] items-center justify-center bg-[#f5f5f5] px-4">
        <p className="text-darkBrown font-baloo2">Loading project summary…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-[60vh] items-center justify-center bg-[#f5f5f5] px-4">
        <p className="text-red-600 font-baloo2">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-12">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {hasScoreReductions ? (
          <div
            role="status"
            className="rounded-xl border-2 border-red bg-cream px-4 py-3 flex items-center gap-2"
          >
            <span className="font-bold text-red font-baloo2">
              Delay penalty: {summary.reduction_percent}% score reduction applied
            </span>
          </div>
        ) : null}

        <section className={`${END_SUMMARY_GRID} items-stretch`}>
          <div className="space-y-3 w-full max-w-[430px] lg:max-w-none lg:w-[430px] lg:shrink-0 min-w-0">
            <div className="rounded-2xl bg-white border border-brown/10 p-4 shadow-sm">
              <Leaderboard user={userData} />
            </div>
          </div>

          <div className="space-y-3 min-w-0 lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-0">
              {sortedMembers.map((u) => (
                <TeamSummaryBox
                  key={u.user_id ?? `${u.username}-${u.order}`}
                  isYou={Boolean(user?.id && u.user_id === user.id)}
                  user={{
                    name: u.name,
                    score: u.score,
                    damageDeal: u.damageDeal,
                    damageReceive: u.damageReceive,
                    status: u.status,
                    isMVP: u.isMVP,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="min-w-0 lg:col-span-2">
            <Achievement
              tags={achievementNames}
              loading={feedbackLoading}
              onSeeAll={() => setAchievementsModalOpen(true)}
            />
          </div>
          {userData.length > 0 ? (
            <SpecialAwards users={userData} currentUserId={user?.id} embedded />
          ) : null}
        </section>

        <div className="w-full min-w-0">
          <Feedback projectId={projectId ?? ''} />
        </div>
      </div>

      <AchievementModal
        open={achievementsModalOpen}
        onOpenChange={setAchievementsModalOpen}
        badges={achievementBadges}
      />
    </div>
  )
}

export default ProjectEnd
