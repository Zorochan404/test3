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
import { getCoreValues, addCoreValue, updateCoreValue, deleteCoreValue, type AboutUsCoreValue } from '../apis'

export default function CoreValuesEditPage() {
  const [coreValues, setCoreValues] = useState<AboutUsCoreValue[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    order: 1
  })

  useEffect(() => {
    loadCoreValues()
  }, [])

  const loadCoreValues = async () => {
    try {
      setInitialLoading(true)
      const data = await getCoreValues()
      if (data.length === 0) {
        // Initialize with default core values
        const defaultValues = [
          {
            title: 'Innovation First',
            description: 'At Inframe, we are committed to pushing boundaries through cutting-edge research and technology. Our students and faculty are constantly engaged in innovative projects that aim to transform industries and create lasting impact.',
            imageUrl: '',
            order: 1
          },
          {
            title: 'Global Perspective',
            description: 'Inframe fosters international collaboration and cultural exchange, offering a global platform for our students. With partnerships across the world, our community is enriched by diverse perspectives and experiences, preparing students for a global workforce.',
            imageUrl: '',
            order: 2
          },
          {
            title: 'Sustainable Future',
            description: 'We believe in the power of design and business to create a sustainable future. At Inframe, we lead initiatives that promote environmental sustainability and social responsibility, ensuring that our graduates are equipped to contribute to a better world.',
            imageUrl: '',
            order: 3
          }
        ]
        setCoreValues(defaultValues as AboutUsCoreValue[])
      } else {
        setCoreValues(data.sort((a, b) => a.order - b.order))
      }
    } catch (error) {
      console.error('Error loading core values:', error)
      toast.error('Failed to load core values')
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
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Title and description are required')
      return
    }

    try {
      setLoading(true)

      const coreValueData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl,
        order: formData.order
      }

      console.log('Core Values Form Data:', coreValueData)

      if (editingId) {
        await updateCoreValue(editingId, coreValueData)
        toast.success('Core value updated successfully!')
      } else {
        await addCoreValue(coreValueData)
        toast.success('Core value added successfully!')
      }

      // Reset form and reload data
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        order: coreValues.length + 1
      })
      setEditingId(null)
      await loadCoreValues()
    } catch (error: unknown) {
      console.error('Error saving core value:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save core value')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (coreValue: AboutUsCoreValue) => {
    setFormData({
      title: coreValue.title,
      description: coreValue.description,
      imageUrl: coreValue.imageUrl,
      order: coreValue.order
    })
    setEditingId(coreValue._id || null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this core value?')) return

    try {
      await deleteCoreValue(id)
      toast.success('Core value deleted successfully!')
      await loadCoreValues()
    } catch (error) {
      console.error('Error deleting core value:', error)
      toast.error('Failed to delete core value')
    }
  }

  const cancelEdit = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      order: coreValues.length + 1
    })
    setEditingId(null)
  }

  if (initialLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading core values...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Core Values Section</h1>
          <p className="text-gray-600">Manage the Our Core Values section with images and descriptions</p>
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
            <CardTitle>{editingId ? 'Edit Core Value' : 'Add New Core Value'}</CardTitle>
            <CardDescription>
              {editingId ? 'Update the core value information' : 'Add a new core value to the section'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Innovation First"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe this core value..."
                  rows={4}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.description.length} characters
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

              <div>
                <Label htmlFor="imageUrl">Image</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
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

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Saving...' : editingId ? 'Update Core Value' : 'Add Core Value'}
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

        {/* Core Values List */}
        <Card>
          <CardHeader>
            <CardTitle>Current Core Values ({coreValues.length})</CardTitle>
            <CardDescription>Manage existing core values</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {coreValues.map((value) => (
                <div key={value._id || value.title} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{value.title}</h3>
                        <span className="text-sm text-gray-500">Order: {value.order}</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3">{value.description}</p>
                    </div>
                    {value.imageUrl && (
                      <img
                        src={value.imageUrl}
                        alt={value.title}
                        className="w-16 h-10 object-cover rounded ml-4"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.svg';
                        }}
                      />
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(value)}
                    >
                      Edit
                    </Button>
                    {value._id && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(value._id!)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {coreValues.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No core values added yet. Add your first core value above.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guidelines */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Core Values Guidelines</CardTitle>
          <CardDescription>Best practices for core values content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Content Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Keep titles concise and impactful</li>
                <li>• Focus on institutional values and principles</li>
                <li>• Use inspiring and professional language</li>
                <li>• Include specific examples or outcomes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Image Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use high-quality, relevant images</li>
                <li>• Show students, campus, or activities</li>
                <li>• Maintain consistent visual style</li>
                <li>• Minimum resolution: 800x600 pixels</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
