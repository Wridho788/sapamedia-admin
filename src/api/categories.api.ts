// Categories API Module - SPRINT X
import apiClient from '@/lib/axios'
import { Category } from '@/types'

export interface CreateCategoryDto {
  name: string
  slug: string
}

export interface UpdateCategoryDto {
  name?: string
  slug?: string
}

export const categoriesApi = {
  // Get all categories
  async getCategories() {
    const response = await apiClient.get(
      '/rest/v1/categories?select=*&order=name.asc'
    )
    return response.data as Category[]
  },

  // Get single category by ID
  async getCategory(id: string) {
    const response = await apiClient.get(
      `/rest/v1/categories?id=eq.${id}`
    )
    return response.data[0] as Category
  },

  // Get category by slug
  async getCategoryBySlug(slug: string) {
    const response = await apiClient.get(
      `/rest/v1/categories?slug=eq.${slug}`
    )
    return response.data[0] as Category
  },

  // Create new category
  async createCategory(data: CreateCategoryDto) {
    const response = await apiClient.post('/rest/v1/categories', data)
    return response.data as Category
  },

  // Update category
  async updateCategory(id: string, data: UpdateCategoryDto) {
    const response = await apiClient.patch(`/rest/v1/categories?id=eq.${id}`, data)
    return response.data as Category
  },

  // Delete category
  async deleteCategory(id: string) {
    // Check if category is used by any posts
    const postsCheck = await apiClient.get(`/rest/v1/post_categories?category_id=eq.${id}`)
    
    if (postsCheck.data && postsCheck.data.length > 0) {
      throw new Error('Cannot delete category that is used by articles')
    }

    await apiClient.delete(`/rest/v1/categories?id=eq.${id}`)
  },

  // Get articles by category
  async getCategoryArticles(categoryId: string) {
    const response = await apiClient.get(
      `/rest/v1/post_categories?category_id=eq.${categoryId}&select=post:posts(*)`
    )
    return response.data.map((item: any) => item.post)
  }
}
