'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  onRemove: () => void
  label?: string
  className?: string
}

export function ImageUploader({ 
  value, 
  onChange, 
  onRemove,
  label = "Upload Image",
  className 
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Create a temporary URL for preview (in real app, you'd upload to Cloudinary)
    const previewUrl = URL.createObjectURL(file)
    onChange(previewUrl)

    // Simulate upload process
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      // In real implementation, you would upload to Cloudinary here
      // and get back the actual URL
    }, 2000)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  if (value) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="relative">
            <img 
              src={value} 
              alt="Uploaded" 
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="bg-white px-3 py-2 rounded-lg">
                  <p className="text-sm">Uploading...</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onClick={handleClick}
        >
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{label}</h3>
          <p className="text-gray-500 mb-4">
            Drag and drop your image here, or click to browse
          </p>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
          <p className="text-xs text-gray-400 mt-2">
            PNG, JPG, GIF up to 5MB
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              handleFileSelect(file)
            }
          }}
        />
      </CardContent>
    </Card>
  )
}