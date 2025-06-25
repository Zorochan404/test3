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
import { getContentByType, addOrUpdateContent, createContentSection, updateContentSection, type AboutUsContent } from '../apis'

type CoreValuesTextSection = {
  title: string;
  content: string;
  imageUrl: string;
}

export default function CoreValuesTextEditPage() {
  const [coreValuesTextData, setCoreValuesTextData] = useState<CoreValuesTextSection>({
    title: 'CORE VALUES',
    content: 'Inframe school of art, design and business inculcates design thinking in students which enables them to think from a different perspective and understand the needs and wants of the user. Our institute has developed a curriculum which not only focuses on the theoretical knowledge but also focuses on the practical learning and innovation. The school organises various workshops and internship opportunities for the students with the help of industry experts and glorified designers. With the main aim of "developing sustainable design for the people of tomorrow" our institute leads the students in the direction to the future of design and business. ICADB helps the students in learning design and business with the help of various practical projects so that students can actually understand how are such projects done in the real world and how to work in a team.',
    imageUrl: ''
  })

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [contentId, setContentId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadCoreValuesTextContent()
  }, [])

  const loadCoreValuesTextContent = async () => {
    try {
      setInitialLoading(true)
      const content = await getContentByType('core-values-text')
      if (content) {
        setCoreValuesTextData({
          title: content.title,
          content: content.content,
          imageUrl: content.imageUrl || ''
        })
        setContentId(content._id || null)
      }
    } catch (error) {
      console.error('Error loading core values text content:', error)
      toast.error('Failed to load content. Using default values.')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleInputChange = (field: keyof CoreValuesTextSection, value: string) => {
    setCoreValuesTextData(prev => ({
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
    
    if (!coreValuesTextData.title.trim()) {
      toast.error('Title is required')
      return
    }

    if (!coreValuesTextData.content.trim()) {
      toast.error('Content is required')
      return
    }

    try {
      setLoading(true)

      const contentData: Omit<AboutUsContent, '_id'> = {
        sectionType: 'core-values-text',
        title: coreValuesTextData.title.trim(),
        content: coreValuesTextData.content.trim(),
        imageUrl: coreValuesTextData.imageUrl,
        order: 8,
        isActive: true
      }

      console.log('Core Values Text Form Data:', contentData)

      if (contentId) {
        await updateContentSection(contentId, contentData)
      } else {
        await createContentSection(contentData)
      }
      toast.success('Core Values text section updated successfully!')
      
      // Reload the content to get the latest data
      await loadCoreValuesTextContent()
    } catch (error: unknown) {
      console.error('Error updating core values text section:', error)
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
          <h1 className="text-2xl font-bold">Edit Core Values Text Section</h1>
          <p className="text-gray-600">Update the bottom Core Values text content</p>
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
            <CardTitle>Core Values Text Content</CardTitle>
            <CardDescription>Edit the bottom Core Values text section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Section Title *</Label>
              <Input
                id="title"
                value={coreValuesTextData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="CORE VALUES"
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Core Values Text Content *</Label>
              <Textarea
                id="content"
                value={coreValuesTextData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Enter the core values text content..."
                rows={8}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {coreValuesTextData.content.length} characters
              </p>
            </div>

            <div>
              <Label htmlFor="imageUrl">Section Image (Optional)</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    value={coreValuesTextData.imageUrl}
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
                {coreValuesTextData.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={coreValuesTextData.imageUrl}
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
          <CardDescription>Best practices for the Core Values text section</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Content Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Focus on educational philosophy and approach</li>
                <li>• Highlight design thinking and practical learning</li>
                <li>• Mention industry partnerships and workshops</li>
                <li>• Include specific goals and outcomes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Writing Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use clear, professional language</li>
                <li>• Include specific examples and methods</li>
                <li>• Emphasize student benefits and preparation</li>
                <li>• Maintain consistent institutional voice</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
