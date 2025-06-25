"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { uploadToCloudinary } from '@/utils/cloudinary'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  getStudentClubs,
  addStudentClub,
  updateStudentClub,
  deleteStudentClub
} from '../apis'

type StudentClub = {
  _id?: string;
  name: string;
  category: 'arts' | 'sports' | 'academic' | 'cultural';
  description: string;
  image?: string;
  order: number;
}

export default function StudentClubsPage() {
  const [clubs, setClubs] = useState<StudentClub[]>([])

  const [newClub, setNewClub] = useState<StudentClub>({
    name: '',
    category: 'arts',
    description: '',
    image: '',
    order: clubs.length + 1
  })

  const [editingClub, setEditingClub] = useState<StudentClub | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch clubs from backend on component mount
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setInitialLoading(true)
        const data = await getStudentClubs()
        setClubs((data as StudentClub[]) || [])
        setNewClub(prev => ({ ...prev, order: ((data as StudentClub[])?.length || 0) + 1 }))
      } catch (error) {
        console.error('Error fetching clubs:', error)
        toast.error('Failed to load clubs')
      } finally {
        setInitialLoading(false)
      }
    }

    fetchClubs()
  }, [])

  const categoryLabels = {
    arts: 'Arts & Creative',
    sports: 'Sports',
    academic: 'Academic',
    cultural: 'Cultural'
  }

  const categoryColors = {
    arts: 'bg-purple-100 text-purple-800',
    sports: 'bg-green-100 text-green-800',
    academic: 'bg-blue-100 text-blue-800',
    cultural: 'bg-orange-100 text-orange-800'
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const imageUrl = await uploadToCloudinary(file)
      if (isEditing && editingClub) {
        setEditingClub(prev => prev ? { ...prev, image: imageUrl } : null)
      } else {
        setNewClub(prev => ({ ...prev, image: imageUrl }))
      }
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleAddClub = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newClub.name.trim() || !newClub.description.trim()) {
      toast.error('Name and description are required')
      return
    }

    setLoading(true)
    try {
      const addedClub = await addStudentClub(newClub)
      setClubs(prev => [...prev, addedClub as StudentClub])
      setNewClub({
        name: '',
        category: 'arts',
        description: '',
        image: '',
        order: clubs.length + 2
      })
      toast.success('Club added successfully')
    } catch (error) {
      console.error('Error adding club:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`Failed to add club: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateClub = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingClub || !editingClub.name.trim() || !editingClub.description.trim()) {
      toast.error('Name and description are required')
      return
    }

    if (!editingClub._id) {
      toast.error('Club ID is required for update')
      return
    }

    setLoading(true)
    try {
      const updatedClub = await updateStudentClub(editingClub._id, editingClub)
      setClubs(prev => prev.map(club =>
        club._id === editingClub._id ? (updatedClub as StudentClub) : club
      ))
      setEditingClub(null)
      toast.success('Club updated successfully')
    } catch (error) {
      console.error('Error updating club:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`Failed to update club: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClub = async (id: string) => {
    if (!confirm('Are you sure you want to delete this club?')) {
      return
    }

    try {
      await deleteStudentClub(id)
      setClubs(prev => prev.filter(club => club._id !== id))
      toast.success('Club deleted successfully')
    } catch (error) {
      console.error('Error deleting club:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`Failed to delete club: ${errorMessage}`)
    }
  }

  const filteredClubs = (category: string) => {
    if (category === 'all') return clubs
    return clubs.filter(club => club.category === category)
  }

  if (initialLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading clubs...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Student Clubs & Societies</h1>
          <p className="text-gray-600">Manage student clubs and societies</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/webdata/life-at-inframe">
              Back to Overview
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://www.inframeschool.com/lifeatinframe#clubs" target="_blank" rel="noopener noreferrer">
              View Live
            </a>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Clubs ({clubs.length})</TabsTrigger>
          <TabsTrigger value="arts">Arts & Creative ({filteredClubs('arts').length})</TabsTrigger>
          <TabsTrigger value="sports">Sports ({filteredClubs('sports').length})</TabsTrigger>
          <TabsTrigger value="academic">Academic ({filteredClubs('academic').length})</TabsTrigger>
          <TabsTrigger value="cultural">Cultural ({filteredClubs('cultural').length})</TabsTrigger>
          <TabsTrigger value="add">Add New Club</TabsTrigger>
        </TabsList>

        {['all', 'arts', 'sports', 'academic', 'cultural'].map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            {filteredClubs(category).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      {category === 'all' ? 'No clubs found' : `No ${categoryLabels[category as keyof typeof categoryLabels]} clubs found`}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {category === 'all'
                        ? 'Get started by adding your first student club.'
                        : `Add the first ${categoryLabels[category as keyof typeof categoryLabels]} club.`
                      }
                    </p>
                    <Button onClick={() => (document.querySelector('[data-value="add"]') as HTMLElement)?.click()}>
                      Add First Club
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClubs(category).map((club) => (
                <Card key={club._id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    {club.image ? (
                      <img 
                        src={club.image} 
                        alt={club.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{club.name}</CardTitle>
                      <div className="flex gap-2">
                        <Badge className={categoryColors[club.category]}>
                          {categoryLabels[club.category]}
                        </Badge>
                        <Badge variant="secondary">#{club.order}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                      {club.description}
                    </CardDescription>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingClub(club)}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteClub(club._id!)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              </div>
            )}
          </TabsContent>
        ))}

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Student Club</CardTitle>
              <CardDescription>Create a new student club or society</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddClub} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Club Name *</Label>
                    <Input
                      id="name"
                      value={newClub.name}
                      onChange={(e) => setNewClub(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Arts & Creative Club"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={newClub.category} 
                      onValueChange={(value: 'arts' | 'sports' | 'academic' | 'cultural') => 
                        setNewClub(prev => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="arts">Arts & Creative</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="cultural">Cultural</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newClub.description}
                    onChange={(e) => setNewClub(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the club's activities and purpose..."
                    rows={4}
                    required
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Keep descriptions engaging and informative</span>
                    <span>{newClub.description.length}/500 characters</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Club Image</Label>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    disabled={uploading}
                  />
                  {uploading && <p className="text-sm text-gray-500">Uploading image...</p>}
                  {newClub.image && (
                    <div className="mt-2">
                      <img src={newClub.image} alt="Preview" className="w-32 h-20 object-cover rounded" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={newClub.order}
                    onChange={(e) => setNewClub(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                    min="1"
                  />
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Club'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Content Guidelines */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Content Guidelines</CardTitle>
              <CardDescription>Best practices for student club content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Club Name Guidelines</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Use clear, descriptive names</li>
                    <li>• Avoid abbreviations when possible</li>
                    <li>• Maximum 50 characters recommended</li>
                    <li>• Include the word &quot;Club&quot; or &quot;Society&quot;</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Description Guidelines</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Highlight club activities and benefits</li>
                    <li>• Use engaging, active language</li>
                    <li>• Include meeting frequency or events</li>
                    <li>• Keep under 400 characters for best display</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Club Modal */}
      {editingClub && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Edit Club</CardTitle>
              <CardDescription>Update the club information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateClub} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Club Name *</Label>
                    <Input
                      id="edit-name"
                      value={editingClub.name}
                      onChange={(e) => setEditingClub(prev => prev ? { ...prev, name: e.target.value } : null)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category *</Label>
                    <Select 
                      value={editingClub.category} 
                      onValueChange={(value: 'arts' | 'sports' | 'academic' | 'cultural') => 
                        setEditingClub(prev => prev ? { ...prev, category: value } : null)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="arts">Arts & Creative</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="cultural">Cultural</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description *</Label>
                  <Textarea
                    id="edit-description"
                    value={editingClub.description}
                    onChange={(e) => setEditingClub(prev => prev ? { ...prev, description: e.target.value } : null)}
                    rows={4}
                    required
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Keep descriptions engaging and informative</span>
                    <span>{editingClub.description.length}/500 characters</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-image">Club Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    disabled={uploading}
                  />
                  {uploading && <p className="text-sm text-gray-500">Uploading image...</p>}
                  {editingClub.image && (
                    <div className="mt-2">
                      <img src={editingClub.image} alt="Preview" className="w-32 h-20 object-cover rounded" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-order">Display Order</Label>
                  <Input
                    id="edit-order"
                    type="number"
                    value={editingClub.order}
                    onChange={(e) => setEditingClub(prev => prev ? { ...prev, order: parseInt(e.target.value) || 1 } : null)}
                    min="1"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Club'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setEditingClub(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
