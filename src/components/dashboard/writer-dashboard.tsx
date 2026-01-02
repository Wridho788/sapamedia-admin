// Writer Dashboard - Sprint 1 & 2
'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  PlusIcon,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import apiClient from '@/lib/axios'
import { Post, WriterStats } from '@/types'
import { formatDate } from '@/lib/helpers'

export function WriterDashboard({ userId }: { userId: string }) {
  // Fetch writer's articles
  const { data: posts, isLoading } = useQuery({
    queryKey: ['writer-posts', userId],
    queryFn: async () => {
      const response = await apiClient.get(`/rest/v1/posts?writer_id=eq.${userId}&select=*&order=updated_at.desc&limit=5`)
      return response.data as Post[]
    }
  })

  // Calculate stats
  const stats = posts?.reduce((acc, post) => {
    acc.totalArticles++
    acc[post.status]++
    return acc
  }, {
    totalArticles: 0,
    draft: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    published: 0,
  } as WriterStats) || {
    totalArticles: 0,
    draft: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    published: 0,
  }

  const recentRejection = posts?.find(p => p.status === 'rejected')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Writer</h1>
          <p className="text-gray-600 mt-1">Kelola artikel Anda</p>
        </div>
        <Link href="/admin/articles/new">
          <Button className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Buat Artikel Baru
          </Button>
        </Link>
      </div>

      {/* Recent Rejection Alert */}
      {recentRejection && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-red-900">Artikel Ditolak</h3>
              <p className="text-sm text-red-700 mt-1">
                <strong>{recentRejection.title}</strong> ditolak
              </p>
              {recentRejection.rejected_reason && (
                <p className="text-sm text-red-600 mt-2 italic">
                  Alasan: {recentRejection.rejected_reason}
                </p>
              )}
              <Link href={`/admin/articles/${recentRejection.id}`}>
                <Button variant="outline" size="sm" className="mt-3">
                  Perbaiki Artikel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Artikel
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArticles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Draft
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Menunggu Review
            </CardTitle>
            <Eye className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Published
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Articles */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Artikel Terbaru</CardTitle>
            <Link href="/admin/articles">
              <Button variant="ghost" size="sm">Lihat Semua</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Memuat...</div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <Link href={`/admin/articles/${post.id}`}>
                      <h3 className="font-medium text-gray-900 hover:text-blue-600">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(post.updated_at)}
                    </p>
                  </div>
                  <StatusBadge status={post.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Belum ada artikel</p>
              <Link href="/admin/articles/new">
                <Button className="mt-4">Buat Artikel Pertama</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
