"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { uploadToCloudinary } from '@/utils/cloudinary'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { getContentByType, addOrUpdateContent, type AboutUsContent } from '../apis'

type VisionSection = {
  title: string;
  content: string;
  imageUrl: string;
}

export default function VisionEditPage() {
  const [visionData, setVisionData] = useState<VisionSection>({
    title: 'VISION',
    content: 'Inframe school of art, design and business aspires to be a nationally and internationally recognized institution for education in various fields of design, art and business. We want the students of our city/state to flourish in their life and at the same time help the design industry grow in this region. Our learning will consist of some basic theoretical knowledge about, developing a creative thinking and then turning towards the practical aspects which would be taken care of by our industry partners and hand on leadership opportunities delivered by our distinguished and experienced faculties. Our learning will not only be limited to the curriculum but we will also be preparing the students to perform well in real life conditions and excel in their career ahead of them.',
    imageUrl: ''
  })

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [contentId, setContentId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadVisionContent()
  }, [])

  const loadVisionContent = async () => {
    try {
      setInitialLoading(true)
      const content = await getContentByType('vision')
      if (content) {
        setVisionData({
          title: content.title,
          content: content.content,
          imageUrl: content.imageUrl || ''
        })
        setContentId(content._id || null)
      }
    } catch (error) {
      console.error('Error loading vision content:', error)
      toast.error('Failed to load content. Using default values.')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleInputChange = (field: keyof VisionSection, value: string) => {
    setVisionData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const imageUrl = await uploadToCloudinary(file)
      handleInputChange('imageUrl', imageUrl)
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!visionData.title.trim()) {
      toast.error('Title is required')
      return
    }

    if (!visionData.content.trim()) {
      toast.error('Content is required')
      return
    }

    try {
      setLoading(true)

      const contentData: Omit<AboutUsContent, '_id'> = {
        sectionType: 'vision',
        title: visionData.title.trim(),
        content: visionData.content.trim(),
        imageUrl: visionData.imageUrl,
        order: 4,
        isActive: true
      }

      console.log('Vision Form Data:', contentData)

      await addOrUpdateContent(contentData)
      toast.success('Vision section updated successfully!')
      
      // Reload the content to get the latest data
      await loadVisionContent()
    } catch (error: unknown) {
      console.error('Error updating vision section:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update content')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading content...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Vision Section</h1>
          <p className="text-gray-600">Update the Vision statement and content</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/webdata/about-us">
              Back to About Us
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://www.inframeschool.com/about-us" target="_blank" rel="noopener noreferrer">
              View Live
            </a>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Vision Content</CardTitle>
            <CardDescription>Edit the Vision section content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Section Title *</Label>
              <Input
                id="title"
                value={visionData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="VISION"
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Vision Statement *</Label>
              <Textarea
                id="content"
                value={visionData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Enter the vision statement..."
                rows={8}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {visionData.content.length} characters
              </p>
            </div>

            <div>
              <Label htmlFor="imageUrl">Section Image (Optional)</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    value={visionData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg or upload below"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {uploading && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    Uploading image to Cloudinary...
                  </div>
                )}
                {visionData.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={visionData.imageUrl}
                      alt="Section image preview"
                      className="w-full max-w-md h-48 object-cover rounded border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-image.svg';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/webdata/about-us">
              Cancel
            </Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>

      {/* Content Guidelines */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Content Guidelines</CardTitle>
          <CardDescription>Best practices for the Vision section</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Vision Statement Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Focus on future aspirations and goals</li>
                <li>• Include national and international recognition</li>
                <li>• Mention student success and industry growth</li>
                <li>• Highlight unique educational approach</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Writing Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use inspiring and forward-looking language</li>
                <li>• Be specific about educational goals</li>
                <li>• Include practical learning aspects</li>
                <li>• Emphasize real-world preparation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
