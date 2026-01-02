'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArticleForm } from '@/components/forms/article-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useAuth, usePermissions } from '@/hooks/use-auth'

export default function NewArticlePage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { hasRole } = usePermissions()
  const { authUser } = useAuth()

  // Redirect if not writer or admin
  useEffect(() => {
    if (authUser && !hasRole(['writer', 'super_admin'])) {
      router.replace('/admin')
    }
  }, [authUser, hasRole, router])

  // Don't render if not authorized
  if (!authUser || !hasRole(['writer', 'super_admin'])) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      // Here you would save to your database
      console.log('Article data:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to articles list
      router.push('/admin/articles')
    } catch (error) {
      console.error('Error saving article:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link 
          href="/admin/articles"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Articles
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Article</h1>
        <p className="text-gray-600 mt-2">
          Create and publish a new article for your readers.
        </p>
      </div>

      {/* Article Form */}
      <ArticleForm 
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}