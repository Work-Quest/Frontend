"use client"

import { useState } from "react"
import useProjects from "@/hook/useProjects"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ScrollText, Users, Search } from "lucide-react"

const CreateProjectPage = () => {
  const [projectName, setProjectName] = useState("")
  const [dueDate, setDueDate] = useState("")
  const { createProject } = useProjects()
  const navigate = useNavigate()

  const handleCreateProject = async () => {
    try {
      const res = await createProject({
        project_name: projectName,
        deadline: dueDate,
      })
      navigate(`/project/${res.project_id}/setup`)
      toast.success("Project created successfully!")
    } catch (error) {
      console.error("Error creating project:", error)
      navigate(`/home`)
      toast.error("Failed to create project.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream/50 via-offWhite to-cream/30 flex flex-col items-center px-4 pt-10 pb-28">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        {/* Page Title */}
        <header className="text-center space-y-1">
          <h1 className="!text-red !font-extrabold text-3xl sm:text-4xl font-['Baloo_2'] tracking-tight">
            Start a New Quest
          </h1>
          <p className="text-brown/80 text-sm font-['Baloo_2']">
            Assemble your party and begin your adventure
          </p>
        </header>

        {/* Mission Details */}
        <section className="bg-offWhite rounded-2xl !border-veryLightBrown !border-2 p-6 sm:p-8 shadow-[0_4px_0_0_#d6cec4] flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange/15 flex items-center justify-center">
              <ScrollText className="w-5 h-5 text-orange" />
            </div>
            <h2 className="font-['Baloo_2'] font-extrabold text-darkBrown text-xl">
              Mission Details
            </h2>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-darkBrown font-['Baloo_2']">
                Quest Name
              </label>
              <input
                type="text"
                placeholder="e.g. Build Mobile App MVP"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full rounded-xl !border-brown !border-2 px-4 py-3 font-['Baloo_2'] text-darkBrown placeholder:text-brown/50 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange bg-cream/30 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-darkBrown font-['Baloo_2']">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl !border-brown !border-2 px-4 py-3 font-['Baloo_2'] text-darkBrown focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange bg-cream/30 transition-all [color-scheme:light]"
              />
            </div>
          </div>
        </section>

        {/* Summon Party Members */}
        <section className="bg-offWhite rounded-2xl !border-veryLightBrown !border-2 p-6 sm:p-8 shadow-[0_4px_0_0_#d6cec4] flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue/15 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue" />
            </div>
            <h2 className="font-['Baloo_2'] font-extrabold text-darkBrown text-xl">
              Summon Party Members
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/50" />
              <input
                type="text"
                placeholder="Search for adventurers..."
                className="w-full rounded-xl !border-brown !border-2 pl-11 pr-4 py-3 font-['Baloo_2'] text-darkBrown placeholder:text-brown/50 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange bg-cream/30 transition-all"
              />
            </div>

            <div className="flex items-center justify-between rounded-xl p-4 !border-brown !border-2 bg-cream/40 shadow-[0_2px_0_0_#948B81]">
              <div>
                <p className="font-bold text-darkBrown font-['Baloo_2']">
                  You (Leader)
                </p>
                <p className="text-sm text-brown/70 font-['Baloo_2']">
                  @your_username
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-yellow text-darkBrown text-xs font-bold font-['Baloo_2'] border-2 border-darkBrown/20">
                Warrior
              </span>
            </div>
          </div>
        </section>

        {/* Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 h-20 flex items-center justify-center bg-offWhite/95 backdrop-blur-sm z-[9999] border-t-2 border-veryLightBrown shadow-[0_-4px_20px_rgba(61,55,48,0.08)]">
          <div className="w-full max-w-2xl flex items-center justify-between px-4 sm:px-6">
            <Button
              variant="cream"
              size="default"
              onClick={() => navigate(`/home`)}
              className="normal-case"
            >
              Retreat
            </Button>
            <Button
              variant="orange"
              size="default"
              onClick={handleCreateProject}
              className="normal-case"
            >
              Create Party!
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateProjectPage
