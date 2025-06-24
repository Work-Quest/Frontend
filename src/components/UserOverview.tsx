import { FaUserGroup } from "react-icons/fa6";
import { PiNewspaperClippingFill } from "react-icons/pi";
import { RiSwordFill } from "react-icons/ri";
import { GiAchievement } from "react-icons/gi";

interface UserStats {
    friendCount: number;
    projectCount: number;
    bossDefeated: number;
    achievements: string;
}

interface StatItem {
    icon: React.ElementType;
    label: string;
    value: string | number;
}

interface StatBoxProps extends StatItem {}

const StatBox = ({ icon: Icon, label, value }: StatBoxProps) => (
    <div className="flex flex-col items-center justify-center mx-auto">
        <div className="flex flex-col items-center justify-center">
            <Icon className="w-8 h-auto" />
            <p className="!font-medium !text-white">{label}</p>
        </div>
        <p className="!text-2xl !font-bold !text-white">{value}</p>
    </div>
);

export default function UserOverview() {
    const userStats: UserStats = {
        friendCount: 0,
        projectCount: 0,
        bossDefeated: 0,
        achievements: "0/0",
    };

    const stats: StatItem[] = [
        { icon: FaUserGroup, label: "Friends", value: userStats.friendCount },
        { icon: PiNewspaperClippingFill, label: "Projects", value: userStats.projectCount },
        { icon: RiSwordFill, label: "Boss Defeated", value: userStats.bossDefeated },
        { icon: GiAchievement, label: "Achievements", value: userStats.achievements },
    ];

    return (
        <div className="flex flex-row items-center justify-between h-full gap-4 p-5 rounded-md bg-orange">
            <div className="flex flex-row items-center justify-center w-full gap-4 rounded-md text-offWhite">
                {stats.map((stat, index) => (
                    <StatBox key={index} {...stat} />
                ))}
            </div>
        </div>
    );
}
