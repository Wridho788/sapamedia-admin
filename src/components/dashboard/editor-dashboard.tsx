// Editor Dashboard - Sprint 1 & 2
'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import apiClient from '@/lib/axios'
import { Post, EditorStats } from '@/types'
import { formatDate } from '@/lib/helpers'

export function EditorDashboard() {
  // Fetch pending articles
  const { data: pendingPosts, isLoading } = useQuery({
    queryKey: ['editor-pending-posts'],
    queryFn: async () => {
      const response = await apiClient.get(`/rest/v1/posts?status=eq.pending&select=*,writer:profiles!writer_id(full_name)&order=created_at.asc&limit=10`)
      return response.data as (Post & { writer: { full_name: string } })[]
    }
  })

  // Fetch today's approvals/rejections
  const { data: todayStats } = useQuery({
    queryKey: ['editor-today-stats'],
    queryFn: async () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayISO = today.toISOString()

      const [approved, rejected] = await Promise.all([
        apiClient.get(`/rest/v1/approvals?status=eq.approved&created_at=gte.${todayISO}&select=count`),
        apiClient.get(`/rest/v1/approvals?status=eq.rejected&created_at=gte.${todayISO}&select=count`),
      ])

      return {
        approvedToday: approved.data?.[0]?.count || 0,
        rejectedToday: rejected.data?.[0]?.count || 0,
      }
    }
  })

  const stats: EditorStats = {
    pendingCount: pendingPosts?.length || 0,
    approvedToday: todayStats?.approvedToday || 0,
    rejectedToday: todayStats?.rejectedToday || 0,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Editor</h1>
        <p className="text-gray-600 mt-1">Review dan kelola artikel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Menunggu Review
            </CardTitle>
            <AlertCircle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {stats.pendingCount}
            </div>
            <p className="text-xs text-gray-500 mt-1">Artikel perlu direview</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Disetujui Hari Ini
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats.approvedToday}
            </div>
            <p className="text-xs text-gray-500 mt-1">Artikel approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ditolak Hari Ini
            </CardTitle>
            <XCircle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {stats.rejectedToday}
            </div>
            <p className="text-xs text-gray-500 mt-1">Artikel rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Articles Queue */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Antrian Review</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Artikel yang perlu direview (diurutkan dari terlama)
              </p>
            </div>
            {stats.pendingCount > 0 && (
              <Link href="/admin/articles?status=pending">
                <Button variant="outline" size="sm">Lihat Semua</Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-3">Memuat artikel...</p>
            </div>
          ) : pendingPosts && pendingPosts.length > 0 ? (
            <div className="space-y-3">
              {pendingPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Oleh {post.writer?.full_name} • {formatDate(post.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link href={`/admin/articles/${post.id}/review`}>
                    <Button size="sm">Review</Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Tidak ada artikel yang menunggu review</p>
              <p className="text-sm text-gray-400 mt-1">Semua artikel sudah direview</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
