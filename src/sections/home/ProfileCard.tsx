"use client"

import type { UserProfile } from "@/types/User"
import { Button } from "@/components/ui/button"

type ProfileCardProps = {
  data: UserProfile
}

export default function ProfileCard({ data }: ProfileCardProps) {
  const defeatedBosses = data.bossCollection?.filter(boss => boss.defeated).length || 3
  const totalBosses = data.bossCollection?.length || 7

  return (
    <div className="w-full mx-auto">
      <div className="bg-orange rounded-3xl p-4 flex flex-col gap-4">
        {/* Main Profile Section */}
        <div className="flex items-center gap-4">
          {/* Profile Image */}
          <div className="w-[70px] h-[107px] relative">
            <div className="w-full h-full bg-[#b1dcff] rounded-[10px] border-[3px] border-[#faf9f6] overflow-hidden">
              <img
                src={data.profileImg || "/placeholder.svg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 flex flex-col gap-2">
            {/* Name and Username */}
            <div className="flex flex-col">
              <h3 className="!text-offWhite">
                {data.name}
              </h3>
              <p className="!text-cream -mt-2">
                @{data.username || "player"}
              </p>
            </div>

            {/* Boss Collection Indicators */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Boss Circles */}
              <div className="flex items-center">
                {/* Show up to 3 boss indicators */}
                {Array.from({ length: Math.min(3, totalBosses) }, (_, index) => (
                  <div
                    key={index}
                    className={`w-[39px] h-[39px] rounded-full border-[3px] border-[#faf9f6] ${
                      index < defeatedBosses 
                        ? index === 0 
                          ? 'bg-[#f6a9de]' 
                          : index === 1 
                          ? 'bg-[#938b80]' 
                          : 'bg-[#ff995a]'
                        : 'bg-gray-400'
                    } ${index > 0 ? '-ml-2' : ''}`}
                    style={{ zIndex: 3 - index }}
                  >
                    {data.bossCollection && data.bossCollection[index] && (
                      <img
                        src={data.bossCollection[index].img || "/placeholder.svg"}
                        alt={`Boss ${index + 1}`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Boss Count */}
              <div className="w-auto flex flex-col">
                <p className="!text-offWhite text-base !font-medium">
                  {defeatedBosses}/{totalBosses}
                </p>
                <p className="!text-cream !font-medium">
                  Boss Defeated
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* See Full Profile Button */}
        <Button className="flex justify-center items-center cursor-pointer">
          See Full Profile
        </Button>
      </div>
    </div>
  )
}