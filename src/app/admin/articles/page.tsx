'use client'

import { useState } from 'react'
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
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye,
  Edit,
  Trash2,
  Calendar
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

// Mock data - replace with real data from your API
const mockArticles = [
  {
    id: '1',
    title: 'Panduan Lengkap Next.js 14 untuk Developer',
    slug: 'panduan-lengkap-nextjs-14-untuk-developer',
    excerpt: 'Pelajari fitur-fitur terbaru Next.js 14 dan cara menggunakannya dalam project Anda.',
    status: 'published',
    author: { name: 'John Doe', email: 'john@example.com' },
    categories: [{ name: 'Technology' }, { name: 'Programming' }],
    createdAt: '2024-01-15T10:30:00Z',
    publishedAt: '2024-01-15T12:00:00Z',
    views: 1234
  },
  {
    id: '2',
    title: 'Tips & Trik React Development',
    slug: 'tips-trik-react-development',
    excerpt: 'Kumpulan tips dan trik untuk meningkatkan produktivitas dalam React development.',
    status: 'draft',
    author: { name: 'Jane Smith', email: 'jane@example.com' },
    categories: [{ name: 'Programming' }],
    createdAt: '2024-01-14T09:15:00Z',
    publishedAt: null,
    views: 0
  },
  {
    id: '3',
    title: 'Optimasi Performance Website',
    slug: 'optimasi-performance-website',
    excerpt: 'Cara-cara efektif untuk meningkatkan performa website Anda.',
    status: 'in_review',
    author: { name: 'Mike Johnson', email: 'mike@example.com' },
    categories: [{ name: 'Web Development' }],
    createdAt: '2024-01-13T14:20:00Z',
    publishedAt: null,
    views: 567
  },
  {
    id: '4',
    title: 'Memahami TypeScript untuk Pemula',
    slug: 'memahami-typescript-untuk-pemula',
    excerpt: 'Pengenalan TypeScript dan manfaatnya dalam pengembangan JavaScript.',
    status: 'archived',
    author: { name: 'Sarah Wilson', email: 'sarah@example.com' },
    categories: [{ name: 'Programming' }, { name: 'TypeScript' }],
    createdAt: '2024-01-12T11:45:00Z',
    publishedAt: '2024-01-12T16:00:00Z',
    views: 892
  }
]

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [filteredArticles, setFilteredArticles] = useState(mockArticles)

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
    filterArticles(query, statusFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    filterArticles(searchQuery, status)
  }

  const filterArticles = (query: string, status: string) => {
    let filtered = mockArticles

    if (query) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(query.toLowerCase())
      )
    }

    if (status !== 'all') {
      filtered = filtered.filter(article => article.status === status)
    }

    setFilteredArticles(filtered)
  }

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
        <Link href="/admin/articles/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </Button>
        </Link>
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
          <CardTitle>All Articles ({filteredArticles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{article.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                      {getStatusText(article.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{article.excerpt}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>By {article.author.name}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDateTime(article.createdAt)}
                    </span>
                    {article.status === 'published' && (
                      <>
                        <span>•</span>
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {article.views} views
                        </span>
                      </>
                    )}
                    <span>•</span>
                    <span>{article.categories.map(cat => cat.name).join(', ')}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href={`/admin/articles/${article.id}`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
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
              {!searchQuery && statusFilter === 'all' && (
                <Link href="/admin/articles/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Article
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}