import React, { useState, useRef } from 'react'
import DeadlineBox from './DeadlineBox'
import EstimateBox from './EstimateBox'
import HpBar from './HpBar'
import MemberScoresModal from './MemberScoresModal'
import type { GameStatusResponse } from '@/types/GameApi'
import { Button } from '@/components/ui/button.tsx'
import { MoreVertical, X, BarChart3 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import NotificationDialog from '@/components/NotificationDialog'
import { DashboardModal } from '@/sections/project/Dashboard/DashboardModal'
import { useDashboard } from '@/hook/useDashboard'

type ProjectDetailCardProps = {
  hpData?: {
    boss?: { current?: number; max?: number }
    player?: { current?: number; max?: number }
  }
  projectData?: {
    deadline?: string
    daysLeft?: number
    delayedDays?: number
    isDelayed?: boolean
    estimatedTime?: number
  }
  userScore?: number
  gameStatus?: GameStatusResponse | null
  projectId?: string
  onCloseProject?: (projectId: string) => Promise<void>
}

const ProjectDetailCard: React.FC<ProjectDetailCardProps> = ({
  hpData = {},
  projectData = {},
  userScore = 0,
  gameStatus,
  projectId,
  onCloseProject,
}) => {
  const [isScoresModalOpen, setIsScoresModalOpen] = useState(false)
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false)
  const closeProjectTriggerRef = useRef<HTMLButtonElement>(null)
  const { dashboardData, loading: dashboardLoading } = useDashboard(projectId)
  const bossHp = hpData?.boss?.current || 0
  const maxBossHp = hpData?.boss?.max || 100
  const playerHp = hpData?.player?.current || 0
  const maxPlayerHp = hpData?.player?.max || 100

  const handleCloseProjectClick = () => {
    closeProjectTriggerRef.current?.click()
  }

  const handleCloseProjectConfirm = async () => {
    if (projectId && onCloseProject) {
      await onCloseProject(projectId)
    }
  }

  return (
    <div className="inline-flex w-full min-w-0 max-w-full flex-col items-start justify-start self-stretch bg-offWhite pr-2 sm:pr-3">
      <div className="inline-flex min-w-0 max-w-full items-center justify-between gap-2 self-stretch bg-blue px-4 py-2 sm:px-6">
        <h3 className="min-w-0 truncate !text-darkBlue2">Project's Detail</h3>
        {projectId && onCloseProject && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="p-1 rounded hover:bg-cream/50 text-darkBlue2 hover:text-darkBlue2/80 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-[140px] bg-offWhite border-lightBrown font-['Baloo_2']"
            >
              <DropdownMenuItem
                className="cursor-pointer focus:bg-cream"
                onClick={() => setIsDashboardModalOpen(true)}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onClick={handleCloseProjectClick}
              >
                <X className="w-4 h-4 mr-2" />
                Close Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="hidden">
        <NotificationDialog
          title="Close Project"
          description="Are you sure you want to close this project? This action cannot be undone."
          trigger={<button ref={closeProjectTriggerRef} />}
          onConfirm={handleCloseProjectConfirm}
        />
      </div>

      <div className="self-stretch border-b-[3px] border-lightBrown border-dashed inline-flex justify-start items-end flex-wrap content-end">
        <div className="flex-1 inline-flex flex-col justify-start items-start">
          <div className="self-stretch px-3 sm:px-4 py-2 inline-flex justify-start items-center gap-2">
            <div className="flex-1 flex flex-col sm:flex-row justify-start items-start gap-2 sm:gap-4">
              <DeadlineBox projectData={projectData} />
              <EstimateBox estimatedTime={projectData?.estimatedTime} />
            </div>
          </div>
        </div>
      </div>

      <div className="self-stretch inline-flex justify-start items-end flex-wrap content-end">
        <div className="flex-1 inline-flex flex-col justify-start items-start">
          <div className="flex w-full min-w-0 max-w-full flex-col items-start justify-center gap-3 self-stretch px-3 py-4 sm:px-6">
            <HpBar label="Boss HP" current={bossHp} max={maxBossHp} color="orange" />
            <HpBar label="Player HP" current={playerHp} max={maxPlayerHp} color="green" />
          </div>
        </div>
      </div>

      {/* User Score Section */}
      <div className="flex w-full min-w-0 max-w-full self-stretch px-4 pb-4 sm:px-6">
        <Button
          onClick={() => setIsScoresModalOpen(true)}
          className="w-full px-4 py-3 bg-orange rounded-lg justify-between hover:bg-cream/80 justify-between transition-colors cursor-pointer"
        >
          {/*<div className="flex gap-10  items-center ">*/}
          <span className="text-darkBrown font-bold text-sm sm:text-base">Your Score</span>
          <span className="text-orange font-bold text-lg sm:text-xl">
            {userScore.toLocaleString()}
          </span>
          {/*</div>*/}
        </Button>
      </div>

      <MemberScoresModal
        open={isScoresModalOpen}
        onOpenChange={setIsScoresModalOpen}
        gameStatus={gameStatus}
      />

      {projectId && (
        <DashboardModal
          open={isDashboardModalOpen}
          onOpenChange={setIsDashboardModalOpen}
          projectId={projectId}
          dashboardData={dashboardData}
          loading={dashboardLoading}
        />
      )}
    </div>
  )
}

export default ProjectDetailCard
