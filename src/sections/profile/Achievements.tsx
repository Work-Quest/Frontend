'use client'

import { useState } from 'react'
import BadgeContainer from "@/components/BadgeContainer"
import AchievementModal from "@/components/AchievementModal"
import {
  ACHIEVEMENT_IDS,
  getAchievementImagePath,
  getAchievementName,
  getAchievementDescription,
} from "@/lib/achievementConstants"
import { useAchievements } from "@/hook/useAchievements"

function AchievementsSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 border-2 rounded-lg border-veryLightBrown animate-pulse">
      <div className="h-8 w-40 bg-veryLightBrown/60 rounded" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square w-full max-w-[80px] rounded-md bg-veryLightBrown/50"
          />
        ))}
      </div>
      <div className="h-10 w-full rounded-md bg-veryLightBrown/40" />
    </div>
  )
}

export default function Achievements() {
  const { achievementIds, loading, error } = useAchievements()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const unlockedSet = new Set<string>(achievementIds)

  const badges = ACHIEVEMENT_IDS.map((id) => ({
    id,
    image: getAchievementImagePath(id),
    name: getAchievementName(id),
    description: getAchievementDescription(id),
    locked: !unlockedSet.has(id),
  }))

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-4 border-2 rounded-lg border-veryLightBrown">
        <p className="!text-2xl font-bold font-['Baloo_2'] text-darkBrown">Achievements</p>
        <p className="!text-sm !text-red-600">{error}</p>
      </div>
    )
  }

  if (loading) {
    return <AchievementsSkeleton />
  }

  return (
    <>
      <BadgeContainer
        title="Achievements"
        badges={badges}
        buttonText="View All Achievements"
        onViewAll={() => setIsModalOpen(true)}
      />
      <AchievementModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        badges={badges}
      />
    </>
  )
}