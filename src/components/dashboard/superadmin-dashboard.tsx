// Super Admin Dashboard - Sprint 1 & 2
'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  FileText, 
  TrendingUp,
  Activity
} from 'lucide-react'
import Link from 'next/link'
import apiClient from '@/lib/axios'
import { SystemStats } from '@/types'

export function SuperAdminDashboard() {
  // Fetch system stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['system-stats'],
    queryFn: async () => {
      const [users, posts, approvals] = await Promise.all([
        apiClient.get('/rest/v1/profiles?select=role'),
        apiClient.get('/rest/v1/posts?select=status'),
        apiClient.get('/rest/v1/approvals?select=status'),
      ])

      const usersByRole = users.data.reduce((acc: any, user: any) => {
        acc[user.role] = (acc[user.role] || 0) + 1
        return acc
      }, {})

      const articlesByStatus = posts.data.reduce((acc: any, post: any) => {
        acc[post.status] = (acc[post.status] || 0) + 1
        return acc
      }, {})

      const totalApprovals = approvals.data.length
      const approved = approvals.data.filter((a: any) => a.status === 'approved').length
      const approvalRate = totalApprovals > 0 ? (approved / totalApprovals) * 100 : 0

      return {
        totalUsers: users.data.length,
        usersByRole,
        articlesByStatus,
        approvalRate,
      } as SystemStats
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-3">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  const totalArticles = Object.values(stats?.articlesByStatus || {}).reduce((a: any, b: any) => a + b, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Super Admin</h1>
        <p className="text-gray-600 mt-1">Monitor dan kelola seluruh sistem</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Pengguna
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Pengguna aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Artikel
            </CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArticles}</div>
            <p className="text-xs text-gray-500 mt-1">Semua artikel</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Approval Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.approvalRate.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Tingkat persetujuan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Menunggu Review
            </CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.articlesByStatus?.pending || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Perlu direview</p>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Pengguna</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Super Admin</span>
                <span className="text-lg font-bold">{stats?.usersByRole?.super_admin || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Editor</span>
                <span className="text-lg font-bold">{stats?.usersByRole?.editor || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Writer</span>
                <span className="text-lg font-bold">{stats?.usersByRole?.writer || 0}</span>
              </div>
            </div>
            <Link href="/admin/users">
              <Button variant="outline" className="w-full mt-4">Kelola Pengguna</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Articles by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Artikel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className="text-sm font-medium text-gray-600">Draft</span>
                </div>
                <span className="text-lg font-bold">{stats?.articlesByStatus?.draft || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm font-medium text-gray-600">Pending</span>
                </div>
                <span className="text-lg font-bold">{stats?.articlesByStatus?.pending || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium text-gray-600">Approved</span>
                </div>
                <span className="text-lg font-bold">{stats?.articlesByStatus?.approved || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-gray-600">Published</span>
                </div>
                <span className="text-lg font-bold">{stats?.articlesByStatus?.published || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium text-gray-600">Rejected</span>
                </div>
                <span className="text-lg font-bold">{stats?.articlesByStatus?.rejected || 0}</span>
              </div>
            </div>
            <Link href="/admin/articles">
              <Button variant="outline" className="w-full mt-4">Lihat Semua Artikel</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/users">
              <Button variant="outline" className="w-full">Kelola Pengguna</Button>
            </Link>
            <Link href="/admin/articles">
              <Button variant="outline" className="w-full">Kelola Artikel</Button>
            </Link>
            <Link href="/admin/categories">
              <Button variant="outline" className="w-full">Kelola Kategori</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
