import axios from 'axios'
import { useAuthStore } from '@/store/auth'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create axios instance pointing to Supabase
export const apiClient = axios.create({
  baseURL: SUPABASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
  },
})

// Request interceptor - add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Get access token from localStorage
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('supabase-auth')
      
      if (authData) {
        try {
          const parsed = JSON.parse(authData)
          
          if (parsed.access_token) {
            config.headers.Authorization = `Bearer ${parsed.access_token}`
          }
        } catch (e) {
          console.error('Failed to parse auth data:', e)
        }
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 errors globally
    if (error.response?.status === 401) {
      const { clearAuth } = useAuthStore.getState()
      clearAuth()
      
      // Redirect to login if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
        window.location.href = '/auth/login'
      }
    }

    // Handle 403 errors
    if (error.response?.status === 403) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/forbidden')) {
        window.location.href = '/forbidden'
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
