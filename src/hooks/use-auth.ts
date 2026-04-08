import { useAuthStore } from '@/store/auth'
import { UserRole } from '@/types'

export function useAuth() {
  const authStore = useAuthStore()
  return authStore
}

export function useRequireAuth() {
  const { authUser, isAuthenticated } = useAuth()

  return {
    user: authUser,
    isAuthenticated,
  }
}

// Hook for role-based permissions
export function usePermissions() {
  const { authUser } = useAuth()

  const hasRole = (requiredRole: UserRole | UserRole[]) => {
    if (!authUser) return false
    
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    return allowedRoles.includes(authUser.role)
  }

  return {
    hasRole,
    isAdmin: authUser?.role === 'super_admin',
    isEditor: authUser?.role === 'editor',
    isWriter: authUser?.role === 'writer',
  }
}
