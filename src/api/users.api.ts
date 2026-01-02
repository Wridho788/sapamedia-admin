// Users API Module - SPRINT X
import apiClient from '@/lib/axios'
import { Profile, UserRole } from '@/types'

export interface CreateUserDto {
  email: string
  password: string
  full_name: string
  role: UserRole
}

export interface UpdateUserDto {
  full_name?: string
  role?: UserRole
  is_active?: boolean
  avatar_url?: string
}

export const usersApi = {
  // Get all users
  async getUsers() {
    const response = await apiClient.get(
      '/rest/v1/profiles?select=*&order=created_at.desc'
    )
    return response.data as Profile[]
  },

  // Get single user by ID
  async getUser(id: string) {
    const response = await apiClient.get(
      `/rest/v1/profiles?id=eq.${id}`
    )
    return response.data[0] as Profile
  },

  // Get current user profile
  async getCurrentUser() {
    const authData = localStorage.getItem('supabase-auth')
    if (!authData) throw new Error('Not authenticated')
    
    const parsed = JSON.parse(authData)
    const userId = parsed.user?.id
    
    if (!userId) throw new Error('User ID not found')
    
    return this.getUser(userId)
  },

  // Create new user (super_admin only)
  async createUser(data: CreateUserDto) {
    // This would typically go through auth/register endpoint
    const response = await apiClient.post('/api/auth/register', data)
    return response.data as Profile
  },

  // Update user
  async updateUser(id: string, data: UpdateUserDto) {
    const response = await apiClient.patch(`/rest/v1/profiles?id=eq.${id}`, data)
    return response.data as Profile
  },

  // Deactivate user
  async deactivateUser(id: string) {
    const response = await apiClient.patch(`/rest/v1/profiles?id=eq.${id}`, {
      is_active: false
    })
    return response.data as Profile
  },

  // Activate user
  async activateUser(id: string) {
    const response = await apiClient.patch(`/rest/v1/profiles?id=eq.${id}`, {
      is_active: true
    })
    return response.data as Profile
  },

  // Get users by role
  async getUsersByRole(role: UserRole) {
    const response = await apiClient.get(
      `/rest/v1/profiles?role=eq.${role}&select=*&order=full_name.asc`
    )
    return response.data as Profile[]
  },

  // Get user stats
  async getUserStats(userId: string) {
    const [posts, approvals] = await Promise.all([
      apiClient.get(`/rest/v1/posts?writer_id=eq.${userId}&select=status`),
      apiClient.get(`/rest/v1/approvals?editor_id=eq.${userId}&select=status`)
    ])

    return {
      totalPosts: posts.data.length,
      postsByStatus: posts.data.reduce((acc: any, post: any) => {
        acc[post.status] = (acc[post.status] || 0) + 1
        return acc
      }, {}),
      totalApprovals: approvals.data.length,
      approvalsByStatus: approvals.data.reduce((acc: any, approval: any) => {
        acc[approval.status] = (acc[approval.status] || 0) + 1
        return acc
      }, {})
    }
  }
}
