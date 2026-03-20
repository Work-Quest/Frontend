"use client"

import Leaderboard from "@/components/Leaderboard"
import type { UserProfile } from "@/types/User"
import type { Boss } from "@/types/Boss"
import ProfileCard from "@/sections/home/ProfileCard"
import ProjectTab, { type FilterState } from "@/sections/home/ProjectTab"
import { useState, useMemo } from "react"
import Fuse from "fuse.js"
import { Input } from "@/components/ui/input"
import { useProjects } from "@/hook/useProjects"
import { useLeaderboard } from "@/hook/useLeaderboard"
import { useAuth } from "@/context/AuthContext"
import { useUserDefeatedBosses } from "@/hook/useUserDefeatedBosses"
import { getBossConfigId } from "@/utils/bossMapping"
import LoadingSpinner from "@/components/LoadingSpinner"


function Home() {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    status: null,
    owner: null,
  })
  const { projects, loading, updateProject, deleteProject } = useProjects()
  const { leaderboard, loading: leaderboardLoading, error: leaderboardError } = useLeaderboard()
  const { user } = useAuth()
  const { defeatedBosses, loading: bossesLoading, error: bossesError } = useUserDefeatedBosses()

  // Transform defeated bosses to Boss[] type with idle gif paths
  const bossCollection: Boss[] = useMemo(() => {
    return defeatedBosses.map((boss) => {
      const configId = getBossConfigId(boss.name)
      return {
        id: boss.id,
        bossName: boss.name,
        img: `/assets/sprites/bosses/${configId}/idle.gif`,
        defeated: true,
      }
    })
  }, [defeatedBosses])

  // Create UserProfile from real data
  const userProfile: UserProfile = useMemo(() => {
    return {
      name: user?.name,
      username: user?.username,
      selectedCharacterId: user?.selected_character_id ?? 1,
      bgColorId: user?.bg_color_id ?? 1,
      tag: [], // No backend support for tags
      bossCollection: bossCollection,
    }
  }, [user, bossCollection])

  const fuse = useMemo(() => {
    return new Fuse(projects, {
      keys: ["project_name", "owner_username", "status"],
    })
  }, [projects])

  const filteredAndSearchedResults = useMemo(() => {
    let results = projects

    if (query.trim() !== "") {
      results = fuse.search(query).map(r => r.item)
    }

    if (filters.status) {
      results = results.filter(p => p.status === filters.status)
    }

    if (filters.owner) {
      results = results.filter(p => p.owner_username === filters.owner)
    }

    return results
  }, [query, filters, projects, fuse])

  const handleSearch = (value: string) => {
    setQuery(value)
  }

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const profileLoading = !user || bossesLoading


  return (
    <div className="h-[calc(100vh-140px)] w-screen overflow-hidden p-4 bg-offWhite">
      <div className="flex flex-col lg:flex-row lg:gap-4 h-full">
        {/* Left Section */}
        <div className="flex flex-col w-full lg:w-2/5 xl:w-1/3 gap-4 lg:pr-4 h-full">
          <div className="h-auto flex-shrink-0">
            {profileLoading ? (
              <div className="bg-orange rounded-3xl p-4 flex items-center justify-center h-[200px]">
                <LoadingSpinner size="md" />
              </div>
            ) : bossesError ? (
              <div className="bg-orange rounded-3xl p-4 flex items-center justify-center h-[200px] text-red-500">
                Error loading profile data
              </div>
            ) : (
              <ProfileCard data={userProfile} user_id={user.id} />
            )}
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="border-2 border-gray-200 bg-offWhite rounded-3xl p-4 h-full">
              {leaderboardLoading ? (
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner size="md" />
                </div>
              ) : leaderboardError ? (
                <div className="flex items-center justify-center h-full text-red-500">
                  Error: {leaderboardError}
                </div>
              ) : leaderboard && leaderboard.length > 0 ? (
                <Leaderboard user={leaderboard} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No leaderboard data available
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Right Section */}
        <div className="flex flex-col w-full lg:w-3/5 xl:w-2/3 h-full">
          {/* Header */}
          <div className="flex bg-orange rounded-t-xl justify-center items-center flex-shrink-0 py-3 w-70">
            <h3 className="!text-offWhite text-xl font-bold">Projects</h3>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col p-4 border-2 border-veryLightBrown rounded-b-xl rounded-r-xl bg-white min-h-0">
            {/* Search Bar */}
            <div className="w-full flex flex-col gap-2 items-stretch flex-shrink-0 h-[60px]">
              <Input
                type="search"
                placeholder="Search projects..."
                className="w-full bg-offWhite rounded-lg font-['Baloo_2'] h-10"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Project Tab with Filter */}
            <div className="flex-1 min-h-0">
              <ProjectTab
                data={filteredAndSearchedResults}
                allData={projects}
                filters={filters}
                onFilterChange={handleFilterChange}
                onUpdateProject={updateProject}
                onDelete={deleteProject}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
