"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import Link from 'next/link'
import { getNewsById, toggleNewsStatus, deleteNews, type NewsItem } from '../../apis'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ViewNewsPage({ params }: PageProps) {
  const [news, setNews] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [newsId, setNewsId] = useState<string>('')

  useEffect(() => {
    const loadNews = async () => {
      try {
        const { id } = await params
        setNewsId(id)
        await loadNewsData(id)
      } catch (error) {
        console.error('Error loading news:', error)
        toast.error('Failed to load news data')
      } finally {
        setLoading(false)
      }
    }

    loadNews()
  }, [params])

  const loadNewsData = async (id: string) => {
    try {
      const response = await getNewsById(id)
      if (response.success && response.data) {
        setNews(response.data)
      }
    } catch (error) {
      console.error('Error loading news data:', error)
      toast.error('Failed to load news data')
    }
  }

  const handleToggleStatus = async () => {
    if (!news) return

    try {
      await toggleNewsStatus(news._id!)
      toast.success('News status updated successfully')
      await loadNewsData(news._id!)
    } catch (error) {
      console.error('Error toggling status:', error)
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async () => {
    if (!news) return

    if (!confirm('Are you sure you want to delete this news item?')) return

    try {
      await deleteNews(news._id!)
      toast.success('News deleted successfully')
      // Redirect to news list
      window.location.href = '/dashboard/webdata/news'
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

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading news...</div>
        </div>
      </div>
    )
  }

  if (!news) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">News not found.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/webdata/news">
              Back to News
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">View News</h1>
          <p className="text-gray-600">News article details</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/webdata/news">
              Back to News
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/webdata/news/edit/${newsId}`}>
              Edit News
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={handleToggleStatus}
          >
            {news.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Main News Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{news.title}</CardTitle>
                <div className="flex gap-2 mb-2">
                  <Badge variant="secondary">{news.type}</Badge>
                  <Badge variant="outline">{news.subType}</Badge>
                  <Badge variant={news.isActive ? 'default' : 'destructive'}>
                    {news.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image */}
            <div>
              <img
                src={news.image}
                alt={news.title}
                className="w-full max-w-2xl h-64 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-image.svg';
                }}
              />
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{news.description}</p>
            </div>

            {/* Point Details */}
            {news.pointdetails && news.pointdetails.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Key Points</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {news.pointdetails.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Date</h3>
                <p className="text-gray-700">{formatDate(news.date)}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Time</h3>
                <p className="text-gray-700">{news.time}</p>
              </div>
            </div>

            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {news.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Created:</span> {news.createdAt ? formatDate(news.createdAt) : 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span> {news.updatedAt ? formatDate(news.updatedAt) : 'N/A'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 