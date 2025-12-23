import axios from 'axios'
import { useAuthStore } from '@/store/auth'

// Create axios instance
export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookie-based auth
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
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
