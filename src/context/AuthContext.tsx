import { createContext, useContext, useEffect, useState } from "react"
import { get, post} from "@/Api"
import toast from "react-hot-toast"

type User = {
  id: string
  name: string
  username: string
  email: string
  profile_img: string
}

type AuthContextType = {
  isAuthenticated: boolean
  loading: boolean
  user: User | null
  checkAuth: () => Promise<void>
  logout: () => Promise<void>
}

type AuthStatusResponse = {
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  const checkAuth = async () => {
    setLoading(true)
    try {
      const res = await get<AuthStatusResponse>(`/api/auth/status/`)

      if (res.isAuthenticated) {
        setIsAuthenticated(true)

        const userRes = await get<User>(`/api/me/`)

        setUser(userRes)
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }

      console.log("Auth status checked:", res.isAuthenticated)
    } catch {
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  } 

  const logout = async () => {
     await post<{}, any>("/api/auth/logout/", {})
    toast.success("Logged out successfully.")
    setIsAuthenticated(false)
    setUser(null)
  }

  useEffect(() => {
    checkAuth()
  }, [])


  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
