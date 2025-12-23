export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          full_name: string
          roles: 'admin' | 'editor' | 'writer'
          avatar_url?: string
          created_at: string
          updated_at?: string
        }
        Insert: {
          id: string
          full_name: string
          roles?: 'admin' | 'editor' | 'writer'
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          roles?: 'admin' | 'editor' | 'writer'
          avatar_url?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}