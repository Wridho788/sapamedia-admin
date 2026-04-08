// Articles API Module - SPRINT X
import apiClient from '@/lib/axios'
import { Post, PostWithWriter, PostStatus } from '@/types'

export interface CreateArticleDto {
  title: string
  slug: string
  excerpt?: string
  content: string
  cover_image?: string
  status?: PostStatus
  writer_id: string
}

export interface UpdateArticleDto {
  title?: string
  slug?: string
  excerpt?: string
  content?: string
  cover_image?: string
  status?: PostStatus
}

export interface ArticleFilters {
  status?: PostStatus
  writer_id?: string
  search?: string
  limit?: number
  offset?: number
}

export const articlesApi = {
  // Get all articles with filters
  async getArticles(filters?: ArticleFilters) {
    const params = new URLSearchParams()
    
    if (filters?.status) params.append('status', `eq.${filters.status}`)
    if (filters?.writer_id) params.append('writer_id', `eq.${filters.writer_id}`)
    if (filters?.search) params.append('title', `ilike.*${filters.search}*`)
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.offset) params.append('offset', filters.offset.toString())
    
    const queryString = params.toString()
    const url = `/rest/v1/posts?select=*,writer:profiles!writer_id(full_name)&order=created_at.desc${queryString ? '&' + queryString : ''}`
    
    const response = await apiClient.get(url)
    return response.data as Post[]
  },

  // Get single article by ID
  async getArticle(id: string) {
    const response = await apiClient.get(
      `/rest/v1/posts?id=eq.${id}&select=*,writer:profiles!writer_id(id,full_name,avatar_url),editor:profiles!editor_id(id,full_name)`
    )
    return response.data[0] as PostWithWriter
  },

  // Get my articles (writer's own articles)
  async getMyArticles(writerId: string, filters?: Omit<ArticleFilters, 'writer_id'>) {
    return this.getArticles({ ...filters, writer_id: writerId })
  },

  // Get pending articles (for editors)
  async getPendingArticles() {
    return this.getArticles({ status: 'pending' })
  },

  // Create new article
  async createArticle(data: CreateArticleDto) {
    const response = await apiClient.post('/rest/v1/posts', data)
    return response.data as Post
  },

  // Update article
  async updateArticle(id: string, data: UpdateArticleDto) {
    const response = await apiClient.patch(`/rest/v1/posts?id=eq.${id}`, data)
    return response.data as Post
  },

  // Submit article for review
  async submitArticle(id: string) {
    const response = await apiClient.patch(`/rest/v1/posts?id=eq.${id}`, {
      status: 'pending'
    })
    return response.data as Post
  },

  // Delete article
  async deleteArticle(id: string) {
    await apiClient.delete(`/rest/v1/posts?id=eq.${id}`)
  },

  // Publish article
  async publishArticle(id: string) {
    const response = await apiClient.patch(`/rest/v1/posts?id=eq.${id}`, {
      status: 'published',
      published_at: new Date().toISOString()
    })
    return response.data as Post
  }
}
