"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { updateLifeAtInframeSection, addLifeAtInframeSection, getLifeAtInframeSections, type LifeAtInframeSection } from '../apis'

type WelcomeSection = {
  title: string;
  description: string;
  additionalText: string;
}

export default function WelcomeEditPage() {
  const [welcomeData, setWelcomeData] = useState<WelcomeSection>({
    title: 'Welcome to Campus Life',
    description: 'Our campus is more than just buildings and classrooms – it\'s a thriving ecosystem where ideas flourish, friendships form, and futures take shape.',
    additionalText: 'Whether you\'re pursuing academic excellence, exploring new interests through clubs and societies, or developing leadership skills, our campus provides the perfect environment for your growth and success.'
  })

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [welcomeSectionId, setWelcomeSectionId] = useState<string | null>(null)

  // Load existing welcome section on component mount
  React.useEffect(() => {
    const loadWelcomeSection = async () => {
      try {
        const sections = await getLifeAtInframeSections()
        const welcomeSection = sections.find((section: LifeAtInframeSection) => section.sectionType === 'welcome')

        if (welcomeSection) {
          setWelcomeSectionId(welcomeSection._id || null)
          setWelcomeData({
            title: welcomeSection.title,
            description: welcomeSection.description || '',
            additionalText: welcomeSection.content || ''
          })
        }
      } catch (error) {
        console.error('Error loading welcome section:', error)
        toast.error('Failed to load existing welcome section data')
      } finally {
        setInitialLoading(false)
      }
    }

    loadWelcomeSection()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!welcomeData.title.trim() || !welcomeData.description.trim()) {
      toast.error('Title and description are required')
      return
    }

    setLoading(true)
    try {
      const sectionData: LifeAtInframeSection = {
        sectionType: 'welcome',
        title: welcomeData.title,
        description: welcomeData.description,
        content: welcomeData.additionalText,
        order: 2,
        isActive: true
      }

      if (welcomeSectionId) {
        // Update existing section
        await updateLifeAtInframeSection(welcomeSectionId, sectionData)
        toast.success('Welcome section updated successfully')
      } else {
        // Create new section
        const newSection = await addLifeAtInframeSection(sectionData)
        setWelcomeSectionId(newSection._id || null)
        toast.success('Welcome section created successfully')
      }
    } catch (error) {
      console.error('Error saving welcome section:', error)
      // More specific error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`Failed to save welcome section: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Welcome Section</h1>
          <p className="text-gray-600">Manage the campus life introduction and welcome message</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/webdata/life-at-inframe">
              Back to Overview
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://www.inframeschool.com/lifeatinframe#welcome" target="_blank" rel="noopener noreferrer">
              View Live
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome Content</CardTitle>
            <CardDescription>Edit the welcome section content</CardDescription>
          </CardHeader>
          <CardContent>
            {initialLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Loading welcome section data...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Section Title *</Label>
                <Input
                  id="title"
                  value={welcomeData.title}
                  onChange={(e) => setWelcomeData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Welcome to Campus Life"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Main Description *</Label>
                <Textarea
                  id="description"
                  value={welcomeData.description}
                  onChange={(e) => setWelcomeData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Our campus is more than just buildings..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalText">Additional Text</Label>
                <Textarea
                  id="additionalText"
                  value={welcomeData.additionalText}
                  onChange={(e) => setWelcomeData(prev => ({ ...prev, additionalText: e.target.value }))}
                  placeholder="Whether you're pursuing academic excellence..."
                  rows={4}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading
                  ? (welcomeSectionId ? 'Updating...' : 'Creating...')
                  : (welcomeSectionId ? 'Update Welcome Section' : 'Create Welcome Section')
                }
              </Button>
            </form>
            )}
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>See how your changes will look on the website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900">{welcomeData.title}</h2>
              <p className="text-gray-700 leading-relaxed">{welcomeData.description}</p>
              {welcomeData.additionalText && (
                <p className="text-gray-600 leading-relaxed">{welcomeData.additionalText}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Guidelines */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Content Guidelines</CardTitle>
          <CardDescription>Best practices for the welcome section</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Title Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Keep it concise and welcoming</li>
                <li>• Use action-oriented language</li>
                <li>• Maximum 50 characters recommended</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Description Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Focus on the campus experience</li>
                <li>• Highlight community and growth</li>
                <li>• Keep it engaging and inspiring</li>
                <li>• Maximum 200 words recommended</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

