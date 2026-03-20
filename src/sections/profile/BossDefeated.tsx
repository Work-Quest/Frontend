import BadgeContainer from '@/components/BadgeContainer'
import { useUserDefeatedBosses } from '@/hook/useUserDefeatedBosses'
import { getBossConfigId } from '@/utils/bossMapping'
import LoadingSpinner from '@/components/LoadingSpinner'

interface BossDefeatedProps {
  userId?: string
}

export default function BossDefeated({ userId }: BossDefeatedProps) {
  const { defeatedBosses, loading, error } = useUserDefeatedBosses(userId)

  // Map boss names to config IDs and use static profile art (not idle animation)
  const bossBadges = defeatedBosses.map((boss) => {
    const configId = getBossConfigId(boss.name)
    return {
      image: `/assets/sprites/bosses/${configId}/profile.png`,
      name: boss.name,
    }
  })

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4 border-2 rounded-lg border-veryLightBrown">
        <p className="!text-2xl">Bosses Defeated</p>
        <div className="flex items-center justify-center h-[200px]">
          <LoadingSpinner size="md" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-4 border-2 rounded-lg border-veryLightBrown">
        <p className="!text-2xl">Bosses Defeated</p>
        <div className="flex items-center justify-center h-[200px] text-red-500">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <>
      <BadgeContainer
        title="Bosses Defeated"
        badges={bossBadges}
        buttonText="View All Bosses Defeated"
      />
    </>
  )
}
