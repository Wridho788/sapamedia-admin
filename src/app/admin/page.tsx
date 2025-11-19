'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  FileText, 
  Eye, 
  FolderOpen, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  Archive
} from 'lucide-react'

const stats = [
  {
    title: 'Total Articles',
    value: '156',
    change: '+12%',
    changeType: 'positive' as const,
    icon: FileText
  },
  {
    title: 'Total Views',
    value: '45,231',
    change: '+23%',
    changeType: 'positive' as const,
    icon: Eye
  },
  {
    title: 'Categories',
    value: '24',
    change: '+3%',
    changeType: 'positive' as const,
    icon: FolderOpen
  },
  {
    title: 'Users',
    value: '12',
    change: '+1',
    changeType: 'positive' as const,
    icon: Users
  }
]

const articleStats = [
  { label: 'Published', value: 89, color: 'bg-green-500', icon: CheckCircle },
  { label: 'Draft', value: 34, color: 'bg-yellow-500', icon: Clock },
  { label: 'In Review', value: 23, color: 'bg-blue-500', icon: TrendingUp },
  { label: 'Archived', value: 10, color: 'bg-gray-500', icon: Archive }
]

const recentArticles = [
  {
    title: 'Panduan Lengkap Next.js 14 untuk Developer',
    author: 'John Doe',
    status: 'published',
    createdAt: '2 jam lalu',
    views: 1234
  },
  {
    title: 'Tips & Trik React Development',
    author: 'Jane Smith',
    status: 'draft',
    createdAt: '5 jam lalu',
    views: 0
  },
  {
    title: 'Optimasi Performance Website',
    author: 'Mike Johnson',
    status: 'in_review',
    createdAt: '1 hari lalu',
    views: 567
  }
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your content.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Article Status */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Article Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {articleStats.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{item.value}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Articles */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentArticles.map((article, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{article.title}</h4>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>By {article.author}</span>
                      <span>•</span>
                      <span>{article.createdAt}</span>
                      <span>•</span>
                      <span>{article.views} views</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      article.status === 'published' ? 'bg-green-100 text-green-700' :
                      article.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                      article.status === 'in_review' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {article.status === 'published' ? 'Published' :
                       article.status === 'draft' ? 'Draft' :
                       article.status === 'in_review' ? 'In Review' : 'Archived'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}