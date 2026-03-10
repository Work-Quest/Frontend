import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import LoadingScreen from "@/components/LoadingScreen"

export default function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-cream/30 via-offWhite to-cream/20">
        <LoadingScreen message="Preparing your adventure..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
