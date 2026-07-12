import { useContext } from 'react'
import { AuthContext } from './context'
import type { AuthContextType } from './AuthContextType'

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
