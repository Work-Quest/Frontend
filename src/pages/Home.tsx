"use client"

import Leaderboard from "@/components/Leaderboard"
import type { UserScore, UserProfile } from "@/types/User"
import ProfileCard from "@/sections/home/ProfileCard"
import type { Project } from "@/types/Project"
import ProjectTab, { type FilterState } from "@/sections/home/ProjectTab"
import { useState, useMemo } from "react"
import Fuse from "fuse.js"
import { Input } from "@/components/ui/input"

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

const ProjectMockData: Project[] = [
  {
    ProjectID: "a1f4b0c2-5e3f-44f5-9d2e-93d621f9c111",
    OwnerID: "u1234567-89ab-cdef-0123-456789abcdef",
    OwnerName: "You",
    ProjectName: "Quest Master",
    CreatedAt: "2025-04-10T14:23:00Z",
    DeadLine: "2025-05-10T23:59:00Z",
    TotalTask: 10,
    CompletedTasks: 4,
    Status: "Working",
  },
  {
    ProjectID: "b2c6d3e1-7f8e-45f9-8435-6b18e4d55555",
    OwnerID: "u2345678-89ab-cdef-0123-456789abcdef",
    OwnerName: "Nano",
    ProjectName: "Final Sprint",
    CreatedAt: "2025-03-20T10:00:00Z",
    DeadLine: "2025-04-25T18:00:00Z",
    TotalTask: 20,
    CompletedTasks: 20,
    Status: "Done",
  },
  {
    ProjectID: "c3e7f4g5-9h1j-23kl-567m-89no0123pqrs",
    OwnerID: "u3456789-89ab-cdef-0123-456789abcdef",
    OwnerName: "Ava",
    ProjectName: "Code Warriors",
    CreatedAt: "2025-04-01T09:30:00Z",
    DeadLine: "2025-04-30T20:00:00Z",
    TotalTask: 15,
    CompletedTasks: 10,
    Status: "Working",
  },
  {
    ProjectID: "d4h8i9j0-klmn-opqr-stuv-1234567890ab",
    OwnerID: "u4567890-89ab-cdef-0123-456789abcdef",
    OwnerName: "Liam",
    ProjectName: "Pixel Odyssey",
    CreatedAt: "2025-04-05T11:45:00Z",
    DeadLine: "2025-05-20T22:00:00Z",
    TotalTask: 25,
    CompletedTasks: 12,
    Status: "Working",
  },
  {
    ProjectID: "e5j0k1l2-mnop-qrst-uvwx-0987654321cd",
    OwnerID: "u5678901-89ab-cdef-0123-456789abcdef",
    OwnerName: "Emma",
    ProjectName: "Monster Hunter",
    CreatedAt: "2025-03-28T08:15:00Z",
    DeadLine: "2025-04-30T19:00:00Z",
    TotalTask: 30,
    CompletedTasks: 30,
    Status: "Done",
  },
  {
    ProjectID: "f6m1n2o3-pqrs-tuvw-xyza-abcdef123456",
    OwnerID: "u6789012-89ab-cdef-0123-456789abcdef",
    OwnerName: "You",
    ProjectName: "AI Legends",
    CreatedAt: "2025-04-12T13:50:00Z",
    DeadLine: "2025-06-01T23:59:00Z",
    TotalTask: 18,
    CompletedTasks: 6,
    Status: "Working",
  },
  {
    ProjectID: "g7o2p3q4-rstu-vwxy-zabc-123456abcdef",
    OwnerID: "u7890123-89ab-cdef-0123-456789abcdef",
    OwnerName: "You",
    ProjectName: "Bug Busters",
    CreatedAt: "2025-04-03T07:20:00Z",
    DeadLine: "2025-04-29T18:30:00Z",
    TotalTask: 12,
    CompletedTasks: 12,
    Status: "Done",
  },
]

const fuse = new Fuse(ProjectMockData, {
  keys: ["ProjectName", "OwnerName", "Status"],
})

function Home() {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    status: null,
    owner: null,
  })

  const filteredAndSearchedResults = useMemo(() => {
    let results = ProjectMockData

    if (query.trim() !== "") {
      const searchResults = fuse.search(query)
      results = searchResults.map((result) => result.item)
    }

    if (filters.status) {
      results = results.filter((project) => project.Status === filters.status)
    }

    if (filters.owner) {
      results = results.filter((project) => project.OwnerName === filters.owner)
    }

    return results
  }, [query, filters])

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
              <ProjectTab data={filteredAndSearchedResults} onFilterChange={handleFilterChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
