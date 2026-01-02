'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { LoginForm } from '@/components/forms/login-form'
import { useAuthStore } from '@/store/auth'
import apiClient from '@/lib/axios'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface LoginCredentials {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const { setAuth, isAuthenticated } = useAuthStore()

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/admin')
    }
  }, [isAuthenticated, router])

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiClient.post('/auth/v1/token?grant_type=password', credentials)
      return response.data
    },
    onSuccess: async (data) => {
      // Store auth token in localStorage
      const authData = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        token_type: data.token_type,
        user: data.user
      }
      
      localStorage.setItem('supabase-auth', JSON.stringify(authData))
      
      // Fetch user role from profile
      try {
        const profileResponse = await apiClient.get(`/rest/v1/user_profiles?id=eq.${data.user.id}`)
        const profile = profileResponse.data[0]
        
        setAuth({
          id: data.user.id,
          role: profile?.roles || data.user.user_metadata?.role || 'writer'
        })
      } catch (err) {
        // Fallback to user metadata if profile fetch fails
        setAuth({
          id: data.user.id,
          role: data.user.user_metadata?.role || 'writer'
        })
      }
      
      toast.success('Login successful!')
      router.replace('/admin')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error_description || error.response?.data?.msg || 'Login gagal. Periksa email dan password Anda.'
      toast.error(errorMessage)
    },
  })

  const handleLogin = async (credentials: LoginCredentials) => {
    loginMutation.mutate(credentials)
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600 font-medium">Mengalihkan ke dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo or Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sapa Media Admin</h1>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="text-center space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Masuk ke Dashboard
            </CardTitle>
            <CardDescription className="text-gray-600">
              Masukkan kredensial Anda untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <LoginForm
              onSubmit={handleLogin}
              isLoading={loginMutation.isPending}
            />
            
            <div className="mt-6 text-center">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
              >
                Lupa password?
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-8">
          © {new Date().getFullYear()} Sapa Media. All rights reserved.
        </p>
      </div>
    </div>
  )
}
