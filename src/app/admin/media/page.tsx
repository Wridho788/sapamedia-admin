'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ImageIcon } from 'lucide-react'

export default function MediaPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
        <p className="text-gray-600 mt-2">
          Manage your media files and images
        </p>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardContent className="p-12 text-center">
          <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Media Library Coming Soon</h3>
          <p className="text-gray-600">
            This feature is under development and will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
