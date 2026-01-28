import { Outlet, useLocation, useParams, Navigate } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import { get } from "@/Api"
import NotFound from "@/pages/NotFound"

type ProjectBossResponse = {
  boss: string | null
}

export default function ProjectGuard() {
  const { projectId } = useParams()
  const location = useLocation()
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [bossSetup, setBossSetup] = useState<boolean | null>(null)

  const isSetupRoute = useMemo(() => {
    if (!projectId) return false
    const normalized = location.pathname.replace(/\/+$/, "")
    return normalized.endsWith(`/project/${projectId}/setup`)
  }, [location.pathname, projectId])

  useEffect(() => {
    if (!projectId) return

    const checkAccess = async () => {
      try {
        await get(`/api/project/${projectId}/access/`)
        setAllowed(true)
      } catch {
        setAllowed(false)
      }
    }

    checkAccess()
  }, [projectId])

  useEffect(() => {
    if (!projectId) return

    const fetchBoss = async () => {
      try {
        const data = await get<ProjectBossResponse>(
          `/api/game/project/${projectId}/boss/`
        )
        setBossSetup(Boolean(data?.boss))
      } catch {
        // If boss doesn't exist yet / 404, treat as "not setup"
        setBossSetup(false)
      }
    }

    fetchBoss()
  }, [projectId, location.pathname])

  if (allowed === null || bossSetup === null) {
    return <div>Loading...</div>
}

  if (!allowed) {
    return <div><NotFound></NotFound></div>
  }

  // Routing rule:
  // - boss NOT set up => user can only access /setup
  // - boss IS set up => user can only access the main project page (index)
  if (bossSetup === false && !isSetupRoute) {
    return <Navigate replace to={`/project/${projectId}/setup`} />
  }

  if (bossSetup === true && isSetupRoute) {
    return <Navigate replace to={`/project/${projectId}`} />
  }

  return <Outlet />
}
