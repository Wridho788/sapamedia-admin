'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Plus, 
  Search, 
  Edit,
  Trash2,
  FolderOpen,
  Calendar,
  Hash
} from 'lucide-react'
import { formatDateTime, slugify } from '@/lib/utils'

// Mock data
const mockCategories = [
  {
    id: '1',
    name: 'Technology',
    slug: 'technology',
    description: 'Articles about technology trends and innovations',
    color: '#3B82F6',
    articleCount: 15,
    createdAt: '2024-01-10T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z'
  },
  {
    id: '2',
    name: 'Programming',
    slug: 'programming',
    description: 'Programming tutorials and best practices',
    color: '#10B981',
    articleCount: 23,
    createdAt: '2024-01-08T09:15:00Z',
    updatedAt: '2024-01-14T11:45:00Z'
  },
  {
    id: '3',
    name: 'Web Development',
    slug: 'web-development',
    description: 'Frontend and backend web development topics',
    color: '#F59E0B',
    articleCount: 18,
    createdAt: '2024-01-05T16:20:00Z',
    updatedAt: '2024-01-12T08:30:00Z'
  },
  {
    id: '4',
    name: 'Mobile Development',
    slug: 'mobile-development',
    description: 'iOS and Android development guides',
    color: '#EF4444',
    articleCount: 7,
    createdAt: '2024-01-03T14:45:00Z',
    updatedAt: '2024-01-10T12:15:00Z'
  }
]

interface CategoryFormData {
  name: string
  slug: string
  description: string
  color: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState(mockCategories)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    color: '#3B82F6'
  })

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: editingCategory ? prev.slug : slugify(name)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingCategory) {
      // Update existing category
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData, updatedAt: new Date().toISOString() }
          : cat
      ))
    } else {
      // Create new category
      const newCategory = {
        id: Date.now().toString(),
        ...formData,
        articleCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setCategories(prev => [...prev, newCategory])
    }

    // Reset form
    setFormData({ name: '', slug: '', description: '', color: '#3B82F6' })
    setEditingCategory(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId))
    }
  }

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', color: '#3B82F6' })
    setEditingCategory(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">
            Organize your content with categories.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Category name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="category-slug"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Category description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-10 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">/{category.slug}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>

              {category.description && (
                <p className="text-gray-600 text-sm mb-4">{category.description}</p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Hash className="h-3 w-3 mr-1" />
                    {category.articleCount} articles
                  </span>
                </div>
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(category.updatedAt).toLocaleDateString('id-ID')}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'Try adjusting your search query.'
                : 'Get started by creating your first category.'
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Create Category
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}