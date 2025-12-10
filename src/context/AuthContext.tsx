import { createContext, useContext, useEffect, useState } from "react"
import { get, post} from "@/Api"

type User = {
  id: string
  name: string
  username: string
  email: string
  profile_img: string
}

type AuthContextType = {
  isAuthenticated: boolean
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
  
  const checkAuth = async () => {
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
    } catch {
      setIsAuthenticated(false)
      setUser(null)
    } 
  }

  const logout = async () => {
     await post<{}, any>("/api/auth/logout/", {})

    setIsAuthenticated(false)
    setUser(null)
  }

  useEffect(() => {
    checkAuth()
  }, [])


  return (
    <AuthContext.Provider value={{ isAuthenticated, user, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
