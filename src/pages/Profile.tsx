import UserInfo from '../sections/profile/UserInfo'
import FinishedProjectsHistory from '../components/FinishedProjectsHistory'
import UserOverview from '@/components/UserOverview'
import Achievement from '../sections/profile/Achievements'
import BossDefeated from '@/sections/profile/BossDefeated'
import { useParams } from 'react-router-dom'

export default function Profile() {
  const { userId } = useParams<{ userId: string }>()

  return (
    <>
      <div className="p-8 h-[calc(100vh-140px)] overflow-hidden flex items-start gap-4">
        <div className="w-[550px] h-full flex flex-col gap-4">
          <div className="shrink-0">
            <UserInfo userId={userId} />
          </div>
          <div className="flex-1 min-h-0">
            <FinishedProjectsHistory userId={userId} />
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4 h-full min-h-0">
          <div className="flex-1 min-h-0">
            <UserOverview userId={userId} />
          </div>
          <div className="shrink-0">
            <Achievement />
          </div>
          <div className="shrink-0">
            <BossDefeated userId={userId} />
          </div>
        </div>
      </div>
    </>
  )
}
