import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '@/lib/axios'
import { useAuthStore } from '@/store/auth'

// Query Keys
export const QUERY_KEYS = {
  posts: ['posts'],
  post: (id: string) => ['posts', id],
  myPosts: ['posts', 'mine'],
  pendingPosts: ['posts', 'pending'],
  categories: ['categories'],
  category: (id: string) => ['categories', id],
  approvals: ['approvals'],
  users: ['users'],
  user: (id: string) => ['users', id],
}

// Auth
export function useLogout() {
  const queryClient = useQueryClient()
  const { clearAuth } = useAuthStore.getState()
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/auth/v1/logout')
      return response.data
    },
    onSuccess: () => {
      // Clear auth cookie
      const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]
      document.cookie = `sb-${projectRef}-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`
      
      clearAuth()
      queryClient.clear()
      toast.success('Logged out successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Logout failed')
    },
  })
}

// Posts
export function usePosts(scope?: 'mine' | 'pending' | 'all', status?: string) {
  return useQuery({
    queryKey: scope ? (scope === 'mine' ? QUERY_KEYS.myPosts : scope === 'pending' ? QUERY_KEYS.pendingPosts : QUERY_KEYS.posts) : QUERY_KEYS.posts,
    queryFn: async () => {
      const params = new URLSearchParams()
      if (status) params.append('status', `eq.${status}`)
      
      const response = await apiClient.get(`/rest/v1/posts?${params.toString()}`)
      return response.data
    },
  })
}

export function usePost(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.post(id),
    queryFn: async () => {
      const response = await apiClient.get(`/rest/v1/posts?id=eq.${id}`)
      return response.data[0]
    },
    enabled: !!id,
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/rest/v1/posts', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myPosts })
      toast.success('Post created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create post')
    },
  })
}

export function useUpdatePost(id: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.patch(`/rest/v1/posts?id=eq.${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.post(id) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myPosts })
      toast.success('Post updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update post')
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/rest/v1/posts?id=eq.${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myPosts })
      toast.success('Post deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete post')
    },
  })
}

export function useSubmitPost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(`/rest/v1/posts?id=eq.${id}`, { status: 'pending' })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myPosts })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pendingPosts })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.approvals })
      toast.success('Post submitted for approval')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to submit post')
    },
  })
}

// Approvals
export function useApprovals() {
  return useQuery({
    queryKey: QUERY_KEYS.approvals,
    queryFn: async () => {
      const response = await apiClient.get('/rest/v1/posts?status=eq.pending')
      return response.data
    },
  })
}

export function useApprovePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await apiClient.patch(`/rest/v1/posts?id=eq.${postId}`, { status: 'published' })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.approvals })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts })
      toast.success('Post approved successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to approve post')
    },
  })
}

export function useRejectPost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ postId, reason }: { postId: string; reason: string }) => {
      const response = await apiClient.patch(`/rest/v1/posts?id=eq.${postId}`, { status: 'rejected' })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.approvals })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts })
      toast.success('Post rejected')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to reject post')
    },
  })
}

// Categories
export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: async () => {
      const response = await apiClient.get('/rest/v1/categories')
      return response.data
    },
  })
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.category(id),
    queryFn: async () => {
      const response = await apiClient.get(`/rest/v1/categories?id=eq.${id}`)
      return response.data[0]
    },
    enabled: !!id,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/rest/v1/categories', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories })
      toast.success('Category created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create category')
    },
  })
}

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.patch(`/rest/v1/categories?id=eq.${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.category(id) })
      toast.success('Category updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update category')
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/rest/v1/categories?id=eq.${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories })
      toast.success('Category deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete category')
    },
  })
}

// Users
export function useUsers() {
  return useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: async () => {
      const response = await apiClient.get('/rest/v1/user_profiles')
      return response.data
    },
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.user(id),
    queryFn: async () => {
      const response = await apiClient.get(`/rest/v1/user_profiles?id=eq.${id}`)
      return response.data[0]
    },
    enabled: !!id,
  })
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.patch(`/rest/v1/user_profiles?id=eq.${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user(id) })
      toast.success('User updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update user')
    },
  })
}
