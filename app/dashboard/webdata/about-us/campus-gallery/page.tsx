"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { uploadToCloudinary } from '@/utils/cloudinary'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { getCampusImages, addCampusImage, updateCampusImage, deleteCampusImage, type AboutUsCampusImage } from '../apis'

export default function CampusGalleryEditPage() {
  const [campusImages, setCampusImages] = useState<AboutUsCampusImage[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    imageUrl: '',
    altText: '',
    order: 1
  })

  useEffect(() => {
    loadCampusImages()
  }, [])

  const loadCampusImages = async () => {
    try {
      setInitialLoading(true)
      const data = await getCampusImages()
      setCampusImages(data.sort((a, b) => a.order - b.order))
    } catch (error) {
      console.error('Error loading campus images:', error)
      toast.error('Failed to load campus images')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
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
    
    if (!formData.imageUrl.trim() || !formData.altText.trim()) {
      toast.error('Image URL and alt text are required')
      return
    }

    try {
      setLoading(true)

      const imageData = {
        imageUrl: formData.imageUrl.trim(),
        altText: formData.altText.trim(),
        order: formData.order
      }

      console.log('Campus Gallery Form Data:', imageData)

      if (editingId) {
        await updateCampusImage(editingId, imageData)
        toast.success('Campus image updated successfully!')
      } else {
        await addCampusImage(imageData)
        toast.success('Campus image added successfully!')
      }

      // Reset form and reload data
      setFormData({
        imageUrl: '',
        altText: '',
        order: campusImages.length + 1
      })
      setEditingId(null)
      await loadCampusImages()
    } catch (error: unknown) {
      console.error('Error saving campus image:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save campus image')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (image: AboutUsCampusImage) => {
    setFormData({
      imageUrl: image.imageUrl,
      altText: image.altText,
      order: image.order
    })
    setEditingId(image._id || null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campus image?')) return

    try {
      await deleteCampusImage(id)
      toast.success('Campus image deleted successfully!')
      await loadCampusImages()
    } catch (error) {
      console.error('Error deleting campus image:', error)
      toast.error('Failed to delete campus image')
    }
  }

  const cancelEdit = () => {
    setFormData({
      imageUrl: '',
      altText: '',
      order: campusImages.length + 1
    })
    setEditingId(null)
  }

  if (initialLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading campus gallery...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Campus Life Gallery</h1>
          <p className="text-gray-600">Manage the Experience Campus Life image gallery</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Campus Image' : 'Add New Campus Image'}</CardTitle>
            <CardDescription>
              {editingId ? 'Update the campus image information' : 'Add a new image to the campus life gallery'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="imageUrl">Image URL *</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                      placeholder="https://example.com/image.jpg or upload below"
                      className="flex-1"
                      required
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
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-image.svg';
                      }}
                    />
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="altText">Alt Text *</Label>
                <Input
                  id="altText"
                  value={formData.altText}
                  onChange={(e) => handleInputChange('altText', e.target.value)}
                  placeholder="Campus Life 1"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Descriptive text for accessibility and SEO
                </p>
              </div>

              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
                  min="1"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Saving...' : editingId ? 'Update Image' : 'Add Image'}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Images List */}
        <Card>
          <CardHeader>
            <CardTitle>Current Campus Images ({campusImages.length})</CardTitle>
            <CardDescription>Manage existing campus life gallery images</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {campusImages.map((image) => (
                <div key={image._id || image.imageUrl} className="border rounded-lg p-4">
                  <div className="flex gap-4">
                    <img
                      src={image.imageUrl}
                      alt={image.altText}
                      className="w-20 h-12 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-image.svg';
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{image.altText}</p>
                      <p className="text-xs text-gray-500">Order: {image.order}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(image)}
                    >
                      Edit
                    </Button>
                    {image._id && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(image._id!)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {campusImages.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No campus images added yet. Add your first image above.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guidelines */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Campus Gallery Guidelines</CardTitle>
          <CardDescription>Best practices for campus life gallery images</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Image Requirements</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Minimum resolution: 1080x1080 pixels</li>
                <li>• Square aspect ratio (1:1) preferred</li>
                <li>• File format: JPG, PNG, WebP</li>
                <li>• Maximum file size: 2MB</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Content Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Show diverse campus activities</li>
                <li>• Include students in action</li>
                <li>• Capture different areas of campus</li>
                <li>• Use natural, candid shots</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
