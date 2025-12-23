'use client'

import { useState, useEffect } from 'react'
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
  const [error, setError] = useState<string | null>(null)

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
      // Store auth token in cookie (Supabase format)
      const authData = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        token_type: data.token_type,
        user: data.user
      }
      
      // Set cookie with Supabase format
      const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]
      document.cookie = `sb-${projectRef}-auth-token=${encodeURIComponent(JSON.stringify(authData))}; path=/; max-age=${data.expires_in}`
      
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
      const errorMessage = error.response?.data?.error_description || error.response?.data?.msg || 'Login failed'
      setError(errorMessage)
      toast.error(errorMessage)
    },
  })

  const handleLogin = async (credentials: LoginCredentials) => {
    setError(null)
    loginMutation.mutate(credentials)
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-0 shadow-2xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold">
          Masuk ke Admin Panel
        </CardTitle>
        <CardDescription className="text-gray-600">
          Masukkan email dan password untuk mengakses dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm
          onSubmit={handleLogin}
          isLoading={loginMutation.isPending}
          error={error}
        />
        
        <div className="mt-6 text-center space-y-4">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Lupa password?
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
