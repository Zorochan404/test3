"use client"

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { uploadToCloudinary } from '@/utils/cloudinary'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { addLifeAtInframeSection, updateLifeAtInframeSection, getLifeAtInframeSections, type LifeAtInframeSection } from '../apis'

type HeroSection = {
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  ctaText: string;
  ctaLink: string;
}

export default function HeroEditPage() {
  const [heroData, setHeroData] = useState<HeroSection>({
    title: 'LIFE @ INFRAME',
    subtitle: 'Discover a vibrant community where learning, innovation, and personal growth intersect',
    description: 'Our campus is more than just buildings and classrooms – it\'s a thriving ecosystem where ideas flourish, friendships form, and futures take shape.',
    heroImage: '',
    ctaText: 'Explore Campus Life',
    ctaLink: '#welcome'
  })

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [heroSectionId, setHeroSectionId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load existing hero section on component mount
  React.useEffect(() => {
    const loadHeroSection = async () => {
      try {
        const sections = await getLifeAtInframeSections()
        const heroSection = sections.find((section: LifeAtInframeSection) => section.sectionType === 'hero')

        if (heroSection) {
          setHeroSectionId(heroSection._id || null)
          setHeroData({
            title: heroSection.title,
            subtitle: heroSection.description || '',
            description: heroSection.content || '',
            heroImage: heroSection.images?.[0] || '',
            ctaText: 'Explore Campus Life',
            ctaLink: '#welcome'
          })
        }
      } catch (error) {
        console.error('Error loading hero section:', error)
      }
    }

    loadHeroSection()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const imageUrl = await uploadToCloudinary(file)
      setHeroData(prev => ({ ...prev, heroImage: imageUrl }))
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!heroData.title.trim() || !heroData.subtitle.trim()) {
      toast.error('Title and subtitle are required')
      return
    }

    setLoading(true)
    try {
      const sectionData: LifeAtInframeSection = {
        sectionType: 'hero',
        title: heroData.title,
        description: heroData.subtitle,
        content: heroData.description,
        images: heroData.heroImage ? [heroData.heroImage] : [],
        order: 1,
        isActive: true
      }

      if (heroSectionId) {
        // Update existing section
        await updateLifeAtInframeSection(heroSectionId, sectionData)
        toast.success('Hero section updated successfully')
      } else {
        // Create new section
        const newSection = await addLifeAtInframeSection(sectionData)
        setHeroSectionId(newSection._id || null)
        toast.success('Hero section created successfully')
      }
    } catch (error) {
      console.error('Error saving hero section:', error)
      toast.error('Failed to save hero section')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Hero Section</h1>
          <p className="text-gray-600">Manage the main banner and introduction for Life at Inframe</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/webdata/life-at-inframe">
              Back to Overview
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://www.inframeschool.com/lifeatinframe" target="_blank" rel="noopener noreferrer">
              View Live
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Content</CardTitle>
            <CardDescription>Edit the main hero section content</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Main Title *</Label>
                <Input
                  id="title"
                  value={heroData.title}
                  onChange={(e) => setHeroData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="LIFE @ INFRAME"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle *</Label>
                <Textarea
                  id="subtitle"
                  value={heroData.subtitle}
                  onChange={(e) => setHeroData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Discover a vibrant community..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={heroData.description}
                  onChange={(e) => setHeroData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Our campus is more than just buildings..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctaText">Call to Action Text</Label>
                <Input
                  id="ctaText"
                  value={heroData.ctaText}
                  onChange={(e) => setHeroData(prev => ({ ...prev, ctaText: e.target.value }))}
                  placeholder="Explore Campus Life"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctaLink">Call to Action Link</Label>
                <Input
                  id="ctaLink"
                  value={heroData.ctaLink}
                  onChange={(e) => setHeroData(prev => ({ ...prev, ctaLink: e.target.value }))}
                  placeholder="#welcome"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Updating...' : 'Update Hero Section'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Image Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Image</CardTitle>
            <CardDescription>Upload or change the main hero background image</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroImage">Hero Background Image</Label>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-gray-500">Uploading image...</p>}
            </div>

            {heroData.heroImage && (
              <div className="space-y-2">
                <Label>Current Image Preview</Label>
                <div className="border rounded-lg overflow-hidden">
                  <img 
                    src={heroData.heroImage} 
                    alt="Hero preview" 
                    className="w-full h-48 object-cover"
                  />
                </div>
                <Input
                  value={heroData.heroImage}
                  onChange={(e) => setHeroData(prev => ({ ...prev, heroImage: e.target.value }))}
                  placeholder="Image URL"
                />
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Image Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Recommended size: 1920x1080px or larger</li>
                <li>• Format: JPG, PNG, or WebP</li>
                <li>• Max file size: 5MB</li>
                <li>• High-quality campus or student life images work best</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
          <CardDescription>See how your changes will look on the website</CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="relative bg-cover bg-center rounded-lg p-8 text-white min-h-[300px] flex items-center"
            style={{ 
              backgroundImage: heroData.heroImage ? `url(${heroData.heroImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundBlendMode: 'overlay',
              backgroundColor: 'rgba(0,0,0,0.4)'
            }}
          >
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold mb-4">{heroData.title}</h1>
              <p className="text-xl mb-4">{heroData.subtitle}</p>
              {heroData.description && (
                <p className="text-lg mb-6 opacity-90">{heroData.description}</p>
              )}
              {heroData.ctaText && (
                <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                  {heroData.ctaText}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
