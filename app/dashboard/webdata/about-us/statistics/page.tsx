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
import { getStatistics, addStatistic, updateStatistic, deleteStatistic, type AboutUsStatistic } from '../apis'

export default function StatisticsEditPage() {
  const [statistics, setStatistics] = useState<AboutUsStatistic[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  const [formData, setFormData] = useState({
    number: '',
    title: '',
    description: '',
    imageUrl: '',
    order: 1
  })

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      setInitialLoading(true)
      const data = await getStatistics()
      if (data.length === 0) {
        // Initialize with default statistics
        const defaultStats = [
          {
            number: '500+',
            title: 'Research Excellence',
            description: 'Published Research Papers',
            imageUrl: '',
            order: 1
          },
          {
            number: '50+',
            title: 'Global Network',
            description: 'International Partners',
            imageUrl: '',
            order: 2
          },
          {
            number: '100+',
            title: 'Innovation Hub',
            description: 'Startup Incubations',
            imageUrl: '',
            order: 3
          }
        ]
        setStatistics(defaultStats as AboutUsStatistic[])
      } else {
        setStatistics(data.sort((a, b) => a.order - b.order))
      }
    } catch (error) {
      console.error('Error loading statistics:', error)
      toast.error('Failed to load statistics')
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
    
    if (!formData.number.trim() || !formData.title.trim() || !formData.description.trim()) {
      toast.error('Number, title, and description are required')
      return
    }

    try {
      setLoading(true)

      const statisticData = {
        number: formData.number.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl,
        order: formData.order
      }

      console.log('Statistics Form Data:', statisticData)

      if (editingId) {
        await updateStatistic(editingId, statisticData)
        toast.success('Statistic updated successfully!')
      } else {
        await addStatistic(statisticData)
        toast.success('Statistic added successfully!')
      }

      // Reset form and reload data
      setFormData({
        number: '',
        title: '',
        description: '',
        imageUrl: '',
        order: statistics.length + 1
      })
      setEditingId(null)
      await loadStatistics()
    } catch (error: unknown) {
      console.error('Error saving statistic:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save statistic')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (statistic: AboutUsStatistic) => {
    setFormData({
      number: statistic.number,
      title: statistic.title,
      description: statistic.description,
      imageUrl: statistic.imageUrl,
      order: statistic.order
    })
    setEditingId(statistic._id || null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this statistic?')) return

    try {
      await deleteStatistic(id)
      toast.success('Statistic deleted successfully!')
      await loadStatistics()
    } catch (error) {
      console.error('Error deleting statistic:', error)
      toast.error('Failed to delete statistic')
    }
  }

  const cancelEdit = () => {
    setFormData({
      number: '',
      title: '',
      description: '',
      imageUrl: '',
      order: statistics.length + 1
    })
    setEditingId(null)
  }

  if (initialLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading statistics...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Statistics Section</h1>
          <p className="text-gray-600">Manage Research Excellence, Global Network, and Innovation Hub statistics</p>
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
            <CardTitle>{editingId ? 'Edit Statistic' : 'Add New Statistic'}</CardTitle>
            <CardDescription>
              {editingId ? 'Update the statistic information' : 'Add a new statistic to the section'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="number">Number/Value *</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                  placeholder="500+"
                  required
                />
              </div>

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Research Excellence"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Published Research Papers"
                  required
                />
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
                      onClick={() => fileInputRefs.current['main']?.click()}
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                  <Input
                    ref={(el) => fileInputRefs.current['main'] = el}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-32 h-20 object-cover rounded border"
                    />
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Saving...' : editingId ? 'Update Statistic' : 'Add Statistic'}
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

        {/* Statistics List */}
        <Card>
          <CardHeader>
            <CardTitle>Current Statistics</CardTitle>
            <CardDescription>Manage existing statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statistics.map((stat) => (
                <div key={stat._id || stat.title} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl font-bold text-blue-600">{stat.number}</span>
                        <span className="text-sm text-gray-500">Order: {stat.order}</span>
                      </div>
                      <h3 className="font-medium">{stat.title}</h3>
                      <p className="text-sm text-gray-600">{stat.description}</p>
                    </div>
                    {stat.imageUrl && (
                      <img
                        src={stat.imageUrl}
                        alt={stat.title}
                        className="w-16 h-10 object-cover rounded ml-4"
                      />
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(stat)}
                    >
                      Edit
                    </Button>
                    {stat._id && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(stat._id!)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
