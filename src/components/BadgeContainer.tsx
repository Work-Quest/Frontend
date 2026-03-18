'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  ACHIEVEMENT_IDS,
  getAchievementName,
  getAchievementDescription,
  getAchievementImagePath,
  type AchievementId,
} from '../lib/achievementConstants'

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
}

export default function BadgeContainer(props: BadgeContainerProps) {
  const { title, badges = [], buttonText } = props
  const [isModalOpen, setIsModalOpen] = useState(false)

  const previewBadges = badges.slice(0, 6)

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
    <>
      <div className="flex flex-col gap-4 p-4 border-2 rounded-lg border-veryLightBrown">
        <p className="!text-2xl font-bold font-['Baloo_2'] text-darkBrown">{title}</p>
        <div>
          {previewBadges.length > 0 ? (
            <TooltipProvider>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
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
                    <TooltipContent className="!font-['Baloo_2'] !bg-darkBrown !text-white !border-none !z-50 !px-3 !py-1.5 !rounded-md">
                      <p className="!text-white !text-sm">{badge.description || badge.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          ) : (
            <p className="!text-gray-500 font-['Baloo_2']">No badges available</p>
          )}
        </div>
        <Button
          variant="default"
          className="!font-bold w-full font-['Baloo_2']"
          onClick={() => setIsModalOpen(true)}
        >
          {buttonText || 'View All Badges'}
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          variant="normal"
          showCloseButton
          className="!w-[66.666vw] !min-w-[320px] !max-w-[95vw] h-[80vh] min-h-[420px] max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col font-['Baloo_2']"
        >
          <div className="flex flex-col flex-1 min-h-0 rounded-lg overflow-hidden bg-offWhite/90">
            <DialogTitle className="sr-only">All Achievements</DialogTitle>

            <div className="flex items-center justify-between px-6 py-4 border-b border-darkBrown/10 shrink-0">
              <h2 className="text-2xl font-bold text-darkBrown font-['Baloo_2']">
                All Achievements
              </h2>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden px-6 py-6 bg-cream/40">
              <ScrollArea className="h-full pr-4">
                <TooltipProvider>
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {allAchievements.map((badge) => (
                      <div
                        key={badge.id}
                        className="flex flex-col items-center justify-start gap-3 text-center"
                      >
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <div
                              className={`flex items-center justify-center w-24 h-24 transition-all cursor-help p-2 ${
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
                          <p className="!text-xs !text-brown mt-1 line-clamp-2">
                            {badge.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TooltipProvider>
              </ScrollArea>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-darkBrown/10 shrink-0">
              <Button
                variant="default"
                className="px-6 font-['Baloo_2'] !font-bold"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
