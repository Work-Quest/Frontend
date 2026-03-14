import TeamSummaryBox from "@/sections/project-end/TeamSummaryBox";
import Leaderboard from "@/components/Leaderboard";
import type { UserScore } from "../sections/project-end/User.ts";
import Achievement from "@/sections/project-end/Achievement.tsx";
import Feedback from "@/sections/project-end/feedback/Feedback.tsx";
import { useParams } from "react-router-dom";
import { useProjectEndSummary } from "@/hook/useProjectEndSummary";


const userMockData: UserScore[] = [
    {
        order: 1,
        name: "You",
        username: "michaelza550",
        score: 12040,
        damageDeal: 12243,
        damageReceive: 200,
        status: "Alive",
        isMVP: true,
    },
    {
        order: 2,
        name: "William",
        username: "williamshake",
        score: 11522,
        damageDeal: 11000,
        damageReceive: 250,
        status: "Alive",
        isMVP: false,
    },
    {
        order: 3,
        name: "Sophia",
        username: "sophispark",
        score: 9245,
        damageDeal: 9500,
        damageReceive: 400,
        status: "Alive",
        isMVP: false,
    },
    {
        order: 4,
        name: "Oliver",
        username: "oliverwave",
        score: 9176,
        damageDeal: 8800,
        damageReceive: 500,
        status: "Alive",
        isMVP: false,
    },
    {
        order: 5,
        name: "Isabella",
        username: "isabellaflare",
        score: 8530,
        damageDeal: 8700,
        damageReceive: 300,
        status: "Alive",
        isMVP: false,
    },
    {
        order: 6,
        name: "Michael1",
        username: "michaelza5501",
        score: 8520,
        damageDeal: 8200,
        damageReceive: 600,
        status: "Dead",
        isMVP: false,
    },
]


export const tagMockData = [
    "Last-minute Best friend",
    "Zombie of the group",
]

function ProjectEnd() {
    const { projectId } = useParams()
    const { summary, loading, error } = useProjectEndSummary(projectId)

    // Use real data if available, otherwise fall back to mock data
    const userData = summary?.users ?? userMockData
    const tags = summary ? [] : tagMockData // TODO: Get real tags from API when available
    const hasScoreReductions = summary?.reduction_percent;

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

            {hasScoreReductions && (
                <div className="mt-2 bg-cream rounded-lg items-center border-2 border-red">
                    <p className="font-bold !text-red px-2">Delay Penalty {summary.reduction_percent}% score reduction </p>
                </div>
            )}
            {/* Main Content */}
            <div className="flex flex-col lg:flex-row flex-1">
                {/* Left Section - Leaderboard */}
                <div className="w-full lg:w-1/3 xl:w-2/5 p-4 bg-offWhite overflow-auto">
                    <Leaderboard user={userData} />
                </div>

                {/* Right Section - Team Summary Boxes */}
                <div className="w-full lg:w-2/3 xl:w-3/4 p-4 bg-offWhite overflow-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {userData.map((user) => (
                            <TeamSummaryBox
                                key={user.username}
                                user={{
                                    name: user.name,
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


            <Achievement tags={tags} />
            <Feedback projectId={projectId ?? ""} />
        </div>
    );
}

export default ProjectEnd;
