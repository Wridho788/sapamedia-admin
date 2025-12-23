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
      const response = await apiClient.post('/auth/login', credentials)
      return response.data
    },
    onSuccess: (data) => {
      setAuth(data.user)
      toast.success('Login successful!')
      router.replace('/admin')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Login failed'
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
