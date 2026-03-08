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
  const [guardStatus, setGuardStatus] = useState<
    "loading" | "active" | "closed" | "forbidden"
  >("loading")
  const [bossSetup, setBossSetup] = useState<boolean | null>(null)

  const isSetupRoute = useMemo(() => {
    if (!projectId) return false
    const normalized = location.pathname.replace(/\/+$/, "")
    return normalized.endsWith(`/project/${projectId}/setup`)
  }, [location.pathname, projectId])

  const isProjectEndRoute = useMemo(() => {
    if (!projectId) return false
    const normalized = location.pathname.replace(/\/+$/, "")
    return normalized.endsWith(`/project/${projectId}/project-end`)
  }, [location.pathname, projectId])

  useEffect(() => {
    if (!projectId) return

    const checkAccess = async () => {
      try {
        await get(`/api/project/${projectId}/access/`)
        setGuardStatus("active")
      } catch {
        // Access can be denied because the project is closed (status != Working).
        // In that case, redirect to the project-end page instead of showing NotFound.
        try {
          const projects = await get<Array<{ project_id: string; status?: string }>>(
            "/api/project/get_user_project/"
          )
          const p = projects?.find((x) => String(x.project_id) === String(projectId))
          const status = String(p?.status ?? "").toLowerCase()
          if (p && (status === "closed" || status === "done")) {
            setGuardStatus("closed")
            return
          }
        } catch {
          // ignore; fall through to forbidden
        }
        setGuardStatus("forbidden")
      }
    }

    checkAccess()
  }, [projectId])

  useEffect(() => {
    if (!projectId) return
    if (guardStatus !== "active") return

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
  }, [projectId, location.pathname, guardStatus])

  if (guardStatus === "loading") {
    return <div>Loading...</div>
}

  if (guardStatus === "closed") {
    // If the project is closed, allow the nested /project-end route to render.
    // Otherwise redirect the user to it.
    if (isProjectEndRoute) {
      return <Outlet />
    }
    return (
      <Navigate
        replace
        to={`/project/${projectId}/project-end`}
        state={{ projectId }}
      />
    )
  }

  if (guardStatus === "forbidden") {
    return <div><NotFound></NotFound></div>
  }

  // active project: wait for boss setup check
  if (bossSetup === null) {
    return <div>Loading...</div>
  }

  // Routing rule:
  // - boss NOT set up => user can only access /setup
  // - boss IS set up => user can only access the main project page (index)
  if (bossSetup === false && !isSetupRoute && !isProjectEndRoute) {
    return <Navigate replace to={`/project/${projectId}/setup`} />
  }

  if (bossSetup === true && isSetupRoute) {
    return <Navigate replace to={`/project/${projectId}`} />
  }

  return <Outlet />
}
