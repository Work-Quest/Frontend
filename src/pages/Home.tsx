"use client"

import Leaderboard from "@/components/Leaderboard"
import type { UserScore, UserProfile } from "@/types/User"
import ProfileCard from "@/sections/home/ProfileCard"
import type { Project } from "@/types/Project"
import ProjectTab from "@/sections/home/ProjectTab"
import { useState } from "react"
import Fuse from "fuse.js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IoMdAddCircleOutline } from "react-icons/io"

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
    },
    {
      id: "boss2",
      bossName: "Abyss Serpent",
      img: "/mockImg/boss2.svg",
    },
    {
      id: "boss3",
      bossName: "Doggy",
      img: "/mockImg/boss3.svg",
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
  const [results, setResults] = useState<Project[]>(ProjectMockData)

  const handleSearch = (value: string) => {
    setQuery(value)
    if (value.trim() === "") {
      setResults(ProjectMockData)
    } else {
      const searchResults = fuse.search(value)
      setResults(searchResults.map((result) => result.item))
    }
  }

  return (
    <div className="h-screen w-full overflow-x-hidden sm:px-4 sm:pt-4 bg-offWhite">
      <svg
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-20 sm:h-24 md:h-32"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        fill="#f8f8f8"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,64L48,96C96,128,192,192,288,202.7C384,213,480,171,576,144C672,117,768,107,864,128C960,149,1056,203,1152,202.7C1248,203,1344,149,1392,122.7L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          opacity="1"
        />
      </svg>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 relative">
        <div className="flex flex-col w-full lg:w-1/2 xl:w-1/2 gap-4 z-10 lg:pr-4">
          <div className="relative">
            {/* Leaderboard Label */}
            <div className="absolute -top-2 -left-3 z-2 bg-orange px-10 py-2 rounded-2xl border-2 border-white/50 transform -rotate-3">
              <span>
                <h3 className="!text-offWhite">Leaderboard</h3>
              </span>
            </div>

            {/* Main Container */}
            <div className="flex flex-col p-4 rounded-4xl shadow-sm bg-[#15dc9e] bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2780%27%20height%3D%2780%27%20viewBox%3D%270%200%2080%2080%27%3E%3Cg%20fill%3D%27%2344efbd%27%20fill-opacity%3D%270.61%27%3E%3Cpath%20fill-rule%3D%27evenodd%27%20d%3D%27M0%200h40v40H0V0zm40%2040h40v40H40V40zm0-40h2l-2%202V0zm0%204l4-4h2l-6%206V4zm0%204l8-8h2L40%2010V8zm0%204L52%200h2L40%2014v-2zm0%204L56%200h2L40%2018v-2zm0%204L60%200h2L40%2022v-2zm0%204L64%200h2L40%2026v-2zm0%204L68%200h2L40%2030v-2zm0%204L72%200h2L40%2034v-2zm0%204L76%200h2L40%2038v-2zm0%204L80%200v2L42%2040h-2zm4%200L80%204v2L46%2040h-2zm4%200L80%208v2L50%2040h-2zm4%200l28-28v2L54%2040h-2zm4%200l24-24v2L58%2040h-2zm4%200l20-20v2L62%2040h-2zm4%200l16-16v2L66%2040h-2zm4%200l12-12v2L70%2040h-2zm4%200l8-8v2l-6%206h-2zm4%200l4-4v2l-2%202h-2z%27/%3E%3C/g%3E%3C/svg%3E')] bg-repeat bg-[length:80px_80px] hover:rotate-1 transition-all duration-500">
              <div className="absolute bottom-40 -left-5 z-2">
                <svg width="102" height="80" viewBox="0 0 102 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M94.9981 47.71L89.179 43.1122L41.6257 5.53271C31.6193 -2.37366 17.4954 -1.64066 8.34978 6.67219C7.23536 7.68173 6.19767 8.80455 5.24674 10.0406C-3.35169 21.2222 -1.10615 37.2948 9.9647 46.0441L20.2214 54.1504V42.679L15.2799 38.7741C10.7221 35.1725 8.54664 29.655 9.00376 24.2641C9.27069 21.1056 10.4352 17.987 12.5472 15.3216C13.5015 14.1154 14.5959 13.0759 15.7837 12.2063C21.6094 7.95494 29.7508 7.83499 35.7433 12.3629L35.8634 12.4529L53.9545 26.7497L65.7794 36.092L89.4693 54.8135C93.243 57.7954 94.1806 63.2296 91.4179 67.1645C90.6505 68.2573 89.6895 69.1269 88.6151 69.7566C85.4987 71.5958 81.4314 71.4425 78.4218 69.0636L65.7794 59.0748L52.1427 48.2998C50.1908 46.7572 47.358 47.087 45.8165 49.0361C45.1625 49.8624 44.8422 50.8453 44.8422 51.8215C44.8422 53.1509 45.4295 54.4636 46.5539 55.3532L65.7794 70.5463L72.833 76.1204C74.5547 77.4797 76.4499 78.4759 78.4251 79.119C84.3176 81.0314 90.9141 79.7987 95.7188 75.7072C96.6597 74.9109 97.5272 74.0013 98.3113 72.9851C104.361 65.1454 102.769 53.8506 94.9981 47.71Z"
                    fill="#FF66BE"
                  />
                </svg>
              </div>
              <div className="border-2 border-gray-200 bg-offWhite rounded-3xl p-4 flex-grow min-h-0 ">
                <div className="h-full overflow-hidden">
                  <Leaderboard user={userMockData} height={"100%"} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-[2] z-1 relative overflow-hidden">
            <ProfileCard data={mockProfile} />
          </div>

        </div>

        <div className="flex flex-col w-full lg:w-1/2 xl:w-11/24 h-[82vh] bg-blue rounded-3xl overflow-hidden z-10 ">
          {/* Header */}
          <div className="flex bg-red h-16 rounded-t-3xl justify-center items-center flex-shrink-0">
            <h2 className="!text-offWhite text-xl font-bold">Projects</h2>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex justify-center items-center p-4 min-h-0">
            <div className="w-full h-full flex flex-col">
              {/* Search Bar */}
              <div className="w-full flex flex-col gap-2 sm:gap-4 items-stretch mb-4 border-b-3 border-dashed pb-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <div className="flex-1">
                    <Input
                      type="search"
                      placeholder="Search projects..."
                      className="w-full bg-offWhite rounded-lg font-['Baloo_2']"
                      value={query}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                  <div className="sm:w-auto w-full">
                    <Button
                      className="w-full sm:w-auto !bg-darkBlue !font-['Baloo_2'] hover:!bg-[#4650da] !rounded-lg h-full"
                      variant="default"
                    >
                      <IoMdAddCircleOutline className="mr-2" /> Add Project
                    </Button>
                  </div>
                </div>
              </div>
              {/* Projects List */}
              <div className="flex-1 min-h-0">
                <ProjectTab data={results} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
