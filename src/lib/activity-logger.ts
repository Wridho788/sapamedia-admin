// Activity Logger Utility - Sprint 3
import apiClient from './axios'
import { UserRole } from '@/types'

export interface LogActivityParams {
  user_id: string
  action: string
  entity_type: string
  entity_id: string
  metadata?: Record<string, any>
}

async function log(params: LogActivityParams) {
  try {
    // Get user profile to get role
    const profileResponse = await apiClient.get(`/rest/v1/profiles?id=eq.${params.user_id}&select=role`)
    const profile = profileResponse.data[0]
    
    if (!profile) return

    // Create activity log
    await apiClient.post('/rest/v1/activity_logs', {
      actor_id: params.user_id,
      actor_role: profile.role,
      action: params.action,
      entity_type: params.entity_type,
      entity_id: params.entity_id,
      meta: params.metadata || {}
    })
  } catch (error) {
    // Silent fail - don't block main action
    console.error('Failed to log activity:', error)
  }
}

export const activityLogger = {
  log,
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
