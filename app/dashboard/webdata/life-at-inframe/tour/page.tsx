"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

type CampusTour = {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  features: string[];
}

export default function CampusTourPage() {
  const [tourData, setTourData] = useState<CampusTour>({
    title: 'Inframe Campus Tour',
    description: 'Our virtual tour will take you around our 200-acre state-of-the-art residential campus, which features cutting-edge infrastructure, international sports facilities, and more.',
    ctaText: 'Take our virtual tour',
    ctaLink: '#',
    features: [
      '200-acre residential campus',
      'State-of-the-art infrastructure',
      'International sports facilities',
      'Modern academic buildings',
      'Student accommodation',
      'Recreation centers'
    ]
  })
  
  const [newFeature, setNewFeature] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!tourData.title.trim() || !tourData.description.trim()) {
      toast.error('Title and description are required')
      return
    }

    setLoading(true)
    try {
      // Here you would call your API to update the campus tour section
      // await updateLifeAtInframeSection('tour', tourData)
      toast.success('Campus tour section updated successfully')
    } catch (error) {
      console.error('Error updating campus tour section:', error)
      toast.error('Failed to update campus tour section')
    } finally {
      setLoading(false)
    }
  }

  const handleAddFeature = () => {
    if (!newFeature.trim()) {
      toast.error('Feature text is required')
      return
    }

    setTourData(prev => ({
      ...prev,
      features: [...prev.features, newFeature.trim()]
    }))
    setNewFeature('')
    toast.success('Feature added successfully')
  }

  const handleRemoveFeature = (index: number) => {
    setTourData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
    toast.success('Feature removed successfully')
  }

  const handleUpdateFeature = (index: number, value: string) => {
    setTourData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }))
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Campus Tour Section</h1>
          <p className="text-gray-600">Manage virtual tour content and links</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/webdata/life-at-inframe">
              Back to Overview
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://www.inframeschool.com/lifeatinframe#tour" target="_blank" rel="noopener noreferrer">
              View Live
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>Campus Tour Content</CardTitle>
            <CardDescription>Edit the campus tour section content</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Section Title *</Label>
                <Input
                  id="title"
                  value={tourData.title}
                  onChange={(e) => setTourData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Inframe Campus Tour"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={tourData.description}
                  onChange={(e) => setTourData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Our virtual tour will take you around..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctaText">Call to Action Text</Label>
                <Input
                  id="ctaText"
                  value={tourData.ctaText}
                  onChange={(e) => setTourData(prev => ({ ...prev, ctaText: e.target.value }))}
                  placeholder="Take our virtual tour"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctaLink">Call to Action Link</Label>
                <Input
                  id="ctaLink"
                  value={tourData.ctaLink}
                  onChange={(e) => setTourData(prev => ({ ...prev, ctaLink: e.target.value }))}
                  placeholder="https://virtualtour.inframeschool.com"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Updating...' : 'Update Campus Tour'}
              </Button>
            </form>
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
              <h2 className="text-2xl font-bold text-gray-900">{tourData.title}</h2>
              <p className="text-gray-700 leading-relaxed">{tourData.description}</p>
              {tourData.features.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Campus Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {tourData.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              {tourData.ctaText && (
                <Button className="mt-4">
                  {tourData.ctaText}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campus Features Management */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Campus Features</CardTitle>
          <CardDescription>Manage the list of campus features highlighted in the tour section</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Existing Features */}
            <div className="space-y-2">
              <Label>Current Features</Label>
              {tourData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={feature}
                    onChange={(e) => handleUpdateFeature(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveFeature(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            {/* Add New Feature */}
            <div className="border-t pt-4">
              <Label htmlFor="newFeature">Add New Feature</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="newFeature"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Modern library facilities"
                  className="flex-1"
                />
                <Button onClick={handleAddFeature}>
                  Add Feature
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Guidelines */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Content Guidelines</CardTitle>
          <CardDescription>Best practices for the campus tour section</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Title Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Keep it clear and descriptive</li>
                <li>• Include &quot;Campus Tour&quot; for clarity</li>
                <li>• Maximum 60 characters recommended</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Description Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Highlight key campus features</li>
                <li>• Mention campus size and facilities</li>
                <li>• Keep it engaging and informative</li>
                <li>• Maximum 150 words recommended</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Features Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• List unique campus highlights</li>
                <li>• Keep each feature concise</li>
                <li>• Focus on infrastructure and facilities</li>
                <li>• Maximum 8 features recommended</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">CTA Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use action-oriented text</li>
                <li>• Ensure the link works properly</li>
                <li>• Test virtual tour functionality</li>
                <li>• Consider mobile compatibility</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
