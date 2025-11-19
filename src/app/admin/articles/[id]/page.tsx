'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArticleForm } from '@/components/forms/article-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Mock data - replace with real API call
const mockArticle = {
  id: '1',
  title: 'Panduan Lengkap Next.js 14 untuk Developer',
  slug: 'panduan-lengkap-nextjs-14-untuk-developer',
  excerpt: 'Pelajari fitur-fitur terbaru Next.js 14 dan cara menggunakannya dalam project Anda.',
  content: '<p>Konten artikel lengkap di sini...</p>',
  coverImage: 'https://via.placeholder.com/800x400',
  status: 'published' as const,
  categories: ['1', '2'],
  tags: ['1', '2'],
  seo: {
    metaTitle: 'Panduan Lengkap Next.js 14',
    metaDescription: 'Pelajari fitur-fitur terbaru Next.js 14',
    focusKeyword: 'nextjs 14'
  }
}

interface EditArticlePageProps {
  params: {
    id: string
  }
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [article, setArticle] = useState(mockArticle)
  const router = useRouter()

  useEffect(() => {
    // In real app, fetch article by ID from API
    console.log('Loading article:', params.id)
  }, [params.id])

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      // Here you would update the article in your database
      console.log('Updated article data:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to articles list
      router.push('/admin/articles')
    } catch (error) {
      console.error('Error updating article:', error)
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
        <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
        <p className="text-gray-600 mt-2">
          Make changes to your article and update it.
        </p>
      </div>

      {/* Article Form */}
      <ArticleForm 
        initialData={article}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}