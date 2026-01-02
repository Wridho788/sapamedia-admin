// Activity Logger Utility - Sprint 3
import apiClient from './axios'
import { UserRole } from '@/types'

export interface LogActivityParams {
  action: string
  entityType: string
  entityId: string
  meta?: Record<string, any>
}

export async function logActivity(params: LogActivityParams) {
  try {
    // Get current user from auth
    const authData = localStorage.getItem('supabase-auth')
    if (!authData) return

    const parsed = JSON.parse(authData)
    const userId = parsed.user?.id
    
    if (!userId) return

    // Get user profile to get role
    const profileResponse = await apiClient.get(`/rest/v1/profiles?id=eq.${userId}&select=role`)
    const profile = profileResponse.data[0]
    
    if (!profile) return

    // Create activity log
    await apiClient.post('/rest/v1/activity_logs', {
      actor_id: userId,
      actor_role: profile.role,
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId,
      meta: params.meta || {}
    })
  } catch (error) {
    // Silent fail - don't block main action
    console.error('Failed to log activity:', error)
  }
}

// Pre-defined action types
export const ActivityActions = {
  POST_CREATED: 'post.created',
  POST_UPDATED: 'post.updated',
  POST_SUBMITTED: 'post.submitted',
  POST_APPROVED: 'post.approved',
  POST_REJECTED: 'post.rejected',
  POST_PUBLISHED: 'post.published',
  POST_DELETED: 'post.deleted',
  
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DEACTIVATED: 'user.deactivated',
  USER_ACTIVATED: 'user.activated',
  
  CATEGORY_CREATED: 'category.created',
  CATEGORY_UPDATED: 'category.updated',
  CATEGORY_DELETED: 'category.deleted',
} as const
