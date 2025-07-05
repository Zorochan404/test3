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
import { getNewsById, updateNews, getNewsTypes, getNewsSubTypes, type NewsItem } from '../../apis'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditNewsPage({ params }: PageProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    subType: '',
    description: '',
    pointdetails: [''],
    image: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    tags: [''],
    isActive: true
  })

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [types, setTypes] = useState<string[]>([])
  const [subTypes, setSubTypes] = useState<string[]>([])
  const [newsId, setNewsId] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const { id } = await params
        setNewsId(id)
        await Promise.all([
          loadNewsData(id),
          loadFilters()
        ])
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Failed to load news data')
      } finally {
        setInitialLoading(false)
      }
    }

    loadData()
  }, [params])

  const loadNewsData = async (id: string) => {
    try {
      const response = await getNewsById(id)
      if (response.success && response.data) {
        const news = response.data
        setFormData({
          title: news.title,
          type: news.type,
          subType: news.subType,
          description: news.description,
          pointdetails: news.pointdetails.length > 0 ? news.pointdetails : [''],
          image: news.image,
          date: new Date(news.date).toISOString().split('T')[0],
          time: news.time,
          tags: news.tags.length > 0 ? news.tags : [''],
          isActive: news.isActive
        })
      }
    } catch (error) {
      console.error('Error loading news data:', error)
      toast.error('Failed to load news data')
    }
  }

  const loadFilters = async () => {
    try {
      const [typesData, subTypesData] = await Promise.all([
        getNewsTypes(),
        getNewsSubTypes()
      ])
      setTypes(typesData || [])
      setSubTypes(subTypesData || [])
    } catch (error) {
      console.error('Error loading filters:', error)
      setTypes([])
      setSubTypes([])
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayChange = (field: 'pointdetails' | 'tags', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field: 'pointdetails' | 'tags') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field: 'pointdetails' | 'tags', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const imageUrl = await uploadToCloudinary(file)
      handleInputChange('image', imageUrl)
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
    
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }

    if (!formData.type.trim()) {
      toast.error('Type is required')
      return
    }

    if (!formData.subType.trim()) {
      toast.error('SubType is required')
      return
    }

    if (!formData.description.trim()) {
      toast.error('Description is required')
      return
    }

    if (!formData.image.trim()) {
      toast.error('Image is required')
      return
    }

    // Filter out empty pointdetails and tags
    const filteredPointDetails = formData.pointdetails.filter(item => item.trim() !== '')
    const filteredTags = formData.tags.filter(item => item.trim() !== '')

    if (filteredPointDetails.length === 0) {
      toast.error('At least one point detail is required')
      return
    }

    if (filteredTags.length === 0) {
      toast.error('At least one tag is required')
      return
    }

    try {
      setLoading(true)

      const newsData: Partial<NewsItem> = {
        title: formData.title.trim(),
        type: formData.type.trim(),
        subType: formData.subType.trim(),
        description: formData.description.trim(),
        pointdetails: filteredPointDetails,
        image: formData.image,
        date: new Date(formData.date).toISOString(),
        time: formData.time,
        tags: filteredTags,
        isActive: formData.isActive
      }

      console.log('News Update Data:', newsData)

      await updateNews(newsId, newsData)
      toast.success('News updated successfully!')
    } catch (error: unknown) {
      console.error('Error updating news:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update news')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading news data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit News</h1>
          <p className="text-gray-600">Update the news article information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/webdata/news">
              Back to News
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/webdata/news/view/${newsId}`}>
              View News
            </Link>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>News Information</CardTitle>
            <CardDescription>Update the basic information for the news article</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter news title"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type *</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  placeholder="e.g., Technology, Event, Announcement"
                  required
                />
                {types.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Available types:</p>
                    <div className="flex flex-wrap gap-1">
                      {types.map((type) => (
                        <button
                          key={type}
                          type="button"
                          className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                          onClick={() => handleInputChange('type', type)}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="subType">SubType *</Label>
                <Input
                  id="subType"
                  value={formData.subType}
                  onChange={(e) => handleInputChange('subType', e.target.value)}
                  placeholder="e.g., Innovation, Workshop, Update"
                  required
                />
                {subTypes.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Available subtypes:</p>
                    <div className="flex flex-wrap gap-1">
                      {subTypes.map((subType) => (
                        <button
                          key={subType}
                          type="button"
                          className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                          onClick={() => handleInputChange('subType', subType)}
                        >
                          {subType}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter a detailed description of the news"
                rows={4}
                required
              />
            </div>

            <div>
              <Label>Point Details *</Label>
              <div className="space-y-2">
                {formData.pointdetails.map((point, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={point}
                      onChange={(e) => handleArrayChange('pointdetails', index, e.target.value)}
                      placeholder={`Point ${index + 1}`}
                      required={index === 0}
                    />
                    {formData.pointdetails.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('pointdetails', index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('pointdetails')}
                >
                  Add Point
                </Button>
              </div>
            </div>

            <div>
              <Label>Tags *</Label>
              <div className="space-y-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={tag}
                      onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                      placeholder={`Tag ${index + 1}`}
                      required={index === 0}
                    />
                    {formData.tags.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('tags', index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('tags')}
                >
                  Add Tag
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  placeholder="e.g., 10:00 AM"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image">Image *</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
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
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="News image preview"
                      className="w-full max-w-md h-48 object-cover rounded border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-image.svg';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" asChild>
            <Link href="/dashboard/webdata/news">
              Cancel
            </Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update News'}
          </Button>
        </div>
      </form>
    </div>
  )
} 