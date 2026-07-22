import { useState, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, refreshToken, setAccessToken, setOnUnauthorized } from '../../services'
import type { User } from '../../interfaces'
import { AuthContext } from './context'

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

  const refreshUser = async () => {
    try {
      const meRes = await api.get<{ user: User }>('/auth/me')
      setUser(meRes.user)
    } catch {
      // ignore
    }
  }

  const login = async (email: string, password: string) => {
    const res = await api.post<{ accessToken: string; user: User }>('/auth/login', { email, password })
    setAccessToken(res.accessToken)
    setUser(res.user)
  }

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    const res = await api.post<{ accessToken: string; user: User }>('/auth/register', { name, email, password, confirmPassword })
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
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

