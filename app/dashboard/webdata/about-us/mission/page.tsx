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

type MissionSection = {
  title: string;
  content: string;
  imageUrl: string;
}

export default function MissionEditPage() {
  const [missionData, setMissionData] = useState<MissionSection>({
    title: 'MISSION',
    content: 'Inframe school of art, design and business believes in innovative and effective way of learning rather than just sticking to the curriculum. We want to prepare our students to get into the industry of their choice and outperform everyone else with the perk of having learned every aspect of the industry. The main mission of our school is to prepare the students in becoming the designers, artists and entrepreneurs of tomorrow so that they can take on the world by storm and mark their presence in the world. Our school is collaborating with the various industries and leading designers of Jodhpur to conduct workshops, have work experience, real world problem solving and have various business opportunities which will help the students in developing design thinking with relation to the market requirements and desires.\n\nTo pursue a design course the candidate need it have to qualify in specific subject .The candidate from any educational background can pursue or take admission to a design course and fulfill their dreams of becoming designer with inframe design school .In school will not only help the students to learn more effectively and have a great future.',
    imageUrl: ''
  })

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [contentId, setContentId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadMissionContent()
  }, [])

  const loadMissionContent = async () => {
    try {
      setInitialLoading(true)
      const content = await getContentByType('mission')
      if (content) {
        setMissionData({
          title: content.title,
          content: content.content,
          imageUrl: content.imageUrl || ''
        })
        setContentId(content._id || null)
      }
    } catch (error) {
      console.error('Error loading mission content:', error)
      toast.error('Failed to load content. Using default values.')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleInputChange = (field: keyof MissionSection, value: string) => {
    setMissionData(prev => ({
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
    
    if (!missionData.title.trim()) {
      toast.error('Title is required')
      return
    }

    if (!missionData.content.trim()) {
      toast.error('Content is required')
      return
    }

    try {
      setLoading(true)

      const contentData: Omit<AboutUsContent, '_id'> = {
        sectionType: 'mission',
        title: missionData.title.trim(),
        content: missionData.content.trim(),
        imageUrl: missionData.imageUrl,
        order: 6,
        isActive: true
      }

      console.log('Mission Form Data:', contentData)

      if (contentId) {
        await updateContentSection(contentId, contentData)
      } else {
        await createContentSection(contentData)
      }
      toast.success('Mission section updated successfully!')
      
      // Reload the content to get the latest data
      await loadMissionContent()
    } catch (error: unknown) {
      console.error('Error updating mission section:', error)
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
          <h1 className="text-2xl font-bold">Edit Mission Section</h1>
          <p className="text-gray-600">Update the Mission statement and content</p>
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
            <CardTitle>Mission Content</CardTitle>
            <CardDescription>Edit the Mission section content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Section Title *</Label>
              <Input
                id="title"
                value={missionData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="MISSION"
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Mission Statement *</Label>
              <Textarea
                id="content"
                value={missionData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Enter the mission statement..."
                rows={10}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {missionData.content.length} characters
              </p>
            </div>

            <div>
              <Label htmlFor="imageUrl">Section Image (Optional)</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    value={missionData.imageUrl}
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
                {missionData.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={missionData.imageUrl}
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
          <CardDescription>Best practices for the Mission section</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Mission Statement Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Focus on current actions and methods</li>
                <li>• Highlight innovative learning approaches</li>
                <li>• Mention industry collaboration and partnerships</li>
                <li>• Include practical learning and real-world experience</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Writing Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use action-oriented language</li>
                <li>• Be specific about educational methods</li>
                <li>• Include student preparation and outcomes</li>
                <li>• Emphasize industry readiness</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
