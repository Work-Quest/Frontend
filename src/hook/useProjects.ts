"use client"

import { useEffect, useState } from "react"
import type { Project } from "@/types/Project"
import { get, post } from "@/Api"
import type { BatchDeleteResponse } from "@/types/ProjectApi"
import type { SetupBossResponse } from "@/types/GameApi"

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const data = await get<Project[]>("/api/project/get_user_project/")
      setProjects(data)
      console.log("Fetched projects:", data)
    } catch (err) {
      setError("Unable to load projects")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const createProject = async (data: {
    project_name: string
    deadline: string
  }) => {
    try {
      const project = await post<
        { project_name: string; deadline: string },
        Project
      >("/api/project/create/", data)

      setProjects(prev => [...prev, project])
      return project
    } catch (err) {
      console.error(err)
      throw new Error("Failed to create project")
    }
  }

  const updateProject = async (
    projectId: string,
    data: { project_name: string; deadline: string; status: string }
  ) => {
    try {
      const editedProject = await post<
        { project_name: string; deadline: string; status: string },
        Project
      >(`/api/project/${projectId}/edit/`, data)

      setProjects(prev =>
        prev.map(p =>
          p.project_id === projectId
            ? { ...p, ...editedProject }
            : p
        )
      )

      return editedProject
    } catch (err) {
      console.error(err)
      throw new Error("Failed to update project")
    }
  }

  const deleteProject = async (projectId: string) => {
    if (!projectId) {
      throw new Error("No project selected")
    }

    try {
      const response = await post<
        { project_ids: string[] },
        BatchDeleteResponse
      >("/api/project/delete/", {
        project_ids: [projectId],
      })

      if (response.deleted_projects.includes(projectId)) {
        setProjects(prev =>
          prev.filter(p => p.project_id !== projectId)
        )
      } else {
        const error =
          response.failed_projects.find(f => f.project_id === projectId)?.error ??
          "Failed to delete project"
        throw new Error(error)
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const setupBoss = async (projectId: string) => {
    if (!projectId) {
      throw new Error("No project selected")
    }

    try {
      const response = await post<{}, SetupBossResponse>(
        `/api/game/project/${projectId}/boss/setup/`,
        {}
      )
      return response
    } catch (err) {
      console.error(err)
      throw new Error("Failed to setup boss")
    }
  }

  

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    setupBoss,
  }
}
export default useProjects