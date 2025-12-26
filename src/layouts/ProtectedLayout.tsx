import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export default function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div></div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}