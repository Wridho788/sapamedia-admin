'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArticleForm } from '@/components/forms/article-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewArticlePage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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