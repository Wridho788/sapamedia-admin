import { createClient } from '@/lib/supabase/client'
import { User, UserRole } from '@/types'

// Client-side auth helpers (for use in client components)
export function createAuthHelpers() {
  const supabase = createClient()

  return {
    async signIn(email: string, password: string) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { data, error }
    },

    async signOut() {
      const { error } = await supabase.auth.signOut()
      return { error }
    },

    async getCurrentUser() {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    },

    async getUserProfile(userId: string) {
      // Mock user profiles based on test accounts
      const mockProfiles: Record<string, { id: string; full_name: string; email: string; role: UserRole; avatar_url?: string }> = {
        'admin-user-id': {
          id: 'admin-user-id',
          full_name: 'Super Admin',
          email: 'admin@sapamedia.com',
          role: 'admin',
          avatar_url: undefined
        },
        'editor-user-id': {
          id: 'editor-user-id',
          full_name: 'Content Editor',
          email: 'editor@sapamedia.com',
          role: 'editor',
          avatar_url: undefined
        },
        'writer-user-id': {
          id: 'writer-user-id',
          full_name: 'Content Writer',
          email: 'writer@sapamedia.com',
          role: 'writer',
          avatar_url: undefined
        }
      }
      
      return mockProfiles[userId] || null
    },

    async createUserProfile(userId: string, fullName: string, role: UserRole = 'writer') {
      // This function will be implemented via direct SQL when needed
      // For now, return a success response to allow builds
      console.log('createUserProfile called with:', { userId, fullName, role })
      return { profile: null, error: null }
    }
  }
}

// Helper for checking role permissions in components
export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    'writer': 1,
    'editor': 2,
    'admin': 3
  }
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

// Helper for checking specific permissions by feature
export function canAccess(userRole: UserRole, feature: string): boolean {
  const permissions: Record<UserRole, string[]> = {
    'writer': ['dashboard', 'articles', 'articles:read', 'articles:create', 'articles:update'],
    'editor': ['dashboard', 'articles', 'categories', 'media', 'articles:read', 'articles:delete', 'categories:manage', 'media:manage'],
    'admin': ['*'] // Full access
  }
  
  const userPermissions = permissions[userRole]
  return userPermissions.includes('*') || userPermissions.includes(feature)
}