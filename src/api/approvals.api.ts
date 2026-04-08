// Approvals API Module - SPRINT X
import apiClient from '@/lib/axios'
import { Approval, ApprovalStatus } from '@/types'

export interface ApproveArticleDto {
  post_id: string
  editor_id: string
  status: ApprovalStatus
  reason?: string
}

export const approvalsApi = {
  // Get all approvals
  async getApprovals() {
    const response = await apiClient.get(
      '/rest/v1/approvals?select=*,post:posts(title),editor:profiles!editor_id(full_name)&order=created_at.desc'
    )
    return response.data as Approval[]
  },

  // Get approvals for a specific post
  async getPostApprovals(postId: string) {
    const response = await apiClient.get(
      `/rest/v1/approvals?post_id=eq.${postId}&select=*,editor:profiles!editor_id(full_name)&order=created_at.desc`
    )
    return response.data as Approval[]
  },

  // Approve article
  async approveArticle(postId: string, editorId: string) {
    // Update post status
    await apiClient.patch(`/rest/v1/posts?id=eq.${postId}`, {
      status: 'approved',
      editor_id: editorId,
      published_at: new Date().toISOString()
    })

    // Create approval record
    const response = await apiClient.post('/rest/v1/approvals', {
      post_id: postId,
      editor_id: editorId,
      status: 'approved'
    })

    return response.data as Approval
  },

  // Reject article
  async rejectArticle(postId: string, editorId: string, reason: string) {
    // Update post status
    await apiClient.patch(`/rest/v1/posts?id=eq.${postId}`, {
      status: 'rejected',
      editor_id: editorId,
      rejected_reason: reason
    })

    // Create approval record
    const response = await apiClient.post('/rest/v1/approvals', {
      post_id: postId,
      editor_id: editorId,
      status: 'rejected',
      reason
    })

    return response.data as Approval
  },

  // Get approval history for post
  async getApprovalHistory(postId: string) {
    const response = await apiClient.get(
      `/rest/v1/approvals?post_id=eq.${postId}&select=*,editor:profiles!editor_id(full_name,avatar_url)&order=created_at.desc`
    )
    return response.data as Approval[]
  }
}
