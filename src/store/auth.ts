import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserRole } from '@/types'

// Zustand auth store - ONLY auth state (id, role, isAuthenticated)
// NO full user profile, NO tokens
interface AuthUser {
  id: string
  role: UserRole
}

interface AuthState {
  authUser: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthActions {
  setAuth: (user: AuthUser | null) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      authUser: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setAuth: (user: AuthUser | null) => {
        set({
          authUser: user,
          isAuthenticated: !!user,
        })
      },

      clearAuth: () => {
        // Clear localStorage auth data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('supabase-auth')
        }
        set({
          authUser: null,
          isAuthenticated: false,
        })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        authUser: state.authUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)