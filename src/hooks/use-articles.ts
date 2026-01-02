// React Query Hooks - Articles - SPRINT X
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { articlesApi, CreateArticleDto, UpdateArticleDto, ArticleFilters } from '@/api'
import { activityLogger } from '@/lib/activity-logger'
import { useAuth } from './use-auth'

// Query Keys
export const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (filters?: ArticleFilters) => [...articleKeys.lists(), filters] as const,
  details: () => [...articleKeys.all, 'detail'] as const,
  detail: (id: string) => [...articleKeys.details(), id] as const,
  mine: (userId: string) => [...articleKeys.all, 'mine', userId] as const,
  pending: () => [...articleKeys.all, 'pending'] as const,
}

// Get all articles
export function useArticles(filters?: ArticleFilters) {
  return useQuery({
    queryKey: articleKeys.list(filters),
    queryFn: () => articlesApi.getArticles(filters),
    staleTime: 30000, // 30 seconds
  })
}

// Get single article
export function useArticle(id: string) {
  return useQuery({
    queryKey: articleKeys.detail(id),
    queryFn: () => articlesApi.getArticle(id),
    enabled: !!id,
  })
}

// Get my articles
export function useMyArticles(userId: string, filters?: Omit<ArticleFilters, 'writer_id'>) {
  return useQuery({
    queryKey: articleKeys.mine(userId),
    queryFn: () => articlesApi.getMyArticles(userId, filters),
    enabled: !!userId,
  })
}

// Get pending articles
export function usePendingArticles() {
  return useQuery({
    queryKey: articleKeys.pending(),
    queryFn: () => articlesApi.getPendingArticles(),
  })
}

// Create article
export function useCreateArticle() {
  const queryClient = useQueryClient()
  const { authUser } = useAuth()

  return useMutation({
    mutationFn: (data: CreateArticleDto) => articlesApi.createArticle(data),
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() })
      queryClient.invalidateQueries({ queryKey: articleKeys.mine(data.writer_id) })
      
      if (authUser?.id) {
        await activityLogger.log({
          user_id: authUser.id,
          action: 'POST_CREATED',
          entity_type: 'post',
          entity_id: data.id,
          metadata: { title: data.title },
        })
      }
      
      toast.success('Artikel berhasil dibuat')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal membuat artikel')
    }
  })
}

// Update article
export function useUpdateArticle() {
  const queryClient = useQueryClient()
  const { authUser } = useAuth()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateArticleDto }) => 
      articlesApi.updateArticle(id, data),
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() })
      
      if (authUser?.id) {
        await activityLogger.log({
          user_id: authUser.id,
          action: 'POST_UPDATED',
          entity_type: 'post',
          entity_id: variables.id,
          metadata: { ...variables.data },
        })
      }
      
      toast.success('Artikel berhasil diupdate')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal mengupdate artikel')
    }
  })
}

// Submit article
export function useSubmitArticle() {
  const queryClient = useQueryClient()
  const { authUser } = useAuth()

  return useMutation({
    mutationFn: (id: string) => articlesApi.submitArticle(id),
    onSuccess: async (data, id) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() })
      queryClient.invalidateQueries({ queryKey: articleKeys.pending() })
      
      if (authUser?.id) {
        await activityLogger.log({
          user_id: authUser.id,
          action: 'POST_SUBMITTED',
          entity_type: 'post',
          entity_id: id,
        })
      }
      
      toast.success('Artikel berhasil disubmit untuk review')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal submit artikel')
    }
  })
}

// Delete article
export function useDeleteArticle() {
  const queryClient = useQueryClient()
  const { authUser } = useAuth()

  return useMutation({
    mutationFn: (id: string) => articlesApi.deleteArticle(id),
    onSuccess: async (_, id) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() })
      
      if (authUser?.id) {
        await activityLogger.log({
          user_id: authUser.id,
          action: 'POST_DELETED',
          entity_type: 'post',
          entity_id: id,
        })
      }
      
      toast.success('Artikel berhasil dihapus')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal menghapus artikel')
    }
  })
}

// Publish article
export function usePublishArticle() {
  const queryClient = useQueryClient()
  const { authUser } = useAuth()

  return useMutation({
    mutationFn: (id: string) => articlesApi.publishArticle(id),
    onSuccess: async (data, id) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() })
      
      if (authUser?.id) {
        await activityLogger.log({
          user_id: authUser.id,
          action: 'POST_PUBLISHED',
          entity_type: 'post',
          entity_id: id,
        })
      }
      
      toast.success('Artikel berhasil dipublish')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal publish artikel')
    }
  })
}
