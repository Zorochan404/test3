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
import {
  getSportsFacilities,
  addSportsFacility,
  updateSportsFacility,
  deleteSportsFacility,
  addLifeAtInframeSection,
  updateLifeAtInframeSection,
  getLifeAtInframeSections,
  type SportsFacility as APISportsFacility,
  type LifeAtInframeSection
} from '../apis'

type SportsArena = {
  title: string;
  description: string;
  readMoreLink: string;
  facilities: SportsFacility[];
}

type SportsFacility = {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export default function SportsArenaPage() {
  const [sportsData, setSportsData] = useState<SportsArena>({
    title: 'Sports Arena',
    description: 'Whilst conquering new levels in our academics, we find it essential to strike a balance with sports too, for it is true that a fit mind and a fit body go together. The International Sports Arena – The League has been established with an Olympic vision to rouse the champion in students, covering a wide array of sporting facilities.',
    readMoreLink: '#',
    facilities: []
  })

  const [sportsSectionId, setSportsSectionId] = useState<string | null>(null)
  
  const [newFacility, setNewFacility] = useState<SportsFacility>({
    id: '',
    name: '',
    image: '',
    description: ''
  })
  
  const [editingFacility, setEditingFacility] = useState<SportsFacility | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load data from backend on component mount
  React.useEffect(() => {
    const loadData = async () => {
      try {
        // Load sports section data
        const sections = await getLifeAtInframeSections()
        const sportsSection = (sections as LifeAtInframeSection[]).find((section: LifeAtInframeSection) => section.sectionType === 'sports')

        if (sportsSection) {
          setSportsSectionId(sportsSection._id || null)
          setSportsData(prev => ({
            ...prev,
            title: sportsSection.title,
            description: sportsSection.description || prev.description,
          }))
        }

        // Load sports facilities
        const facilities = await getSportsFacilities()
        const formattedFacilities = (facilities as APISportsFacility[]).map((facility: APISportsFacility) => ({
          id: facility._id || '',
          name: facility.name,
          image: facility.image,
          description: facility.description || ''
        }))

        setSportsData(prev => ({
          ...prev,
          facilities: formattedFacilities
        }))
      } catch (error) {
        console.error('Error loading sports data:', error)
        toast.error('Failed to load sports data')
      }
    }

    loadData()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const imageUrl = await uploadToCloudinary(file)
      if (isEditing && editingFacility) {
        setEditingFacility(prev => prev ? { ...prev, image: imageUrl } : null)
      } else {
        setNewFacility(prev => ({ ...prev, image: imageUrl }))
      }
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Error uploading image:', error)
      if (error instanceof Error) {
        if (error.message.includes('File must be an image')) {
          toast.error('Please select an image file')
        } else if (error.message.includes('File size must be less than 5MB')) {
          toast.error('Image size must be less than 5MB')
        } else if (error.message.includes('Missing Cloudinary configuration')) {
          toast.error('Server configuration error. Please contact support.')
        } else {
          toast.error('Failed to upload image. Please try again.')
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!sportsData.title.trim() || !sportsData.description.trim()) {
      toast.error('Title and description are required')
      return
    }

    setLoading(true)
    try {
      const sectionData: LifeAtInframeSection = {
        sectionType: 'sports',
        title: sportsData.title,
        description: sportsData.description,
        content: sportsData.readMoreLink,
        images: [],
        order: 3,
        isActive: true
      }

      if (sportsSectionId) {
        // Update existing section
        await updateLifeAtInframeSection(sportsSectionId, sectionData)
        toast.success('Sports arena section updated successfully')
      } else {
        // Create new section
        const newSection = await addLifeAtInframeSection(sectionData)
        setSportsSectionId((newSection as LifeAtInframeSection)._id || null)
        toast.success('Sports arena section created successfully')
      }
    } catch (error) {
      console.error('Error saving sports section:', error)
      toast.error('Failed to save sports section')
    } finally {
      setLoading(false)
    }
  }

  const handleAddFacility = async () => {
    if (!newFacility.name.trim() || !newFacility.image.trim()) {
      toast.error('Facility name and image are required')
      return
    }

    setLoading(true)
    try {
      const facilityData: APISportsFacility = {
        name: newFacility.name,
        description: newFacility.description,
        image: newFacility.image,
        category: 'general'
      }

      const savedFacility = await addSportsFacility(facilityData)

      const facility = {
        id: (savedFacility as APISportsFacility)._id || Date.now().toString(),
        name: (savedFacility as APISportsFacility).name,
        image: (savedFacility as APISportsFacility).image,
        description: (savedFacility as APISportsFacility).description || ''
      }

      setSportsData(prev => ({
        ...prev,
        facilities: [...prev.facilities, facility]
      }))
      setNewFacility({ id: '', name: '', image: '', description: '' })
      toast.success('Facility added successfully')
    } catch (error) {
      console.error('Error adding facility:', error)
      toast.error('Failed to add facility')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateFacility = async () => {
    if (!editingFacility || !editingFacility.name.trim() || !editingFacility.image.trim()) {
      toast.error('Facility name and image are required')
      return
    }

    setLoading(true)
    try {
      const facilityData: APISportsFacility = {
        name: editingFacility.name,
        description: editingFacility.description,
        image: editingFacility.image,
        category: 'general'
      }

      await updateSportsFacility(editingFacility.id, facilityData)

      setSportsData(prev => ({
        ...prev,
        facilities: prev.facilities.map(facility =>
          facility.id === editingFacility.id ? editingFacility : facility
        )
      }))
      setEditingFacility(null)
      toast.success('Facility updated successfully')
    } catch (error) {
      console.error('Error updating facility:', error)
      toast.error('Failed to update facility')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteFacility = async (id: string) => {
    if (!confirm('Are you sure you want to delete this facility?')) {
      return
    }

    setLoading(true)
    try {
      await deleteSportsFacility(id)

      setSportsData(prev => ({
        ...prev,
        facilities: prev.facilities.filter(facility => facility.id !== id)
      }))
      toast.success('Facility deleted successfully')
    } catch (error) {
      console.error('Error deleting facility:', error)
      toast.error('Failed to delete facility')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sports Arena</h1>
          <p className="text-gray-600">Manage sports facilities and arena information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/webdata/life-at-inframe">
              Back to Overview
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://www.inframeschool.com/lifeatinframe#sports" target="_blank" rel="noopener noreferrer">
              View Live
            </a>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Main Content Section */}
        <Card>
          <CardHeader>
            <CardTitle>Sports Arena Content</CardTitle>
            <CardDescription>Edit the main sports arena section</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Section Title *</Label>
                <Input
                  id="title"
                  value={sportsData.title}
                  onChange={(e) => setSportsData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Sports Arena"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={sportsData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSportsData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the sports facilities..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="readMoreLink">Read More Link</Label>
                <Input
                  id="readMoreLink"
                  value={sportsData.readMoreLink}
                  onChange={(e) => setSportsData(prev => ({ ...prev, readMoreLink: e.target.value }))}
                  placeholder="#"
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Sports Arena'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sports Facilities */}
        <Card>
          <CardHeader>
            <CardTitle>Sports Facilities</CardTitle>
            <CardDescription>Manage individual sports facilities and their images</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {sportsData.facilities.map((facility) => (
                <div key={facility.id} className="relative group">
                  <div className="aspect-square relative overflow-hidden rounded-lg">
                    <img
                      src={facility.image}
                      alt={facility.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-image.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => setEditingFacility(facility)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteFacility(facility.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium text-center">{facility.name}</p>
                </div>
              ))}
            </div>

            {/* Add New Facility */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">Add New Facility</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facilityName">Facility Name *</Label>
                  <Input
                    id="facilityName"
                    value={newFacility.name}
                    onChange={(e) => setNewFacility(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Swimming Pool"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facilityImage">Upload Image *</Label>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    disabled={uploading}
                  />
                  {uploading && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      Uploading image...
                    </div>
                  )}
                </div>
              </div>
              {newFacility.image && (
                <div className="mt-2">
                  <img
                    src={newFacility.image}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.svg';
                    }}
                  />
                </div>
              )}
              <Button 
                onClick={handleAddFacility} 
                disabled={uploading}
                className="mt-4"
              >
                Add Facility
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Facility Modal */}
      {editingFacility && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setEditingFacility(null)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setEditingFacility(null)
            }
          }}
          tabIndex={-1}
        >
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Facility</CardTitle>
              <CardDescription>Update the facility information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Facility Name *</Label>
                  <Input
                    id="edit-name"
                    value={editingFacility.name}
                    onChange={(e) => setEditingFacility(prev => prev ? { ...prev, name: e.target.value } : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-image">Replace Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    disabled={uploading}
                  />
                  {uploading && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      Uploading image...
                    </div>
                  )}
                  {editingFacility.image && (
                    <div className="mt-2">
                      <img
                        src={editingFacility.image}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.svg';
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpdateFacility} disabled={uploading}>
                    Update Facility
                  </Button>
                  <Button variant="outline" onClick={() => setEditingFacility(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
