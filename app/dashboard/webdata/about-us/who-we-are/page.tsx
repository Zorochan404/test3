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

type WhoWeAreSection = {
  title: string;
  content: string;
  imageUrl: string;
}

export default function WhoWeAreEditPage() {
  const [whoWeAreData, setWhoWeAreData] = useState<WhoWeAreSection>({
    title: 'WHO WE ARE?',
    content: 'Inframe is an innovative platform that blends creativity with business, offering a dynamic space where art and design professionals come together to shape the future. With a vibrant and inclusive community, Inframe empowers creators to transform their passion into a successful career while fostering a collaborative environment where ideas thrive.',
    imageUrl: ''
  })

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [contentId, setContentId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadWhoWeAreContent()
  }, [])

  const loadWhoWeAreContent = async () => {
    try {
      setInitialLoading(true)
      const content = await getContentByType('who-we-are')
      if (content) {
        setWhoWeAreData({
          title: content.title,
          content: content.content,
          imageUrl: content.imageUrl || ''
        })
        setContentId(content._id || null)
      }
    } catch (error) {
      console.error('Error loading who we are content:', error)
      toast.error('Failed to load content. Using default values.')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleInputChange = (field: keyof WhoWeAreSection, value: string) => {
    setWhoWeAreData(prev => ({
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
    
    if (!whoWeAreData.title.trim()) {
      toast.error('Title is required')
      return
    }

    if (!whoWeAreData.content.trim()) {
      toast.error('Content is required')
      return
    }

    try {
      setLoading(true)

      const contentData: Omit<AboutUsContent, '_id'> = {
        sectionType: 'who-we-are',
        title: whoWeAreData.title.trim(),
        content: whoWeAreData.content.trim(),
        imageUrl: whoWeAreData.imageUrl,
        order: 1,
        isActive: true
      }

      console.log('Who We Are Form Data:', contentData)

      await addOrUpdateContent(contentData)
      toast.success('Who We Are section updated successfully!')
      
      // Reload the content to get the latest data
      await loadWhoWeAreContent()
    } catch (error: unknown) {
      console.error('Error updating who we are section:', error)
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
          <h1 className="text-2xl font-bold">Edit Who We Are Section</h1>
          <p className="text-gray-600">Update the main introduction content</p>
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
            <CardTitle>Who We Are Content</CardTitle>
            <CardDescription>Edit the main introduction section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Section Title *</Label>
              <Input
                id="title"
                value={whoWeAreData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="WHO WE ARE?"
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={whoWeAreData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Enter the who we are content..."
                rows={6}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {whoWeAreData.content.length} characters
              </p>
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
          <CardDescription>Best practices for the Who We Are section</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Title Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Keep it clear and engaging</li>
                <li>• Use question format for engagement</li>
                <li>• Maximum 20 characters recommended</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Content Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Focus on the institution's mission</li>
                <li>• Highlight unique value propositions</li>
                <li>• Keep it concise but informative</li>
                <li>• Use inspiring and professional tone</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
