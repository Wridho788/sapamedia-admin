import { useState, useEffect } from 'react'

// Mock data for testing (will be replaced with real API later)
let mockPosts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js 15',
    slug: 'getting-started-nextjs-15',
    excerpt: 'Learn how to build modern web applications with the latest features in Next.js 15.',
    content: '# Getting Started with Next.js 15\n\nNext.js 15 brings many exciting features...',
    cover_image: null,
    images: null,
    status: 'published',
    editor_id: 'editor-user-id',
    writer_id: 'writer-user-id',
    reject_reason: null,
    published_at: '2024-01-15T10:30:00Z',
    created_at: '2024-01-10T08:00:00Z',
    category_id: 'tech-category-id',
    category: { id: 'tech-category-id', name: 'Technology' },
    editor: { id: 'editor-user-id', full_name: 'Content Editor' },
    writer: { id: 'writer-user-id', full_name: 'Content Writer' }
  },
  {
    id: '2',
    title: 'Advanced React Patterns',
    slug: 'advanced-react-patterns',
    excerpt: 'Explore advanced patterns and techniques for building scalable React applications.',
    content: '# Advanced React Patterns\n\nIn this comprehensive guide, we will explore...',
    cover_image: null,
    images: null,
    status: 'in_review',
    editor_id: null,
    writer_id: 'writer-user-id',
    reject_reason: null,
    published_at: null,
    created_at: '2024-01-20T14:15:00Z',
    category_id: 'tech-category-id',
    category: { id: 'tech-category-id', name: 'Technology' },
    editor: undefined,
    writer: { id: 'writer-user-id', full_name: 'Content Writer' }
  },
  {
    id: '3',
    title: 'Building REST APIs with Node.js',
    slug: 'building-rest-apis-nodejs',
    excerpt: 'A complete guide to creating robust REST APIs using Node.js and Express.',
    content: '# Building REST APIs with Node.js\n\nNode.js has become the go-to platform...',
    cover_image: null,
    images: null,
    status: 'draft',
    editor_id: null,
    writer_id: 'writer-user-id',
    reject_reason: 'Please add more examples and improve the introduction section.',
    published_at: null,
    created_at: '2024-01-25T09:45:00Z',
    category_id: 'tech-category-id',
    category: { id: 'tech-category-id', name: 'Technology' },
    editor: undefined,
    writer: { id: 'writer-user-id', full_name: 'Content Writer' }
  },
  {
    id: '4',
    title: 'Database Design Best Practices',
    slug: 'database-design-best-practices',
    excerpt: 'Learn the fundamental principles of good database design and normalization.',
    content: '# Database Design Best Practices\n\nDesigning efficient databases is crucial...',
    cover_image: null,
    images: null,
    status: 'archived',
    editor_id: 'editor-user-id',
    writer_id: 'writer-user-id',
    reject_reason: null,
    published_at: '2024-01-05T16:20:00Z',
    created_at: '2024-01-01T12:00:00Z',
    category_id: 'tech-category-id',
    category: { id: 'tech-category-id', name: 'Technology' },
    editor: { id: 'editor-user-id', full_name: 'Content Editor' },
    writer: { id: 'writer-user-id', full_name: 'Content Writer' }
  }
]

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_image: string | null
  images: string[] | null
  status: 'draft' | 'published' | 'in_review' | 'archived'
  editor_id: string | null
  writer_id: string | null
  reject_reason: string | null
  published_at: string | null
  created_at: string
  category_id: string | null
  // Joined data
  category?: {
    id: string
    name: string
  }
  editor?: {
    id: string
    full_name: string
  }
  writer?: {
    id: string
    full_name: string
  }
}

export interface PostFilters {
  status?: string
  search?: string
  categoryId?: string
  limit?: number
  offset?: number
}

