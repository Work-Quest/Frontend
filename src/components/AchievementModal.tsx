'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  ACHIEVEMENT_IDS,
  getAchievementName,
  getAchievementDescription,
  getAchievementImagePath,
} from '../lib/achievementConstants'
import Modal from './Modal'

interface Badge {
  id?: string
  image?: string
  name?: string
  description?: string
  locked?: boolean
}

interface AchievementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  badges?: Badge[]
}

export default function AchievementModal({
  open,
  onOpenChange,
  badges = [],
}: AchievementModalProps) {
  const allAchievements = ACHIEVEMENT_IDS.map((id) => {
    const defaultName = getAchievementName(id)
    const userBadge = badges.find((b) => b.id === id || b.name === defaultName)

    return {
      id,
      name: userBadge?.name || defaultName,
      description: userBadge?.description || getAchievementDescription(id),
      image: userBadge?.image || getAchievementImagePath(id),
      locked: userBadge ? userBadge.locked : true,
    }
  })

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="All Achievements"
      showCloseButton
    >
      <TooltipProvider>
        <div className="grid grid-cols-3 gap-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {allAchievements.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center justify-start gap-3 text-center"
            >
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <div
                    className={`flex items-center justify-center w-20 h-20 transition-all cursor-help p-1.5 ${
                      badge.locked ? 'grayscale opacity-40' : 'hover:scale-105'
                    }`}
                  >
                    <img
                      src={badge.image}
                      alt={badge.name}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="!font-['Baloo_2'] !bg-darkBrown !text-white !border-none !z-[100] !px-3 !py-1.5 !max-w-[200px] !text-center !rounded-md">
                  <p className="!text-white !text-sm leading-tight">
                    {badge.description || badge.name}
                  </p>
                </TooltipContent>
              </Tooltip>
              <div>
                <p className="!font-bold !text-darkBrown !text-sm leading-tight">
                  {badge.name}
                </p>
                <p className="!text-xs !text-brown mt-0.5 line-clamp-2">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </TooltipProvider>
    </Modal>
  )
}

