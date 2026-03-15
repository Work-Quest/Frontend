import { PiNewspaperClippingFill } from "react-icons/pi";
import { RiSwordFill } from "react-icons/ri";
import { GiAchievement } from "react-icons/gi";
import { MdOutlineSportsScore } from "react-icons/md";
import { useUserProfileStats } from "@/hook/useUserProfileStats";

interface StatItem {
    icon: React.ElementType;
    label: string;
    value: string | number;
}

type StatBoxProps = StatItem

const StatBox = ({ icon: Icon, label, value }: StatBoxProps) => (
    <div className="flex flex-col items-center justify-center mx-auto">
        <div className="flex flex-col items-center justify-center">
            <Icon className="w-8 h-auto" />
            <p className="!font-medium !text-white">{label}</p>
        </div>
        <p className="!text-2xl !font-bold !text-white">{value}</p>
    </div>
);

interface UserOverviewProps {
    userId?: string;
}

export default function UserOverview({ userId }: UserOverviewProps) {
    const { stats, loading } = useUserProfileStats(userId);

    const userStats = {
        highestScore: stats?.highest_score || 0,
        projectCount: stats?.project_count || 0,
        bossDefeated: stats?.total_bosses_defeated || 0,
        achievements: "0/0", // Keep as mock data
    };

    const statsList: StatItem[] = [
        { icon: MdOutlineSportsScore, label: "Highest score", value: loading ? "..." : userStats.highestScore.toLocaleString() },
        { icon: PiNewspaperClippingFill, label: "Projects", value: loading ? "..." : userStats.projectCount },
        { icon: RiSwordFill, label: "Boss Defeated", value: loading ? "..." : userStats.bossDefeated },
        { icon: GiAchievement, label: "Achievements", value: userStats.achievements },
    ];

    return (
        <div className="flex flex-row items-center justify-between h-full gap-4 p-5 rounded-md bg-orange">
            <div className="flex flex-row items-center justify-center w-full gap-4 rounded-md text-offWhite">
                {statsList.map((stat, index) => (
                    <StatBox key={index} {...stat} />
                ))}
            </div>
        </div>
    );
}
