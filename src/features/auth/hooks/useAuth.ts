import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { STORAGE_KEYS } from '@/shared/lib/storage'
import { apiClient } from '@/shared/lib/apiClient'
import type { User, AuthResponse } from '@/shared/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (userData: User) => void
  signInWithGoogle: (idToken: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  signOut: () => void
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function useAuthProvider() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.auth)
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch {
      // ignore
    }
    setLoading(false)
  }, [])

  const signIn = (userData: User) => {
    setUser(userData)
    localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(userData))
  }

  const toUser = (response: AuthResponse): User => ({
    id: response.user.id,
    name: response.user.name,
    email: response.user.email,
    avatar: response.user.pictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(response.user.name)}&background=6366f1&color=fff&size=128`,
    token: response.accessToken,
  })

  const signInWithGoogle = async (idToken: string) => {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/google', { idToken })
    signIn(toUser(response))
  }

  const login = async (email: string, password: string) => {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', { email, password })
    signIn(toUser(response))
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/register', { name, email, password })
    signIn(toUser(response))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEYS.auth)
  }

  return {
    user,
    loading,
    signIn,
    signInWithGoogle,
    login,
    register,
    signOut,
    isAuthenticated: !!user,
  }
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

// Re-export for use in AuthProvider component
export type { AuthContextType, ReactNode }
