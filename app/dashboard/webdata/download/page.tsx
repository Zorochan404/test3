"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  getDownloads,
  deleteDownload,
  DEFAULT_DOWNLOAD_CATEGORIES,
  type DownloadItem
} from './apis'

export default function DownloadPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const loadDownloads = async () => {
    try {
      setLoading(true)
      const items = await getDownloads()
      console.log('Loaded downloads:', items) // Debug log
      setDownloads(items)
    } catch (error) {
      console.error('Error loading downloads:', error)
      toast.error('Failed to load downloads. Please check if the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = useCallback(async () => {
    try {
      // Extract unique categories from existing downloads
      const existingCategories = downloads.map(download => download.category).filter(Boolean)
      const uniqueCategories = Array.from(new Set([...DEFAULT_DOWNLOAD_CATEGORIES, ...existingCategories]))
      console.log('Loaded categories:', uniqueCategories) // Debug log
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error loading categories:', error)
      // Fall back to default categories
      setCategories(DEFAULT_DOWNLOAD_CATEGORIES)
    }
  }, [downloads])

  useEffect(() => {
    loadDownloads()
  }, [])

  useEffect(() => {
    loadCategories()
  }, [downloads, loadCategories])

  const handleDelete = async (id: string) => {
    if (!id) {
      toast.error('Invalid download ID')
      return
    }
    
    if (!confirm('Are you sure you want to delete this download?')) return
    
    try {
      console.log('Deleting download with ID:', id) // Debug log
      await deleteDownload(id)
      toast.success('Download deleted successfully')
      loadDownloads()
    } catch (error: unknown) {
      console.error('Error deleting download:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete download')
    }
  }

  // const handleToggleStatus = async (id: string, currentStatus: boolean) => {
  //   // This would be implemented if you want to toggle active/inactive status
  //   // For now, we'll just show a message
  //   toast.info('Status toggle feature can be implemented based on your requirements')
  // }

  const filteredDownloads = downloads.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categoryOptions = ['all', ...categories]

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading downloads...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Download Management</h1>
          <p className="text-gray-600">Manage downloadable resources and documents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="https://www.inframeschool.com/download" target="_blank" rel="noopener noreferrer">
              View Live
            </a>
          </Button>
          <Button asChild>
            <Link href="/dashboard/webdata/download/add">
              Add New Download
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search downloads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              {categoryOptions.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Downloads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDownloads.map((item) => {
          console.log('Rendering download:', item) // Debug log
          return (
          <Card key={item.id || item._id || item.title} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary">{item.category}</Badge>
                <Badge variant={item.isActive ? "default" : "destructive"}>
                  {item.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <CardTitle className="line-clamp-2 text-lg">{item.title}</CardTitle>
              <CardDescription className="line-clamp-3">{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* File Info */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    📄 {item.fileName}
                  </span>
                  <span>{item.fileSize}</span>
                </div>
                
                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>📅 {item.uploadDate}</span>
                  <span>⬇️ {item.downloadCount} downloads</span>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                      Preview
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/dashboard/webdata/download/edit/${item.id || item._id || 'unknown'}`}>
                      Edit
                    </Link>
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => {
                      const itemId = item.id || item._id;
                      if (itemId) handleDelete(itemId);
                    }}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          )
        })}
      </div>

      {filteredDownloads.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No downloads found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by adding your first download.'}
          </p>
          <Button asChild>
            <Link href="/dashboard/webdata/download/add">
              Add New Download
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
