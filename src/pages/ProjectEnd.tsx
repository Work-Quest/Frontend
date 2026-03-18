import TeamSummaryBox from "@/sections/project-end/TeamSummaryBox";
import Leaderboard from "@/components/Leaderboard";
import Achievement from "@/sections/project-end/Achievement.tsx";
import { useProjectEndSummary } from "@/hook/useProjectEndSummary";
import Feedback from '@/sections/project-end/feedback/Feedback.tsx'
import useFeedback from '@/sections/project-end/feedback/useFeedback'
import { getAchievementName, type AchievementId } from '@/lib/achievementConstants'
import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

const ACHIEVEMENT_IDS_SET = new Set<string>(['01', '02', '03', '04', '05', '06'])

function ProjectEnd() {
    const { projectId } = useParams()
    const { summary, loading, error } = useProjectEndSummary(projectId)

    const userData = summary?.users ?? []
    const hasScoreReductions = summary?.reduction_percent;
    const { feedback, loading: feedbackLoading, fetchFeedback } = useFeedback(projectId ?? '')

    useEffect(() => {
        if (projectId) void fetchFeedback()
    }, [projectId, fetchFeedback])

    const achievementNames = useMemo(() => {
        const ids = feedback?.achievement_ids ?? []
        return ids
            .filter((id): id is AchievementId => typeof id === 'string' && ACHIEVEMENT_IDS_SET.has(id))
            .map((id) => getAchievementName(id))
    }, [feedback?.achievement_ids])

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen p-4 items-center justify-center">
                <p className="text-darkBrown">Loading project summary...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen p-4 items-center justify-center">
                <p className="text-red-600">Error: {error}</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen p-4">
            {/* Header Section */}
            <div className="bg-red-400 p-4 shadow-md">
                <h2 className="text-2xl md:text-3xl font-bold !text-white">Project End!</h2>
            </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1">
        {/* Left Section - Leaderboard */}
        <div className="w-full lg:w-1/3 xl:w-2/5 p-4 bg-offWhite overflow-auto">
          <Leaderboard user={userData} />
        </div>
            {hasScoreReductions && (
                <div className="mt-2 bg-cream rounded-lg items-center border-2 border-red">
                    <p className="font-bold !text-red px-2">Delay Penalty {summary.reduction_percent}% score reduction </p>
                </div>
            )}
                {/* Right Section - Team Summary Boxes */}
                <div className="w-full lg:w-2/3 xl:w-3/4 p-4 bg-offWhite overflow-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {userData.map((user) => (
                            <TeamSummaryBox
                                key={user.username}
                                user={{
                                    name: user.name,
                                    score: user.score,
                                    damageDeal: user.damageDeal,
                                    damageReceive: user.damageReceive,
                                    status: user.status,
                                    isMVP: user.isMVP,
                                }}
                            />
                        ))}
                    </div>

                </div>
            </div>


            <Achievement tags={achievementNames} loading={feedbackLoading} />
            <Feedback projectId={projectId ?? ""} />
        </div>
            );
}

export default ProjectEnd;
