import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, refreshToken, setAccessToken, setOnUnauthorized } from '../services/api'
import type { User } from '../interfaces/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setOnUnauthorized(() => navigate('/login'))
    return () => setOnUnauthorized(null)
  }, [navigate])

  useEffect(() => {
    async function restoreSession() {
      try {
        await refreshToken()
        const meRes = await api.get<{ user: User }>('/auth/me')
        setUser(meRes.user)
      } catch {
        setAccessToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    restoreSession()
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api.post<{ accessToken: string; user: User }>('/auth/login', { email, password })
    setAccessToken(res.accessToken)
    setUser(res.user)
  }

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post<{ accessToken: string; user: User }>('/auth/register', { name, email, password })
    setAccessToken(res.accessToken)
    setUser(res.user)
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout', {})
    } finally {
      setAccessToken(null)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
