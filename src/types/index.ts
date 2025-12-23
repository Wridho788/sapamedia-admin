export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url?: string
  created_at: string
  updated_at?: string
}

export interface AuthUser {
  user: User | null
  role: UserRole | null
  isLoggedIn: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export type UserRole = 'admin' | 'editor' | 'writer'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  createdAt: Date
  updatedAt: Date
}

export interface Tag {
  id: string
  name: string
  slug: string
  color?: string
}

export interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage?: string
  status: ArticleStatus
  author: User
  categories: Category[]
  tags: Tag[]
  seo: SEOData
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export type ArticleStatus = 'draft' | 'in_review' | 'published' | 'archived'

export interface SEOData {
  metaTitle?: string
  metaDescription?: string
  focusKeyword?: string
  schema?: Record<string, any>
}

export interface DashboardStats {
  totalArticles: number
  publishedArticles: number
  draftArticles: number
  totalViews: number
  totalCategories: number
  totalUsers: number
}

export interface MediaFile {
  id: string
  url: string
  filename: string
  size: number
  mimeType: string
  createdAt: Date
}