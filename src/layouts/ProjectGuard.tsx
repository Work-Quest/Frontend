import { Outlet, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { get } from "@/Api"
import NotFound from "@/pages/NotFound"

export default function ProjectGuard() {
  const { projectId } = useParams()
  const [allowed, setAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    if (!projectId) return

    const checkAccess = async () => {
      try {
        await get(`/api/project/access/${projectId}`)
        setAllowed(true)
      } catch {
        setAllowed(false)
      }
    }

    checkAccess()
  }, [projectId])

  if (allowed === null) {
    return <div>Loading...</div>
}

  if (!allowed) {
    return <div><NotFound></NotFound></div>
  }

  return <Outlet />
}
