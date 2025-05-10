import TeamSummaryBox from "@/sections/project-end/TeamSummaryBox";
import Leaderboard from "@/components/Leaderboard";
import type { UserScore } from "../sections/project-end/User.ts";
import Achievement from "@/sections/project-end/Achievement.tsx";
import Feedback from "@/sections/project-end/feedback/Feedback.tsx";

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

export const userInfoMockData = [
    {
        "user_name": "Ejqjn28",
        "work_load_per_day": "[7,7,6,6,5,6,6,7,5,7,7,6,6,5,6,6,7,5,7,7,6,6,5,6,6,7,5,7,7,6,6,5,6,6,7,5,7,7,6,6,5,6,6,7,5,7,7,6,6,5,3,6,7,1]",
        "team_work": 65.27,
        "work_category": "Testing",
        "work_speed": 36.31,
        "overall_quality_score": 53.45
    }
]

export const tagMockData = [
    "Last-minute Best friend",
    "Zombie of the group",
]

function ProjectEnd() {
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
                    <Leaderboard user={userMockData} />
                </div>

                {/* Right Section - Team Summary Boxes */}
                <div className="w-full lg:w-2/3 xl:w-3/4 p-4 bg-offWhite overflow-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {userMockData.map((user) => (
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
            <Achievement tags={tagMockData} />
            <Feedback users={userInfoMockData} />
        </div>
    );
}

export default ProjectEnd;
