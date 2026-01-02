// Database Types - Sesuai Roadmap V1

export type UserRole = 'super_admin' | 'editor' | 'writer'
export type PostStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'published'
export type ApprovalStatus = 'approved' | 'rejected'

export interface Profile {
  id: string
  full_name: string
  avatar_url?: string
  role: UserRole
  is_active: boolean
  created_at: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  cover_image?: string
  status: PostStatus
  writer_id: string
  editor_id?: string
  rejected_reason?: string
  published_at?: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface PostCategory {
  post_id: string
  category_id: string
}

export interface Approval {
  id: string
  post_id: string
  editor_id: string
  status: ApprovalStatus
  reason?: string
  created_at: string
}

export interface Comment {
  id: string
  post_id: string
  user_id?: string
  content: string
  parent_comment_id?: string
  is_deleted: boolean
  created_at: string
}

export interface ArticleStats {
  post_id: string
  views: number
  shares: number
}

export interface ActivityLog {
  id: string
  actor_id: string
  actor_role: UserRole
  action: string
  entity_type: string
  entity_id: string
  meta?: Record<string, any>
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'> & { created_at?: string }
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      posts: {
        Row: Post
        Insert: Omit<Post, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Post, 'id' | 'created_at'>>
      }
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<Category, 'id' | 'created_at'>>
      }
      post_categories: {
        Row: PostCategory
        Insert: PostCategory
        Update: never
      }
      approvals: {
        Row: Approval
        Insert: Omit<Approval, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: never
      }
      comments: {
        Row: Comment
        Insert: Omit<Comment, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<Comment, 'id' | 'created_at'>>
      }
      article_stats: {
        Row: ArticleStats
        Insert: ArticleStats
        Update: Partial<ArticleStats>
      }
      activity_logs: {
        Row: ActivityLog
        Insert: Omit<ActivityLog, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: never
      }
    }
  }
}