'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ImageUploader } from '@/components/ui/image-uploader'
import { TiptapEditor } from '@/components/editor/tiptap-editor'
import { slugify } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  coverImage: z.string().optional(),
  status: z.enum(['draft', 'in_review', 'published', 'archived']),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    focusKeyword: z.string().optional(),
  }),
})

type ArticleFormData = z.infer<typeof articleSchema>

const mockCategories = [
  { id: '1', name: 'Technology', slug: 'technology' },
  { id: '2', name: 'Programming', slug: 'programming' },
  { id: '3', name: 'Web Development', slug: 'web-development' },
  { id: '4', name: 'Mobile Development', slug: 'mobile-development' },
]

const mockTags = [
  { id: '1', name: 'React', slug: 'react' },
  { id: '2', name: 'Next.js', slug: 'nextjs' },
  { id: '3', name: 'TypeScript', slug: 'typescript' },
  { id: '4', name: 'JavaScript', slug: 'javascript' },
]

interface ArticleFormProps {
  initialData?: Partial<ArticleFormData>
  onSubmit: (data: ArticleFormData) => void
  isLoading?: boolean
}

export function ArticleForm({ initialData, onSubmit, isLoading }: ArticleFormProps) {
  const [content, setContent] = useState(initialData?.content || '')
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialData?.categories || [])
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || [])

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      excerpt: initialData?.excerpt || '',
      content: initialData?.content || '',
      coverImage: initialData?.coverImage || '',
      status: initialData?.status || 'draft',
      categories: initialData?.categories || [],
      tags: initialData?.tags || [],
      seo: {
        metaTitle: initialData?.seo?.metaTitle || '',
        metaDescription: initialData?.seo?.metaDescription || '',
        focusKeyword: initialData?.seo?.focusKeyword || '',
      },
    },
  })

  const handleTitleChange = (title: string) => {
    form.setValue('title', title)
    if (!initialData?.slug) {
      form.setValue('slug', slugify(title))
    }
  }

  const handleSubmit = (data: ArticleFormData) => {
    onSubmit({
      ...data,
      content,
      coverImage,
      categories: selectedCategories,
      tags: selectedTags,
    })
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Article Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <Input
                  {...form.register('title')}
                  placeholder="Enter article title"
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <Input
                  {...form.register('slug')}
                  placeholder="article-slug"
                />
                {form.formState.errors.slug && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.slug.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt *
                </label>
                <Textarea
                  {...form.register('excerpt')}
                  placeholder="Brief description of the article"
                  rows={3}
                />
                {form.formState.errors.excerpt && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.excerpt.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <TiptapEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Write your article content here..."
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <Input
                  {...form.register('seo.metaTitle')}
                  placeholder="SEO optimized title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <Textarea
                  {...form.register('seo.metaDescription')}
                  placeholder="SEO meta description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Focus Keyword
                </label>
                <Input
                  {...form.register('seo.focusKeyword')}
                  placeholder="Primary SEO keyword"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select
                  value={form.watch('status')}
                  onValueChange={(value: any) => form.setValue('status', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? 'Saving...' : 'Save Article'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cover Image */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                value={coverImage}
                onChange={setCoverImage}
                onRemove={() => setCoverImage('')}
                label="Upload Cover Image"
              />
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockCategories.map((category) => (
                  <label key={category.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, category.id])
                        } else {
                          setSelectedCategories(selectedCategories.filter(id => id !== category.id))
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockTags.map((tag) => (
                  <label key={tag.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTags([...selectedTags, tag.id])
                        } else {
                          setSelectedTags(selectedTags.filter(id => id !== tag.id))
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{tag.name}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}