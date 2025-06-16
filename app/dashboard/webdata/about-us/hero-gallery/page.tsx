"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { uploadToCloudinary } from '@/utils/cloudinary'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { getHeroImages, addHeroImage, updateHeroImage, deleteHeroImage, type AboutUsHeroImage } from '../apis'

export default function HeroGalleryEditPage() {
  const [heroImages, setHeroImages] = useState<AboutUsHeroImage[]>([])
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
    loadHeroImages()
  }, [])

  const loadHeroImages = async () => {
    try {
      setInitialLoading(true)
      const data = await getHeroImages()
      setHeroImages(data.sort((a, b) => a.order - b.order))
    } catch (error) {
      console.error('Error loading hero images:', error)
      toast.error('Failed to load hero images')
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

      console.log('Hero Gallery Form Data:', imageData)

      if (editingId) {
        await updateHeroImage(editingId, imageData)
        toast.success('Hero image updated successfully!')
      } else {
        await addHeroImage(imageData)
        toast.success('Hero image added successfully!')
      }

      // Reset form and reload data
      setFormData({
        imageUrl: '',
        altText: '',
        order: heroImages.length + 1
      })
      setEditingId(null)
      await loadHeroImages()
    } catch (error: unknown) {
      console.error('Error saving hero image:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save hero image')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (image: AboutUsHeroImage) => {
    setFormData({
      imageUrl: image.imageUrl,
      altText: image.altText,
      order: image.order
    })
    setEditingId(image._id || null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero image?')) return

    try {
      await deleteHeroImage(id)
      toast.success('Hero image deleted successfully!')
      await loadHeroImages()
    } catch (error) {
      console.error('Error deleting hero image:', error)
      toast.error('Failed to delete hero image')
    }
  }

  const cancelEdit = () => {
    setFormData({
      imageUrl: '',
      altText: '',
      order: heroImages.length + 1
    })
    setEditingId(null)
  }

  if (initialLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading hero gallery...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Hero Gallery</h1>
          <p className="text-gray-600">Manage the image carousel at the top of the About Us page</p>
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
            <CardTitle>{editingId ? 'Edit Hero Image' : 'Add New Hero Image'}</CardTitle>
            <CardDescription>
              {editingId ? 'Update the hero image information' : 'Add a new image to the hero gallery'}
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
                  placeholder="University Life 1"
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
            <CardTitle>Current Hero Images ({heroImages.length})</CardTitle>
            <CardDescription>Manage existing hero gallery images</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {heroImages.map((image) => (
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
              {heroImages.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No hero images added yet. Add your first image above.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guidelines */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Hero Gallery Guidelines</CardTitle>
          <CardDescription>Best practices for hero gallery images</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Image Requirements</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Minimum resolution: 1200x800 pixels</li>
                <li>• Aspect ratio: 3:2 or 16:9 recommended</li>
                <li>• File format: JPG, PNG, WebP</li>
                <li>• Maximum file size: 2MB</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Content Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Show campus life and activities</li>
                <li>• Include students and facilities</li>
                <li>• Use high-quality, professional photos</li>
                <li>• Maintain consistent visual style</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
