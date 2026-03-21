'use client'

import type { UserProfile } from '@/types/User'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { getAvatarProfilePath, getColorValueById } from '@/constants/avatar'
import { TOTAL_BOSS_COUNT } from '@/config/battleConfig'

type ProfileCardProps = {
  data: UserProfile
  user_id: string
}

export default function ProfileCard({ data, user_id }: ProfileCardProps) {
  const defeatedList = (data.bossCollection ?? []).filter((b) => b.defeated)
  const defeatedCount = defeatedList.length
  const visibleBosses = defeatedList.slice(0, 3)
  const extraBossCount = Math.max(0, defeatedCount - 3)
  const navigate = useNavigate()
  const handleProfileClick = () => {
    if (user_id) {
      navigate(`/profile/${user_id}`)
    }
  }
  return (
    <div className="w-full mx-auto">
      <div className="bg-orange rounded-3xl p-4 flex flex-col gap-4">
        {/* Main Profile Section */}
        <div className="flex items-center gap-4">
          {/* Profile Image */}
          <div className="w-[100px] h-[100px] relative">
            <div
              className="w-full h-full rounded-[10px] overflow-hidden"
              style={{ backgroundColor: getColorValueById(data.bgColorId) }}
            >
              <img
                src={getAvatarProfilePath(data.selectedCharacterId)}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget
                  target.onerror = null
                  target.src = '/mockImg/profile.svg'
                }}
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 flex flex-col gap-2">
            {/* Name and Username */}
            <div className="flex flex-col">
              <h3 className="!text-offWhite">{data.name}</h3>
              <p className="!text-cream -mt-2">@{data.username || 'player'}</p>
            </div>

            {/* Boss Collection Indicators */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center">
                {visibleBosses.map((boss, index) => (
                  <div
                    key={boss.id}
                    className={`w-[39px] h-[39px] rounded-full overflow-hidden shrink-0 ${
                      index > 0 ? '-ml-2' : ''
                    }`}
                    style={{ zIndex: visibleBosses.length - index }}
                    title={boss.bossName}
                  >
                    <img
                      src={boss.img || '/placeholder.svg'}
                      alt={boss.bossName}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        const el = e.currentTarget
                        el.onerror = null
                        el.src = '/mockImg/boss1.svg'
                      }}
                    />
                  </div>
                ))}
                {extraBossCount > 0 && (
                  <span
                    className="-ml-1 pl-2 text-sm font-extrabold text-cream shrink-0"
                    title={`${extraBossCount} more`}
                  >
                    +{extraBossCount}
                  </span>
                )}
              </div>

              <div className="w-auto flex flex-col">
                <p className="!text-offWhite text-base !font-medium">
                  {defeatedCount}/{TOTAL_BOSS_COUNT}
                </p>
                <p className="!text-cream !font-medium -mt-2">Boss Defeated</p>
              </div>
            </div>
          </div>
        </div>

        {/* See Full Profile Button */}
        <Button
          className="flex justify-center items-center cursor-pointer "
          onClick={handleProfileClick}
        >
          See Full Profile
        </Button>
      </div>
    </div>
  )
}
