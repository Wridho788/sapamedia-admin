// Article Review Page - Sprint 1 & 2
'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { StatusBadge } from '@/components/ui/status-badge'
import { 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  User,
  Calendar,
  Tag
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/helpers'
import { useArticle } from '@/hooks/use-articles'
import { useApproveArticle, useRejectArticle } from '@/hooks/use-approvals'

export default function ArticleReviewPage() {
  const params = useParams()
  const router = useRouter()
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)

  const postId = params.id as string

  // Use hooks from SPRINT X
  const { data: post, isLoading } = useArticle(postId)
  const approveMutation = useApproveArticle()
  const rejectMutation = useRejectArticle()

  const handleApprove = () => {
    approveMutation.mutate(
      { postId },
      {
        onSuccess: () => {
          router.push('/admin')
        },
      }
    )
  }

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      return
    }

    rejectMutation.mutate(
      { postId, rejectionReason },
      {
        onSuccess: () => {
          router.push('/admin')
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-3">Memuat artikel...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Artikel tidak ditemukan</p>
        <Link href="/admin">
          <Button className="mt-4">Kembali ke Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/admin">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </Link>
        <StatusBadge status={post.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Article Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{post.title}</CardTitle>
              {post.excerpt && (
                <p className="text-gray-600 mt-2">{post.excerpt}</p>
              )}
            </CardHeader>
            <CardContent>
              {post.cover_image && (
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Info Artikel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Penulis</p>
                  <p className="font-medium">{post.writer?.full_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Dibuat</p>
                  <p className="font-medium">{formatDate(post.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {post.status === 'pending' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Aksi Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!showRejectForm ? (
                  <>
                    <Button
                      className="w-full gap-2"
                      onClick={handleApprove}
                      disabled={approveMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4" />
                      {approveMutation.isPending ? 'Memproses...' : 'Setujui Artikel'}
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full gap-2"
                      onClick={() => setShowRejectForm(true)}
                    >
                      <XCircle className="h-4 w-4" />
                      Tolak Artikel
                    </Button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="reason">Alasan Penolakan *</Label>
                      <Textarea
                        id="reason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Jelaskan alasan penolakan..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleReject}
                      disabled={rejectMutation.isPending || !rejectionReason.trim()}
                    >
                      {rejectMutation.isPending ? 'Memproses...' : 'Konfirmasi Tolak'}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setShowRejectForm(false)
                        setRejectionReason('')
                      }}
                    >
                      Batal
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
