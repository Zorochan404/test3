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

type AboutUsContentSection = {
  title: string;
  content: string;
  imageUrl: string;
}

export default function AboutUsContentEditPage() {
  const [aboutUsData, setAboutUsData] = useState<AboutUsContentSection>({
    title: 'About Us',
    content: 'Inframe school of art, design & business is established by the Inframe Educational Society under Rajasthan Societies Act 1958. Inframe school of art, design and business will be one of a kind design institute in Jodhpur which will commence it\'s curriculum with the aim to expand the design and business field in Jodhpur and it\'s surrounding regions by being the first design and business school of Jodhpur to offer degree, diploma and professional courses in various fields of interior design, graphic design, fine arts and digital marketing.\n\nTo pursue a design course the candidate need it have to qualify in specific subject .The candidate from any educational background can pursue or take admission to a design course and fulfill their dreams of becoming designer with inframe design school .In school will not only help the students to learn more effectively and have a great future.',
    imageUrl: ''
  })

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [contentId, setContentId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadAboutUsContent()
  }, [])

  const loadAboutUsContent = async () => {
    try {
      setInitialLoading(true)
      const content = await getContentByType('about-us')
      if (content) {
        setAboutUsData({
          title: content.title,
          content: content.content,
          imageUrl: content.imageUrl || ''
        })
        setContentId(content._id || null)
      }
    } catch (error) {
      console.error('Error loading about us content:', error)
      toast.error('Failed to load content. Using default values.')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleInputChange = (field: keyof AboutUsContentSection, value: string) => {
    setAboutUsData(prev => ({
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
    
    if (!aboutUsData.title.trim()) {
      toast.error('Title is required')
      return
    }

    if (!aboutUsData.content.trim()) {
      toast.error('Content is required')
      return
    }

    try {
      setLoading(true)

      const contentData: Omit<AboutUsContent, '_id'> = {
        sectionType: 'about-us',
        title: aboutUsData.title.trim(),
        content: aboutUsData.content.trim(),
        imageUrl: aboutUsData.imageUrl,
        order: 2,
        isActive: true
      }

      console.log('About Us Content Form Data:', contentData)

      await addOrUpdateContent(contentData)
      toast.success('About Us content updated successfully!')
      
      // Reload the content to get the latest data
      await loadAboutUsContent()
    } catch (error: unknown) {
      console.error('Error updating about us content:', error)
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
          <h1 className="text-2xl font-bold">Edit About Us Content</h1>
          <p className="text-gray-600">Update the detailed About Us section</p>
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
            <CardTitle>About Us Content</CardTitle>
            <CardDescription>Edit the detailed About Us section content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Section Title *</Label>
              <Input
                id="title"
                value={aboutUsData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="About Us"
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={aboutUsData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Enter the detailed about us content..."
                rows={10}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {aboutUsData.content.length} characters
              </p>
            </div>

            <div>
              <Label htmlFor="imageUrl">Section Image (Optional)</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    value={aboutUsData.imageUrl}
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
                {aboutUsData.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={aboutUsData.imageUrl}
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
          <CardDescription>Best practices for the About Us content section</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Content Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Provide detailed institutional information</li>
                <li>• Include establishment details and legal status</li>
                <li>• Mention course offerings and specializations</li>
                <li>• Highlight accessibility and inclusivity</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Writing Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use clear, professional language</li>
                <li>• Break content into paragraphs</li>
                <li>• Include specific details and facts</li>
                <li>• Maintain consistent tone throughout</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
