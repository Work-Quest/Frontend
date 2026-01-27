"use client"

import Leaderboard from "@/components/Leaderboard"
import type { UserScore, UserProfile } from "@/types/User"
import ProfileCard from "@/sections/home/ProfileCard"
import ProjectTab, { type FilterState } from "@/sections/home/ProjectTab"
import { useState, useMemo } from "react"
import Fuse from "fuse.js"
import { Input } from "@/components/ui/input"
import { useProjects } from "@/hook/useProjects"
import { post } from "@/Api"
import { Project } from "@/types/Project"

const userMockData: UserScore[] = [
  { order: 1, name: "Michael", username: "michaelza550", score: 12040 },
  { order: 2, name: "William", username: "williamshake", score: 11522 },
  { order: 3, name: "Sophia", username: "sophispark", score: 9245 },
  { order: 4, name: "Oliver", username: "oliverwave", score: 9176 },
  { order: 5, name: "Isabella", username: "isabellaflare", score: 8530 },
  { order: 6, name: "Michael1", username: "michaelza5501", score: 8520 },
  { order: 7, name: "Michael2", username: "michaelza5502", score: 8500 },
]

const mockProfile: UserProfile = {
  name: "John Doe",
  username: "littleJohn",
  profileImg: "/mockImg/profile.svg",
  tag: [
    {
      id: "tag1",
      tagName: "Zombie of the group",
      description: "Always active at midnighr are you a zombie???",
    },
    {
      id: "tag2",
      tagName: "Strategist",
      description: "Always plans the next move with precision.",
    },
  ],
  bossCollection: [
    {
      id: "boss1",
      bossName: "Flame King",
      img: "/mockImg/boss1.svg",
      defeated: true,
    },
    {
      id: "boss2",
      bossName: "Abyss Serpent",
      img: "/mockImg/boss2.svg",
      defeated: true,
    },
    {
      id: "boss3",
      bossName: "Doggy",
      img: "/mockImg/boss3.svg",
      defeated: true,
    },
  ],
}

type BatchDeleteResponse = {
  deleted_projects: string[]
  failed_projects: {
    project_id: string
    error: string
  }[]
}


function Home() {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    status: null,
    owner: null,
  })
  const { projects, loading, updateProject, deleteProject } = useProjects()
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


  return (
    <div className="h-[calc(100vh-140px)] w-screen overflow-hidden p-4 bg-offWhite">
      <div className="flex flex-col lg:flex-row lg:gap-4 h-full">
        {/* Left Section */}
        <div className="flex flex-col w-full lg:w-2/5 xl:w-1/3 gap-4 lg:pr-4 h-full">
          <div className="h-auto flex-shrink-0">
            <ProfileCard data={mockProfile} />
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="border-2 border-gray-200 bg-offWhite rounded-3xl p-4 h-full">
              <Leaderboard user={userMockData} />
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
              <ProjectTab data={filteredAndSearchedResults} onFilterChange={handleFilterChange} onUpdateProject={updateProject} onDelete={deleteProject} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