export function usePosts(filters: PostFilters = {}) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetchPosts = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      let filteredPosts = [...mockPosts]
      
      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.status === filters.status)
      }
      
      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredPosts = filteredPosts.filter(post => 
          post.title.toLowerCase().includes(searchLower) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(searchLower))
        )
      }
      
      // Apply category filter
      if (filters.categoryId) {
        filteredPosts = filteredPosts.filter(post => post.category_id === filters.categoryId)
      }
      
      // Apply pagination
      const startIndex = filters.offset || 0
      const limit = filters.limit || filteredPosts.length
      const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit)
      
      setPosts(paginatedPosts)
      setTotal(filteredPosts.length)
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [filters.status, filters.search, filters.categoryId, filters.limit, filters.offset])

  const refetch = () => {
    fetchPosts()
  }

  return {
    posts,
    loading,
    error,
    total,
    refetch
  }
}

export function usePost(id: string) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchPost = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const foundPost = mockPosts.find(post => post.id === id)
        
        if (!foundPost) {
          throw new Error('Post not found')
        }

        setPost(foundPost)
      } catch (err) {
        console.error('Error fetching post:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch post')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  return {
    post,
    loading,
    error
  }
}

export function useCreatePost() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPost = async (postData: Partial<Post>) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock authentication - assume current user is writer
      const mockUserId = 'writer-user-id'
      
      const newPost: Post = {
        id: Date.now().toString(),
        title: postData.title || 'Untitled',
        slug: postData.slug || 'untitled',
        excerpt: postData.excerpt || null,
        content: postData.content || null,
        cover_image: postData.cover_image || null,
        images: postData.images || null,
        status: 'draft', // Always create as draft
        editor_id: null,
        writer_id: mockUserId,
        reject_reason: null,
        published_at: null,
        created_at: new Date().toISOString(),
        category_id: postData.category_id || null
      }
      
      // Add to mock data
      mockPosts.unshift(newPost)

      return { success: true, data: newPost }
    } catch (err) {
      console.error('Error creating post:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to create post'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    createPost,
    loading,
    error
  }
}

export function useUpdatePost() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updatePost = async (id: string, postData: Partial<Post>) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const postIndex = mockPosts.findIndex(post => post.id === id)
      
      if (postIndex === -1) {
        throw new Error('Post not found')
      }
      
      const updatedPost = { ...mockPosts[postIndex], ...postData }
      mockPosts[postIndex] = updatedPost

      return { success: true, data: updatedPost }
    } catch (err) {
      console.error('Error updating post:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update post'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    updatePost,
    loading,
    error
  }
}

export function useApprovePost() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const approvePost = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const postIndex = mockPosts.findIndex(post => post.id === id)
      
      if (postIndex === -1) {
        throw new Error('Post not found')
      }
      
      const updatedPost = {
        ...mockPosts[postIndex],
        status: 'published' as const,
        published_at: new Date().toISOString(),
        editor_id: 'editor-user-id',
        reject_reason: null
      }
      
      mockPosts[postIndex] = updatedPost

      return { success: true, data: updatedPost }
    } catch (err) {
      console.error('Error approving post:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve post'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    approvePost,
    loading,
    error
  }
}

export function useRejectPost() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const rejectPost = async (id: string, rejectReason: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (!rejectReason || rejectReason.trim() === '') {
        throw new Error('Reject reason is required')
      }
      
      const postIndex = mockPosts.findIndex(post => post.id === id)
      
      if (postIndex === -1) {
        throw new Error('Post not found')
      }
      
      const updatedPost = {
        ...mockPosts[postIndex],
        status: 'draft' as const,
        reject_reason: rejectReason,
        editor_id: 'editor-user-id'
      }
      
      mockPosts[postIndex] = updatedPost

      return { success: true, data: updatedPost }
    } catch (err) {
      console.error('Error rejecting post:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to reject post'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    rejectPost,
    loading,
    error
  }
}

export function useDeletePost() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deletePost = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const postIndex = mockPosts.findIndex(post => post.id === id)
      
      if (postIndex === -1) {
        throw new Error('Post not found')
      }
      
      mockPosts.splice(postIndex, 1)

      return { success: true }
    } catch (err) {
      console.error('Error deleting post:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete post'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    deletePost,
    loading,
    error
  }
}