// Export types from database
export type {
  UserRole,
  PostStatus,
  ApprovalStatus,
  Profile,
  Post,
  Category,
  PostCategory,
  Approval,
  Comment,
  ArticleStats,
  ActivityLog,
  Database
} from './database'

// Import for use in this file
import type { UserRole, PostStatus, Post, Profile, Category, ArticleStats } from './database'

// Application Types
export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url?: string
  is_active: boolean
  created_at: string
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

// Post with relations
export interface PostWithRelations extends Post {
  writer?: Profile
  editor?: Profile
  categories?: Category[]
  stats?: ArticleStats
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiError {
  code: string
  message: string
}

// Dashboard Stats
export interface DashboardStats {
  totalArticles: number
  draft: number
  pending: number
  approved: number
  rejected: number
  published: number
}

export interface WriterStats extends DashboardStats {
  recentRejections?: Array<{
    postId: string
    title: string
    reason: string
    rejectedAt: string
  }>
}

export interface EditorStats {
  pendingCount: number
  approvedToday: number
  rejectedToday: number
  avgApprovalTime?: number
}

export interface SystemStats {
  totalUsers: number
  usersByRole: Record<UserRole, number>
  articlesByStatus: Record<PostStatus, number>
  approvalRate: number
}
