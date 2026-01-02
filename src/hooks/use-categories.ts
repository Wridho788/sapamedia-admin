// React Query Hooks - Categories - SPRINT X
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { categoriesApi, CreateCategoryDto, UpdateCategoryDto } from '@/api'
import { activityLogger } from '@/lib/activity-logger'
import { useAuth } from './use-auth'

// Query Keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: () => [...categoryKeys.lists()] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  bySlug: (slug: string) => [...categoryKeys.all, 'slug', slug] as const,
}

// Get all categories
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => categoriesApi.getCategories(),
    staleTime: 300000, // 5 minutes - categories don't change often
  })
}

// Get single category
export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoriesApi.getCategory(id),
    enabled: !!id,
  })
}

// Get category by slug
export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: categoryKeys.bySlug(slug),
    queryFn: () => categoriesApi.getCategoryBySlug(slug),
    enabled: !!slug,
  })
}

// Create category
export function useCreateCategory() {
  const queryClient = useQueryClient()
  const { authUser } = useAuth()

  return useMutation({
    mutationFn: (data: CreateCategoryDto) => categoriesApi.createCategory(data),
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      
      if (authUser?.id) {
        await activityLogger.log({
          user_id: authUser.id,
          action: 'CATEGORY_CREATED',
          entity_type: 'category',
          entity_id: data.id,
          metadata: { name: data.name, slug: data.slug },
        })
      }
      
      toast.success('Kategori berhasil dibuat')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal membuat kategori')
    }
  })
}

// Update category
export function useUpdateCategory() {
  const queryClient = useQueryClient()
  const { authUser } = useAuth()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) => 
      categoriesApi.updateCategory(id, data),
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      
      if (authUser?.id) {
        await activityLogger.log({
          user_id: authUser.id,
          action: 'CATEGORY_UPDATED',
          entity_type: 'category',
          entity_id: variables.id,
          metadata: { ...variables.data },
        })
      }
      
      toast.success('Kategori berhasil diupdate')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal mengupdate kategori')
    }
  })
}

// Delete category
export function useDeleteCategory() {
  const queryClient = useQueryClient()
  const { authUser } = useAuth()

  return useMutation({
    mutationFn: (id: string) => categoriesApi.deleteCategory(id),
    onSuccess: async (_, id) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      
      if (authUser?.id) {
        await activityLogger.log({
          user_id: authUser.id,
          action: 'CATEGORY_DELETED',
          entity_type: 'category',
          entity_id: id,
        })
      }
      
      toast.success('Kategori berhasil dihapus')
    },
    onError: (error: any) => {
      const message = error.message === 'Cannot delete category that is used by articles' 
        ? 'Tidak dapat menghapus kategori yang masih digunakan artikel'
        : 'Gagal menghapus kategori'
      toast.error(message)
    }
  })
}
