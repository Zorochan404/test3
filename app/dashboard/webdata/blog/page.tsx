"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  getBlogPosts,
  deleteBlogPost,
  updateBlogPostStatus,
  type BlogPost
} from './apis'

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    loadBlogPosts()
  }, [])

  const loadBlogPosts = async () => {
    try {
      setLoading(true)
      const posts = await getBlogPosts()
      console.log('Loaded blog posts:', posts) // Debug log
      setBlogPosts(posts)
    } catch (error) {
      console.error('Error loading blog posts:', error)
      toast.error('Failed to load blog posts. Please check if the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!id) {
      toast.error('Invalid blog post ID')
      return
    }

    if (!confirm('Are you sure you want to delete this blog post?')) return

    try {
      console.log('Deleting blog post with ID:', id) // Debug log
      await deleteBlogPost(id)
      toast.success('Blog post deleted successfully')
      loadBlogPosts()
    } catch (error: unknown) {
      console.error('Error deleting blog post:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete blog post')
    }
  }

  const handleStatusUpdate = async (id: string, status: 'draft' | 'published' | 'archived') => {
    if (!id) {
      toast.error('Invalid blog post ID')
      return
    }

    try {
      await updateBlogPostStatus(id, status)
      const statusMessage = status === 'published' ? 'published' :
                           status === 'draft' ? 'moved to draft' : 'archived'
      toast.success(`Blog post ${statusMessage} successfully`)
      loadBlogPosts()
    } catch (error: unknown) {
      console.error('Error updating blog post status:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update blog post status')
    }
  }

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category.toLowerCase() === selectedCategory.toLowerCase()

    // Improved status matching with fallback logic
    let postStatus = post.status;
    if (!postStatus) {
      // Fallback logic if status is not set
      if (post.isDraft) {
        postStatus = 'draft';
      } else if (post.isPublished) {
        postStatus = 'published';
      } else {
        postStatus = 'draft'; // Default to draft
      }
    }

    const matchesStatus = selectedStatus === 'all' || postStatus === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = ['all', ...Array.from(new Set(blogPosts.map(post => post.category.toLowerCase())))]
  const statuses = ['all', 'draft', 'published', 'archived']

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading blog posts...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Blog Management</h1>
          <p className="text-gray-600">Manage blog posts and articles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="https://www.inframeschool.com/blog" target="_blank" rel="noopener noreferrer">
              View Live
            </a>
          </Button>
          <Button asChild>
            <Link href="/dashboard/webdata/blog/add">
              Add New Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => {
          console.log('Rendering post:', post) // Debug log
          return (
          <Card key={post.id || post._id || post.slug} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              <img
                src={post.heroImage}
                alt={post.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-image.svg';
                }}
              />
              <div className="absolute top-2 left-2 flex gap-2">
                <Badge variant="secondary">{post.category}</Badge>
                <Badge
                  variant={
                    (() => {
                      const status = post.status || (post.isDraft ? 'draft' : (post.isPublished ? 'published' : 'draft'));
                      return status === 'published' ? 'default' : status === 'draft' ? 'outline' : 'destructive';
                    })()
                  }
                >
                  {(() => {
                    const status = post.status || (post.isDraft ? 'draft' : (post.isPublished ? 'published' : 'draft'));
                    return status.charAt(0).toUpperCase() + status.slice(1);
                  })()}
                </Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-2 text-lg">{post.title}</CardTitle>
              <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/dashboard/webdata/blog/${post.slug || post.id || post._id || 'unknown'}`}>
                      View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/dashboard/webdata/blog/edit/${post.id || post._id || 'unknown'}`}>
                      Edit
                    </Link>
                  </Button>
                </div>
                <div className="flex gap-2">
                  {(() => {
                    const status = post.status || (post.isDraft ? 'draft' : (post.isPublished ? 'published' : 'draft'));
                    return status === 'published' ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          const postId = post.id || post._id;
                          if (postId) handleStatusUpdate(postId, 'draft');
                        }}
                        className="flex-1"
                      >
                        Unpublish
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          const postId = post.id || post._id;
                          if (postId) handleStatusUpdate(postId, 'published');
                        }}
                        className="flex-1"
                      >
                        Publish
                      </Button>
                    );
                  })()}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const postId = post.id || post._id;
                      if (postId) handleDelete(postId);
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

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by creating your first blog post.'}
          </p>
          <Button asChild>
            <Link href="/dashboard/webdata/blog/add">
              Add New Post
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
