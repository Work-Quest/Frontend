"use client"

import { useState } from "react"
import useProjects from "@/hook/useProjects"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const CreateProjectPage = () => {
  const [projectName, setProjectName] = useState("")
  const [dueDate, setDueDate] = useState("")
  const { createProject } = useProjects()
  const navigate = useNavigate()


  const handleCreateProject = async () => { 
    try {
        const res = await createProject({ project_name: projectName, deadline:dueDate })
        navigate(`/project/${res.project_id}/setup`)
        toast.success("Project created successfully!")
    }
    catch (error) {
        console.error("Error creating project:", error)
        navigate(`/home`)
        toast.error("Failed to create project.")
    }   
    }
    
  return (
    <div className="bg-[#faf7f2] flex justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-orange-500">
          Start a New Quest
        </h1>

        {/* Mission Details */}
        <section className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Mission Details</h2>

          {/* Quest Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Quest Name</label>
            <input
              type="text"
              placeholder="e.g. Build Mobile App MVP"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Dates */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> */}
            <div className="grid gap-4">
        

            <div className="space-y-1">
              <label className="text-sm font-medium ">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
        </section>

        {/* Summon Party Members */}
        <section className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Summon Party Members</h2>

          {/* Search */}
          <input
            type="text"
            placeholder="Search for adventurers..."
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {/* Party List */}
          <div className="flex items-center justify-between border rounded-md p-3">
            <div>
              <p className="font-medium">You (Leader)</p>
              <p className="text-sm text-gray-500">@your_username</p>
            </div>

            <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600">
              Warrior
            </span>
          </div>
        </section>

        <div
        className="
            fixed bottom-0 left-0
            w-screen h-[70px]
            flex items-center 
            bg-white
            z-[9999]
            shadow-md
        "
        >
            <div className="flex w-screen mx-10 justify-between">
                <button
                    className= "!text-[rgba(148, 139, 129, 1)] px-6 py-2 rounded-md"
                    onClick={() => navigate(`/home`)}
                >
                    retreat
                </button>
                <button
                    className="!bg-[rgba(215,206,197,1)] !text-[rgba(148, 139, 129, 1)] px-6 py-2 rounded-md"
                    onClick={handleCreateProject}
                >
                    Create Party!
                </button>
          </div>
        </div>
        
      </div>
      
    </div>
  )
}

export default CreateProjectPage
