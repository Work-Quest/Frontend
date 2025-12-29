"use client"

import { useEffect, useState } from "react"
import type { Project } from "@/types/Project"
import { get, post} from "@/Api"

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const data = await get<Project[]>("/api/project/get_user_project")
        setProjects(data)
        console.log("Fetched projects:", data)
      } catch (err) {
        setError("Unable to load projects")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return { projects, loading, error }
}
