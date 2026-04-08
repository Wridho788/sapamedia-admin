'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import apiClient from '@/lib/axios'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setAuth, clearAuth, setLoading, isLoading } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const initAuth = async () => {
      // Skip auth check on public routes
      if (pathname?.startsWith('/auth') || pathname === '/forbidden') {
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        // Check current auth state via Supabase API
        const response = await apiClient.get('/auth/v1/user')
        const user = response.data

        // Fetch user profile for role
        const profileResponse = await apiClient.get(`/rest/v1/profiles?id=eq.${user.id}`)
        const profile = profileResponse.data[0]

        setAuth({
          id: user.id,
          role: profile?.roles || user.user_metadata?.role || 'writer',
        })
      } catch (error: any) {
        // If unauthorized, clear auth
        if (error.response?.status === 401) {
          clearAuth()
          
          // Redirect to login if not on auth page
          if (!pathname?.startsWith('/auth')) {
            router.replace('/auth/login')
          }
        } else if (error.response?.status === 403) {
          clearAuth()
          router.replace('/forbidden')
        }
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [pathname, setAuth, clearAuth, setLoading, router])

  // Show loading on initial load
  if (isLoading && !pathname?.startsWith('/auth') && pathname !== '/forbidden') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
