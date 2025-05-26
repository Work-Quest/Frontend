"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { UserProfile } from "@/types/User"

type ProfileCardProps = {
  data: UserProfile
}

export default function ProfileCard({ data }: ProfileCardProps) {
  const [currentBossIndex, setCurrentBossIndex] = useState(0)

  const nextBoss = () => {
    setCurrentBossIndex((prev) => (prev + 1) % data.bossCollection.length)
  }

  const prevBoss = () => {
    setCurrentBossIndex((prev) => (prev - 1 + data.bossCollection.length) % data.bossCollection.length)
  }

  return (
    <div className="flex items-center gap-6 w-full max-w-4xl mx-auto">
      {/* Original Profile Card */}
      <div className="relative w-full max-w-sm">
        <div className="aspect-[1.6/1] h-auto bg-orange rounded-2xl overflow-hidden shadow-md rotate-2 hover:-rotate-1 transition-all transiton-duration-400 ease-in-out">
          <div className="h-10 relative bg-[#f7f7f7] bg-[url('data:image/svg+xml,%3Csvg%20width=%27100%27%20height=%2720%27%20viewBox=%270%200%20100%2020%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath%20d=%27M21.184%2020c.357-.13.72-.264%201.088-.402l1.768-.661C33.64%2015.347%2039.647%2014%2050%2014c10.271%200%2015.362%201.222%2024.629%204.928.955.383%201.869.74%202.75%201.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888%2013.278%2060.562%2012%2050%2012c-10.626%200-16.855%201.397-26.66%205.063l-1.767.662c-2.475.923-4.66%201.674-6.724%202.275h6.335zm0-20C13.258%202.892%208.077%204%200%204V2c5.744%200%209.951-.574%2014.85-2h6.334zM77.38%200C85.239%202.966%2090.502%204%20100%204V2c-6.842%200-11.386-.542-16.396-2h-6.225zM0%2014c8.44%200%2013.718-1.21%2022.272-4.402l1.768-.661C33.64%205.347%2039.647%204%2050%204c10.271%200%2015.362%201.222%2024.629%204.928C84.112%2012.722%2089.438%2014%20100%2014v-2c-10.271%200-15.362-1.222-24.629-4.928C65.888%203.278%2060.562%202%2050%202%2039.374%202%2033.145%203.397%2023.34%207.063l-1.767.662C13.223%2010.84%208.163%2012%200%2012v2z%27%20fill=%27%23e2edf3%27%20fillOpacity=%270.61%27%20fillRule=%27evenodd%27/%3E%3C/svg%3E')] bg-repeat bg-[length:100px_20px] flex items-center justify-center before:content-[''] before:flex-1 before:border-t before:border-2 before:border-gray-300 after:content-[''] after:flex-1 after:border-t after:border-2 after:border-gray-300 gap-4 px-4">
            <h3 className="!text-gray-600 font-semibold">Profile</h3>
          </div>

          {/* Card content */}
          <div className="flex items-center p-4 h-[calc(100%-2rem)]">
            {/* Profile picture section */}
            <div className="relative mr-4">
              <div className="relative">
                <div className="w-30 h-30 rounded-2xl bg-white/40 p-1 transform rotate-1">
                  <img
                    src={data.profileImg || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover object-top rounded-xl"
                  />
                </div>
              </div>
              <div className="absolute z-2 -bottom-5 -right-6 rotate-6 opacity-70">
                <img src="/id-card-stamp.svg" alt="Profile" className="" />
              </div>
            </div>

            {/* Info section */}
            <div className="flex-1 space-y-2">
              {/* Name */}
              <div className="px-3 border-b border-offWhite">
                <p className="!text-xs uppercase tracking-wide !font-medium -mb-3">Full Name</p>
                <h2 className="font-bold text-lg leading-tight">{data.name}</h2>
              </div>

              {/* Username */}
              <div className="px-3 py-1 -mb-1">
                <p className="!text-xs  uppercase tracking-wide !font-medium">Username</p>
                <p className="!font-semibold">@{data.username || "player"}</p>
              </div>

              {/* Tags as small badges */}
              <div className="flex flex-wrap gap-1">
                {data.tag.slice(0, 2).map((tag, index) => (
                  <span key={index} className="text-sm px-2 py-1 bg-white/30 rounded-full font-medium backdrop-blur-sm">
                    {tag.tagName}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Boss Collection Section */}
      {data.bossCollection && data.bossCollection.length > 0 && (
        <div className="relative">
            {/* Boss Image Stack */}
            <div className="relative flex items-center justify-center">
              {/* Navigation Arrows */}
              <button
                onClick={prevBoss}
                className="absolute left-0 z-10 !bg-white hover:!bg-gray-50 !rounded-full !p-2 !shadow-md transform hover:scale-110 transition-all duration-200 !border !border-gray-300"
                disabled={data.bossCollection.length <= 1}
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>

              {/* Image Stack Container */}
              <div className="relative w-50 h-50 mx-8">
                {data.bossCollection.map((boss, index) => {
                  const isActive = index === currentBossIndex
                  const offset = index - currentBossIndex

                  return (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                        isActive
                          ? "z-20 scale-100 opacity-100 rotate-0"
                          : `z-10 scale-90 opacity-60 ${
                              offset > 0 ? "translate-x-6 rotate-4" : "translate-x--4 rotate--7"
                            }`
                      }`}
                      style={{
                        transform: `translateX(${offset * 8}px) rotate(${offset * 3}deg) scale(${isActive ? 1 : 0.9})`,
                      }}
                    >
                      <div className="w-full h-full bg-white rounded-lg p-1 shadow-md border border-gray-200">
                        <img
                          src={boss.img || "/placeholder.svg"}
                          alt="boss"
                          className="w-full h-full object-cover rounded cursor-pointer hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                onClick={nextBoss}
                className="absolute right-0 z-10 !bg-white hover:!bg-gray-50 !rounded-full !p-2 !shadow-md transform hover:scale-110 transition-all duration-200 !border !border-gray-300"
                disabled={data.bossCollection.length <= 1}
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="text-center mt-3">
              <p className="text-gray-700 font-medium text-sm">
                {data.bossCollection[currentBossIndex]?.bossName || `Boss ${currentBossIndex + 1}`}
              </p>
            </div>
          </div>
      )}
    </div>
  )
}
