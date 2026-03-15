import UserInfo from "../sections/profile/UserInfo"
import FinishedProjectsHistory from "../components/FinishedProjectsHistory"
import UserOverview from "@/components/UserOverview"
import Achievement from "../sections/profile/Achievements"
import BossDefeated from "@/sections/profile/BossDefeated"
import { useParams } from "react-router-dom"

export default function Profile() {
  const { userId } = useParams<{ userId: string }>()

  return (
    <>
      <div className="p-8 h-[calc(100vh-140px)] overflow-hidden flex items-center bg-offWhite gap-4">
        <div className="w-[550px] h-full flex flex-col gap-4">
          <UserInfo userId={userId} />
          <FinishedProjectsHistory userId={userId} />
        </div>
        <div className="grid grid-rows-5 flex-1 h-full gap-4">
          <div>
            <UserOverview userId={userId} />
          </div>
          <div className="row-span-2">
            <Achievement />
          </div>
          <div className="row-span-2">
            <BossDefeated userId={userId} />
          </div>
        </div>
      </div>
    </>
  )
}
