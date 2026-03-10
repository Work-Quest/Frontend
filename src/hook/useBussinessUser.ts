import { useCallback, useEffect, useState } from "react"
import { get } from "@/Api"
import type { BusinessUser } from "@/types/User"

export function useBussinessUser() {
  const [users, setUsers] = useState<BusinessUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await get<BusinessUser[]>("/api/users/business/")
      setUsers(data)
    } catch (err) {
      console.error(err)
      setError("Unable to load users")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return { users, loading, error, fetchUsers }
}

export default useBussinessUser

