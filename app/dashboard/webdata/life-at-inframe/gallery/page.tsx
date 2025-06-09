"use client"

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { uploadToCloudinary } from '@/utils/cloudinary'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  getGalleryImages,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  type GalleryImage as APIGalleryImage
} from '../apis'

type GalleryImage = {
  _id?: string;
  title: string;
  imageUrl: string;
  category: string;
  order: number;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [initialLoading, setInitialLoading] = useState(true)

  // Load gallery images from backend on component mount
  React.useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        const galleryImages = await getGalleryImages()
        const formattedImages = galleryImages.map((img: APIGalleryImage) => ({
          _id: img._id,
          title: img.title,
          imageUrl: img.imageUrl,
          category: img.category,
          order: img.order
        }))
        setImages(formattedImages)
      } catch (error) {
        console.error('Error loading gallery images:', error)
        toast.error('Failed to load gallery images')
      } finally {
        setInitialLoading(false)
      }
    }

    loadGalleryImages()
  }, [])

  const [newImage, setNewImage] = useState<GalleryImage>({
    title: '',
    imageUrl: '',
    category: 'campus',
    order: images.length + 1
  })

  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    { value: 'campus', label: 'Campus Life' },
    { value: 'events', label: 'Events & Celebrations' },
    { value: 'academics', label: 'Academic Activities' },
    { value: 'sports', label: 'Sports & Recreation' },
    { value: 'ceremonies', label: 'Ceremonies' },
    { value: 'activities', label: 'Student Activities' },
    { value: 'facilities', label: 'Facilities' }
  ]

  const categoryColors: { [key: string]: string } = {
    campus: 'bg-blue-100 text-blue-800',
    events: 'bg-purple-100 text-purple-800',
    academics: 'bg-green-100 text-green-800',
    sports: 'bg-orange-100 text-orange-800',
    ceremonies: 'bg-red-100 text-red-800',
    activities: 'bg-yellow-100 text-yellow-800',
    facilities: 'bg-gray-100 text-gray-800'
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const imageUrl = await uploadToCloudinary(file)
      if (isEditing && editingImage) {
        setEditingImage(prev => prev ? { ...prev, imageUrl } : null)
      } else {
        setNewImage(prev => ({ ...prev, imageUrl }))
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

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newImage.title.trim() || !newImage.imageUrl.trim()) {
      toast.error('Title and image are required')
      return
    }

    setLoading(true)
    try {
      const imageData: APIGalleryImage = {
        title: newImage.title,
        imageUrl: newImage.imageUrl,
        category: newImage.category,
        order: newImage.order
      }

      const addedImage = await addGalleryImage(imageData)

      const formattedImage: GalleryImage = {
        _id: addedImage._id,
        title: addedImage.title,
        imageUrl: addedImage.imageUrl,
        category: addedImage.category,
        order: addedImage.order
      }

      setImages(prev => [...prev, formattedImage])
      setNewImage({ title: '', imageUrl: '', category: 'campus', order: images.length + 2 })
      toast.success('Image added successfully')
    } catch (error) {
      console.error('Error adding image:', error)
      toast.error('Failed to add image')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateImage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingImage || !editingImage.title.trim() || !editingImage.imageUrl.trim()) {
      toast.error('Title and image are required')
      return
    }

    setLoading(true)
    try {
      const imageData: APIGalleryImage = {
        title: editingImage.title,
        imageUrl: editingImage.imageUrl,
        category: editingImage.category,
        order: editingImage.order
      }

      await updateGalleryImage(editingImage._id!, imageData)

      setImages(prev => prev.map(image =>
        image._id === editingImage._id ? editingImage : image
      ))
      setEditingImage(null)
      toast.success('Image updated successfully')
    } catch (error) {
      console.error('Error updating image:', error)
      toast.error('Failed to update image')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return
    }

    setLoading(true)
    try {
      await deleteGalleryImage(id)
      setImages(prev => prev.filter(image => image._id !== id))
      toast.success('Image deleted successfully')
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('Failed to delete image')
    } finally {
      setLoading(false)
    }
  }

  const filteredImages = (category: string) => {
    if (category === 'all') return images
    return images.filter(image => image.category === category)
  }

  const getCategoryLabel = (value: string) => {
    return categories.find(cat => cat.value === value)?.label || value
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Campus Gallery</h1>
          <p className="text-gray-600">Manage campus images and photo gallery</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/webdata/life-at-inframe">
              Back to Overview
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://www.inframeschool.com/lifeatinframe#gallery" target="_blank" rel="noopener noreferrer">
              View Live
            </a>
          </Button>
        </div>
      </div>

      {initialLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            Loading gallery images...
          </div>
        </div>
      ) : (
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="all">All ({images.length})</TabsTrigger>
          <TabsTrigger value="campus">Campus</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="academics">Academic</TabsTrigger>
          <TabsTrigger value="sports">Sports</TabsTrigger>
          <TabsTrigger value="ceremonies">Ceremonies</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="add">Add New</TabsTrigger>
        </TabsList>

        {['all', 'campus', 'events', 'academics', 'sports', 'ceremonies', 'activities'].map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages(category).map((image) => (
                <Card key={image._id} className="overflow-hidden group">
                  <div className="aspect-square relative">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
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
                          onClick={() => setEditingImage(image)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteImage(image._id!)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="p-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium truncate">{image.title}</CardTitle>
                      <Badge variant="secondary">#{image.order}</Badge>
                    </div>
                    <Badge className={`w-fit text-xs ${categoryColors[image.category]}`}>
                      {getCategoryLabel(image.category)}
                    </Badge>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Gallery Image</CardTitle>
              <CardDescription>Upload a new image to the campus gallery</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddImage} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Image Title *</Label>
                    <Input
                      id="title"
                      value={newImage.title}
                      onChange={(e) => setNewImage(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Campus Life Activity"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={newImage.category} 
                      onValueChange={(value) => setNewImage(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Upload Image *</Label>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    disabled={uploading}
                    required={!newImage.imageUrl}
                  />
                  {uploading && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      Uploading image...
                    </div>
                  )}
                  {newImage.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={newImage.imageUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.svg';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={newImage.order}
                    onChange={(e) => setNewImage(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                    min="1"
                  />
                </div>

                <Button type="submit" disabled={loading || uploading}>
                  {loading ? 'Adding...' : 'Add Image'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      )}

      {/* Edit Image Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Edit Gallery Image</CardTitle>
              <CardDescription>Update the image information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateImage} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Image Title *</Label>
                    <Input
                      id="edit-title"
                      value={editingImage.title}
                      onChange={(e) => setEditingImage(prev => prev ? { ...prev, title: e.target.value } : null)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category *</Label>
                    <Select 
                      value={editingImage.category} 
                      onValueChange={(value) => setEditingImage(prev => prev ? { ...prev, category: value } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                  {editingImage.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={editingImage.imageUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.svg';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-order">Display Order</Label>
                  <Input
                    id="edit-order"
                    type="number"
                    value={editingImage.order}
                    onChange={(e) => setEditingImage(prev => prev ? { ...prev, order: parseInt(e.target.value) || 1 } : null)}
                    min="1"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading || uploading}>
                    {loading ? 'Updating...' : 'Update Image'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setEditingImage(null)}>
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
