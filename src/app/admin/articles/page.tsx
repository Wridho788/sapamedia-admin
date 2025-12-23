'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye,
  Edit,
  Trash2,
  Calendar,
  Loader2,
  Check,
  X,
  AlertCircle
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { usePosts, useDeletePost, useApprovePost, useRejectPost } from '@/hooks/use-posts'
import { createAuthHelpers } from '@/lib/auth'
import { UserRole } from '@/types'
import { toast } from 'sonner'

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  
  // Dialog states
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  
  // Use posts hook with filters
  const { posts, loading, error, total, refetch } = usePosts({
    search: searchQuery || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    limit: 50
  })

  const { deletePost, loading: deleteLoading } = useDeletePost()
  const { approvePost, loading: approveLoading } = useApprovePost()
  const { rejectPost, loading: rejectLoading } = useRejectPost()

  // Get current user role
  useEffect(() => {
    const fetchUserRole = async () => {
      const auth = createAuthHelpers()
      const user = await auth.getCurrentUser()
      
      if (user) {
        setCurrentUserId(user.id)
        const profile = await auth.getUserProfile(user.id)
        if (profile) {
          setUserRole(profile.role)
        }
      }
    }

    fetchUserRole()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700'
      case 'draft':
        return 'bg-yellow-100 text-yellow-700'
      case 'in_review':
        return 'bg-blue-100 text-blue-700'
      case 'archived':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Published'
      case 'draft':
        return 'Draft'
      case 'in_review':
        return 'In Review'
      case 'archived':
        return 'Archived'
      default:
        return status
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
  }

  const handleApprove = async (postId: string) => {
    const result = await approvePost(postId)
    
    if (result.success) {
      toast.success('Article approved successfully')
      refetch()
    } else {
      toast.error(result.error || 'Failed to approve article')
    }
  }

  const handleRejectClick = (postId: string) => {
    setSelectedPostId(postId)
    setRejectReason('')
    setRejectDialogOpen(true)
  }

  const handleRejectConfirm = async () => {
    if (!selectedPostId) return
    
    const result = await rejectPost(selectedPostId, rejectReason)
    
    if (result.success) {
      toast.success('Article rejected')
      setRejectDialogOpen(false)
      setRejectReason('')
      setSelectedPostId(null)
      refetch()
    } else {
      toast.error(result.error || 'Failed to reject article')
    }
  }

  const handleDeleteClick = (postId: string) => {
    setSelectedPostId(postId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedPostId) return
    
    const result = await deletePost(selectedPostId)
    
    if (result.success) {
      toast.success('Article deleted successfully')
      setDeleteDialogOpen(false)
      setSelectedPostId(null)
      refetch()
    } else {
      toast.error(result.error || 'Failed to delete article')
    }
  }

  // Check permissions
  const canCreateArticle = userRole === 'writer'
  const canApproveReject = userRole === 'editor'
  const canDelete = userRole === 'admin'
  const canEdit = (post: any) => {
    if (userRole === 'writer') {
      return post.writer_id === currentUserId && post.status === 'draft'
    }
    return false
  }

  // Debounce search to prevent too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // The usePosts hook will automatically refetch when searchQuery changes
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-600 mt-2">
            Manage your articles and content.
          </p>
        </div>
        {canCreateArticle && (
          <Link href="/admin/articles/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Articles List */}
      <Card>
        <CardHeader>
          <CardTitle>All Articles ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading articles...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-400 mb-4">
                <AlertCircle className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading articles</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={refetch} variant="outline">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{post.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                        {getStatusText(post.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{post.excerpt || 'No excerpt available'}</p>
                    
                    {/* Reject Reason */}
                    {post.reject_reason && (
                      <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                        <span className="font-medium text-red-700">Rejected: </span>
                        <span className="text-red-600">{post.reject_reason}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>By {post.writer?.full_name || post.editor?.full_name || 'Unknown'}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDateTime(post.created_at)}
                      </span>
                      {post.status === 'published' && post.published_at && (
                        <>
                          <span>•</span>
                          <span>Published {formatDateTime(post.published_at)}</span>
                        </>
                      )}
                      {post.category && (
                        <>
                          <span>•</span>
                          <span>{post.category.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Writer: Can edit only draft posts they created */}
                    {canEdit(post) && (
                      <Link href={`/admin/articles/${post.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    
                    {/* Editor: Can approve or reject in_review posts */}
                    {canApproveReject && post.status === 'in_review' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleApprove(post.id)}
                          disabled={approveLoading}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRejectClick(post.id)}
                          disabled={rejectLoading}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    
                    {/* Super Admin: Can delete published posts */}
                    {canDelete && post.status === 'published' && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteClick(post.id)}
                        disabled={deleteLoading}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {posts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Get started by creating your first article.'
                    }
                  </p>
                  {!searchQuery && statusFilter === 'all' && canCreateArticle && (
                    <Link href="/admin/articles/new">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Article
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Article</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this article. This will help the writer improve their content.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter reject reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setRejectDialogOpen(false)}
              disabled={rejectLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRejectConfirm}
              disabled={!rejectReason.trim() || rejectLoading}
            >
              {rejectLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                'Reject Article'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this article? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Article'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}