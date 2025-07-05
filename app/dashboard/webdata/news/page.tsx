"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import Link from 'next/link'
import { getAllNews, toggleNewsStatus, deleteNews, type NewsItem } from './apis'

export default function NewsPage() {
  const [allNews, setAllNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedSubType, setSelectedSubType] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      setLoading(true)
      const response = await getAllNews(1, 1000) // Get all news items
      if (response.success) {
        setAllNews(response.data.news)
      }
    } catch (error) {
      console.error('Error loading news:', error)
      toast.error('Failed to load news')
    } finally {
      setLoading(false)
    }
  }

  // Extract unique types and subtypes from the news data
  const types = useMemo(() => {
    const uniqueTypes = [...new Set(allNews.map(item => item.type).filter(Boolean))]
    return uniqueTypes.sort()
  }, [allNews])

  const subTypes = useMemo(() => {
    const uniqueSubTypes = [...new Set(allNews.map(item => item.subType).filter(Boolean))]
    return uniqueSubTypes.sort()
  }, [allNews])

  // Filter news based on search query and filters
  const filteredNews = useMemo(() => {
    let filtered = allNews

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query)) ||
        item.type.toLowerCase().includes(query) ||
        item.subType.toLowerCase().includes(query)
      )
    }

    // Filter by type
    if (selectedType) {
      filtered = filtered.filter(item => item.type === selectedType)
    }

    // Filter by subtype
    if (selectedSubType) {
      filtered = filtered.filter(item => item.subType === selectedSubType)
    }

    return filtered
  }, [allNews, searchQuery, selectedType, selectedSubType])

  // Pagination logic
  const totalNews = filteredNews.length
  const totalPages = Math.ceil(totalNews / itemsPerPage)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

  // Get current page items
  const currentNews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredNews.slice(startIndex, endIndex)
  }, [filteredNews, currentPage])

  const handleSearch = () => {
    setCurrentPage(1)
  }

  const handleTypeFilter = (type: string) => {
    setSelectedType(type === selectedType ? '' : type)
    setSelectedSubType('')
    setCurrentPage(1)
  }

  const handleSubTypeFilter = (subType: string) => {
    setSelectedSubType(subType === selectedSubType ? '' : subType)
    setSelectedType('')
    setCurrentPage(1)
  }

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await toggleNewsStatus(id)
      if (response.success) {
        // Update the local state instead of reloading all news
        setAllNews(prevNews => 
          prevNews.map(item => 
            item._id === id 
              ? { ...item, isActive: !item.isActive }
              : item
          )
        )
        toast.success('News status updated successfully')
      }
    } catch (error) {
      console.error('Error toggling status:', error)
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) return

    try {
      await deleteNews(id)
      // Update the local state instead of reloading all news
      setAllNews(prevNews => prevNews.filter(item => item._id !== id))
      toast.success('News deleted successfully')
    } catch (error) {
      console.error('Error deleting news:', error)
      toast.error('Failed to delete news')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading && allNews.length === 0) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading news...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">News & Events</h1>
          <p className="text-gray-600">Manage news articles and events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/webdata">
              Back to Web Data
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/webdata/news/add">
              Add News
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search news by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* News List */}
      <div className="grid gap-6">
        {currentNews.map((item: NewsItem) => (
          <Card key={item._id} className="overflow-hidden">
            <div className="flex">
              <div className="w-48 h-32 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-image.svg';
                  }}
                />
              </div>
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="secondary">{item.type}</Badge>
                      <Badge variant="outline">{item.subType}</Badge>
                      <Badge variant={item.isActive ? 'default' : 'destructive'}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(item._id!)}
                    >
                      {item.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/webdata/news/view/${item._id}`}>
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/webdata/news/edit/${item._id}`}>
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item._id!)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Date: {formatDate(item.date)} at {item.time}</span>
                  <span>Tags: {item.tags.join(', ')}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={!hasPrevPage}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages} ({totalNews} total items)
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={!hasNextPage}
          >
            Next
          </Button>
        </div>
      )}

      {currentNews.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No news items found.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/webdata/news/add">
              Add First News Item
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
} 