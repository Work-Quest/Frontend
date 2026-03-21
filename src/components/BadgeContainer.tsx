'use client'

import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { getAchievementImagePath, type AchievementId } from '../lib/achievementConstants'

interface Badge {
  id?: string
  image?: string
  name?: string
  description?: string
  locked?: boolean
}

interface BadgeContainerProps {
  title?: string
  badges?: Badge[]
  buttonText?: string
  onViewAll?: () => void
  previewCount?: number
}

export default function BadgeContainer({
  title,
  badges = [],
  buttonText = 'View All Badges',
  onViewAll,
  previewCount = 6,
}: BadgeContainerProps) {
  const previewBadges = badges.slice(0, previewCount)

  return (
    <div className="flex flex-col gap-3 p-4 border-2 rounded-lg border-veryLightBrown">
      <p className="!text-2xl font-bold font-baloo2 text-darkBrown">{title}</p>
      <div>
        {previewBadges.length > 0 ? (
          <TooltipProvider>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {previewBadges.map((badge, index) => (
                <Tooltip key={index} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center cursor-help">
                      <img
                        src={
                          badge.image ||
                          (badge.id ? getAchievementImagePath(badge.id as AchievementId) : '')
                        }
                        alt={badge.name || `Badge ${index + 1}`}
                        className={`w-full h-auto rounded-md ${
                          badge.locked ? 'grayscale opacity-50' : ''
                        }`}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="!font-baloo2 !bg-darkBrown !text-white !border-none !z-50 !px-3 !py-1.5 !rounded-md">
                    <p className="!text-white !text-sm">{badge.description || badge.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        ) : (
          <p className="!text-gray-500 font-baloo2 text-sm">No badges available</p>
        )}
      </div>
      {onViewAll && (
        <Button
          variant="default"
          className="!font-bold w-full font-baloo2 !text-sm !py-2"
          onClick={onViewAll}
        >
          {buttonText}
        </Button>
      )}
    </div>
  )
}
