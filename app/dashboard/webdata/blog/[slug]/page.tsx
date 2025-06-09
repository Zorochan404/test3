"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getBlogPostBySlug, type BlogPost } from '../apis'

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  const loadBlogPost = useCallback(async () => {
    try {
      setLoading(true)
      console.log('Loading blog post with slug:', slug) // Debug log
      const post = await getBlogPostBySlug(slug)
      console.log('Loaded blog post by slug:', post) // Debug log
      setBlogPost(post)
    } catch (error) {
      console.error('Error loading blog post:', error)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    if (slug) {
      loadBlogPost()
    }
  }, [slug, loadBlogPost])

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading blog post...</div>
        </div>
      </div>
    )
  }

  if (!blogPost) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild>
            <Link href="/dashboard/webdata/blog">
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Blog Post Preview</h1>
          <p className="text-gray-600">Preview how this blog post will appear on the website</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/webdata/blog">
              Back to Blog
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/webdata/blog/edit/${blogPost.id || blogPost._id || 'unknown'}`}>
              Edit Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Blog Post Content */}
      <article className="space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <img
              src={blogPost.heroImage}
              alt={blogPost.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-image.svg';
              }}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">{blogPost.category}</Badge>
              <span className="text-sm text-gray-500">{blogPost.date}</span>
              <span className="text-sm text-gray-500">{blogPost.readTime}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {blogPost.title}
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              {blogPost.excerpt}
            </p>
            
            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <img
                src={blogPost.author.image}
                alt={blogPost.author.name}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-image.svg';
                }}
              />
              <div>
                <p className="font-medium text-gray-900">{blogPost.author.name}</p>
                <p className="text-sm text-gray-500">Author</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {blogPost.sections.map((section) => (
            <section key={section.id} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {section.title}
              </h2>
              
              {section.image && (
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.svg';
                    }}
                  />
                </div>
              )}
              
              <div className="prose prose-lg max-w-none">
                {section.content.split('\n').map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              {section.quote && (
                <blockquote className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-lg">
                  <p className="text-lg italic text-gray-800 mb-2">
                    &quot;{section.quote}&quot;
                  </p>
                  {section.quoteAuthor && (
                    <cite className="text-sm font-medium text-gray-600">
                      — {section.quoteAuthor}
                    </cite>
                  )}
                </blockquote>
              )}
              
              {section.highlights && section.highlights.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                  {section.highlightTitle && (
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {section.highlightTitle}
                    </h3>
                  )}
                  <ul className="space-y-2">
                    {section.highlights.map((highlight, hIndex) => (
                      <li key={hIndex} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Related Posts */}
        {blogPost.relatedPosts && blogPost.relatedPosts.length > 0 && (
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPost.relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-image.svg';
                      }}
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary">{relatedPost.category}</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-lg">
                      {relatedPost.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
