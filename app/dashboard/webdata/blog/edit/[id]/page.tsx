"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { uploadToCloudinary } from '@/utils/cloudinary'
import {
  getBlogPostById,
  updateBlogPost,
  generateSlug,
  type BlogPost,
  type BlogPostData,
  type BlogSection
} from '../../apis'

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const heroImageInputRef = useRef<HTMLInputElement>(null)
  const authorImageInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<BlogPostData>({
    title: '',
    excerpt: '',
    heroImage: '',
    category: '',
    date: '',
    readTime: '',
    author: {
      name: '',
      image: ''
    },
    sections: [],
    relatedPosts: [],
    status: 'draft',
    isPublished: false,
    isDraft: true,
    publishedAt: undefined,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    canonicalUrl: ''
  })

  const loadBlogPost = useCallback(async () => {
    try {
      setInitialLoading(true)
      console.log('Loading blog post with ID:', id) // Debug log
      const post = await getBlogPostById(id)
      console.log('Loaded blog post:', post) // Debug log
      if (post) {
        setBlogPost(post)
        setFormData({
          title: post.title,
          excerpt: post.excerpt,
          heroImage: post.heroImage,
          category: post.category,
          date: post.date,
          readTime: post.readTime,
          author: post.author,
          sections: post.sections,
          relatedPosts: post.relatedPosts,
          status: post.status || 'draft',
          isPublished: post.isPublished || false,
          isDraft: post.isDraft !== undefined ? post.isDraft : true,
          publishedAt: post.publishedAt,
          metaTitle: post.metaTitle || '',
          metaDescription: post.metaDescription || '',
          metaKeywords: post.metaKeywords || '',
          canonicalUrl: post.canonicalUrl || ''
        })
      } else {
        toast.error('Blog post not found')
        router.push('/dashboard/webdata/blog')
      }
    } catch (error) {
      console.error('Error loading blog post:', error)
      toast.error('Failed to load blog post. Please check if the backend is running.')
    } finally {
      setInitialLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    if (id) {
      loadBlogPost()
    }
  }, [id, loadBlogPost])

  const handleInputChange = (field: keyof BlogPostData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAuthorChange = (field: keyof BlogPostData['author'], value: string) => {
    setFormData(prev => ({
      ...prev,
      author: {
        ...prev.author,
        [field]: value
      }
    }))
  }

  const handleSectionChange = (index: number, field: keyof BlogSection, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      )
    }))
  }

  const addSection = () => {
    const newSection: BlogSection = {
      id: `section-${Date.now()}`,
      title: '',
      content: ''
    }
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }))
  }

  const removeSection = (index: number) => {
    if (formData.sections.length <= 1) {
      toast.error('At least one section is required')
      return
    }
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }))
  }

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const imageUrl = await uploadToCloudinary(file)
      handleInputChange('heroImage', imageUrl)
      toast.success('Hero image uploaded successfully')
    } catch (error) {
      console.error('Error uploading hero image:', error)
      if (error instanceof Error) {
        if (error.message.includes('File must be an image')) {
          toast.error('Please select an image file')
        } else if (error.message.includes('File size must be less than 5MB')) {
          toast.error('Image size must be less than 5MB')
        } else if (error.message.includes('Missing Cloudinary configuration')) {
          toast.error('Server configuration error. Please contact support.')
        } else {
          toast.error('Failed to upload image. Please try again.')
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setUploading(false)
    }
  }

  const handleSectionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, sectionIndex: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const imageUrl = await uploadToCloudinary(file)
      handleSectionChange(sectionIndex, 'image', imageUrl)
      toast.success('Section image uploaded successfully')
    } catch (error) {
      console.error('Error uploading section image:', error)
      if (error instanceof Error) {
        if (error.message.includes('File must be an image')) {
          toast.error('Please select an image file')
        } else if (error.message.includes('File size must be less than 5MB')) {
          toast.error('Image size must be less than 5MB')
        } else if (error.message.includes('Missing Cloudinary configuration')) {
          toast.error('Server configuration error. Please contact support.')
        } else {
          toast.error('Failed to upload image. Please try again.')
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setUploading(false)
    }
  }

  const handleAuthorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const imageUrl = await uploadToCloudinary(file)
      handleAuthorChange('image', imageUrl)
      toast.success('Author image uploaded successfully')
    } catch (error) {
      console.error('Error uploading author image:', error)
      if (error instanceof Error) {
        if (error.message.includes('File must be an image')) {
          toast.error('Please select an image file')
        } else if (error.message.includes('File size must be less than 5MB')) {
          toast.error('Image size must be less than 5MB')
        } else if (error.message.includes('Missing Cloudinary configuration')) {
          toast.error('Server configuration error. Please contact support.')
        } else {
          toast.error('Failed to upload image. Please try again.')
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setUploading(false)
    }
  }

  const validateForm = () => {
    // Validate title
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return false
    }

    if (formData.title.trim().length < 10) {
      toast.error('Title must be at least 10 characters long')
      return false
    }

    // Validate excerpt
    if (!formData.excerpt.trim()) {
      toast.error('Excerpt is required')
      return false
    }

    if (formData.excerpt.trim().length < 10) {
      toast.error('Excerpt must be at least 10 characters long')
      return false
    }

    if (!formData.heroImage.trim()) {
      toast.error('Hero image is required')
      return false
    }

    if (!formData.category.trim()) {
      toast.error('Category is required')
      return false
    }

    // Validate sections
    if (formData.sections.length === 0) {
      toast.error('At least one content section is required')
      return false
    }

    for (let i = 0; i < formData.sections.length; i++) {
      const section = formData.sections[i]

      if (!section.title.trim()) {
        toast.error(`Section ${i + 1} title is required`)
        return false
      }

      if (!section.content.trim()) {
        toast.error(`Section ${i + 1} content is required`)
        return false
      }

      if (section.content.trim().length < 10) {
        toast.error(`Section ${i + 1} content must be at least 10 characters long`)
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent, status?: 'draft' | 'published') => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      // Update status if provided
      const submitData = status ? {
        ...formData,
        status,
        isPublished: status === 'published',
        isDraft: status === 'draft',
        publishedAt: status === 'published' && !formData.publishedAt ? new Date().toISOString() : formData.publishedAt
      } : formData

      await updateBlogPost(id, submitData)

      const statusMessage = status === 'draft' ? 'saved as draft' :
                           status === 'published' ? 'published' : 'updated'
      toast.success(`Blog post ${statusMessage} successfully!`)
      router.push('/dashboard/webdata/blog')
    } catch (error: unknown) {
      console.error('Error updating blog post:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update blog post')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
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
          <p className="text-gray-600 mb-6">The blog post you&apos;re trying to edit doesn&apos;t exist.</p>
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Blog Post</h1>
          <p className="text-gray-600">Update the blog post content</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/webdata/blog">
              Back to Blog
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/webdata/blog/${blogPost.slug}`}>
              Preview
            </Link>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update the basic details of your blog post</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title * (minimum 10 characters)</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter blog post title (minimum 10 characters)"
                required
                className={formData.title.trim().length > 0 && formData.title.trim().length < 10 ? 'border-red-500' : ''}
              />
              <div className="flex justify-between items-center mt-1">
                <div>
                  {formData.title && (
                    <p className="text-sm text-gray-500">
                      Slug: {generateSlug(formData.title)}
                    </p>
                  )}
                </div>
                <p className={`text-sm ${formData.title.trim().length < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                  {formData.title.trim().length}/10 characters
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt * (minimum 10 characters)</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                placeholder="Brief description of the blog post (minimum 10 characters)"
                rows={3}
                required
                className={formData.excerpt.trim().length > 0 && formData.excerpt.trim().length < 10 ? 'border-red-500' : ''}
              />
              <p className={`text-sm mt-1 ${formData.excerpt.trim().length < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                {formData.excerpt.trim().length}/10 characters
              </p>
            </div>

            <div>
              <Label htmlFor="heroImage">Hero Image *</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="heroImage"
                    value={formData.heroImage}
                    onChange={(e) => handleInputChange('heroImage', e.target.value)}
                    placeholder="https://example.com/image.jpg or upload below"
                    className="flex-1"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => heroImageInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
                <Input
                  ref={heroImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageUpload}
                  className="hidden"
                />
                {uploading && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    Uploading image to Cloudinary...
                  </div>
                )}
                {formData.heroImage && (
                  <div className="mt-2">
                    <img
                      src={formData.heroImage}
                      alt="Hero image preview"
                      className="w-32 h-20 object-cover rounded border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-image.svg';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="e.g., Education, Career"
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  placeholder="February 28, 2025"
                />
              </div>
              <div>
                <Label htmlFor="readTime">Read Time</Label>
                <Input
                  id="readTime"
                  value={formData.readTime}
                  onChange={(e) => handleInputChange('readTime', e.target.value)}
                  placeholder="5 min read"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Author Information */}
        <Card>
          <CardHeader>
            <CardTitle>Author Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="authorName">Author Name</Label>
                <Input
                  id="authorName"
                  value={formData.author.name}
                  onChange={(e) => handleAuthorChange('name', e.target.value)}
                  placeholder="Author name"
                />
              </div>
              <div>
                <Label htmlFor="authorImage">Author Image</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="authorImage"
                      value={formData.author.image}
                      onChange={(e) => handleAuthorChange('image', e.target.value)}
                      placeholder="https://example.com/author.jpg or upload below"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => authorImageInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                  <Input
                    ref={authorImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAuthorImageUpload}
                    className="hidden"
                  />
                  {formData.author.image && (
                    <div className="mt-2">
                      <img
                        src={formData.author.image}
                        alt="Author image preview"
                        className="w-16 h-16 object-cover rounded-full border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.svg';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO & Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>SEO & Metadata</CardTitle>
            <CardDescription>Optimize your blog post for search engines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="metaTitle">Meta Title (Optional)</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle || ''}
                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                placeholder="SEO title (if different from main title)"
                maxLength={60}
              />
              <p className="text-sm text-gray-500 mt-1">
                {(formData.metaTitle || '').length}/60 characters - Recommended: 50-60 characters
              </p>
            </div>

            <div>
              <Label htmlFor="metaDescription">Meta Description (Optional)</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription || ''}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                placeholder="Brief description for search engines (if different from excerpt)"
                rows={3}
                maxLength={160}
              />
              <p className="text-sm text-gray-500 mt-1">
                {(formData.metaDescription || '').length}/160 characters - Recommended: 150-160 characters
              </p>
            </div>

            <div>
              <Label htmlFor="metaKeywords">Meta Keywords (Optional)</Label>
              <Input
                id="metaKeywords"
                value={formData.metaKeywords || ''}
                onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate keywords with commas. Example: education, design school, career
              </p>
            </div>

            <div>
              <Label htmlFor="canonicalUrl">Canonical URL (Optional)</Label>
              <Input
                id="canonicalUrl"
                value={formData.canonicalUrl || ''}
                onChange={(e) => handleInputChange('canonicalUrl', e.target.value)}
                placeholder="https://www.inframeschool.com/blog/your-post-slug"
              />
              <p className="text-sm text-gray-500 mt-1">
                The canonical URL for this post (helps prevent duplicate content issues)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Publishing Status */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing Status</CardTitle>
            <CardDescription>Update the publishing status of this blog post</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as 'draft' | 'published' | 'archived')}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                {formData.status === 'draft' && 'Save as draft - not visible to public'}
                {formData.status === 'published' && 'Published - visible to public'}
                {formData.status === 'archived' && 'Archived - not visible to public'}
              </p>
            </div>
            {formData.publishedAt && (
              <div>
                <Label>Published Date</Label>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(formData.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Sections */}
        <Card>
          <CardHeader>
            <CardTitle>Content Sections</CardTitle>
            <CardDescription>Edit sections to structure your blog post content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.sections.map((section, index) => (
              <div key={section.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Section {index + 1}</h4>
                  {formData.sections.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSection(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <div>
                  <Label htmlFor={`section-title-${index}`}>Section Title *</Label>
                  <Input
                    id={`section-title-${index}`}
                    value={section.title}
                    onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                    placeholder="Section title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor={`section-content-${index}`}>Content * (minimum 10 characters)</Label>
                  <Textarea
                    id={`section-content-${index}`}
                    value={section.content}
                    onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                    placeholder="Section content (minimum 10 characters)"
                    rows={6}
                    required
                    className={section.content.trim().length > 0 && section.content.trim().length < 10 ? 'border-red-500' : ''}
                  />
                  <p className={`text-sm mt-1 ${section.content.trim().length < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                    {section.content.trim().length}/10 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor={`section-image-${index}`}>Section Image (Optional)</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        id={`section-image-${index}`}
                        value={section.image || ''}
                        onChange={(e) => handleSectionChange(index, 'image', e.target.value)}
                        placeholder="https://example.com/section-image.jpg or upload below"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const input = document.createElement('input')
                          input.type = 'file'
                          input.accept = 'image/*'
                          input.onchange = (e) => handleSectionImageUpload(e as unknown as React.ChangeEvent<HTMLInputElement>, index)
                          input.click()
                        }}
                        disabled={uploading}
                      >
                        {uploading ? 'Uploading...' : 'Upload'}
                      </Button>
                    </div>
                    {section.image && (
                      <div className="mt-2">
                        <img
                          src={section.image}
                          alt="Section image preview"
                          className="w-32 h-20 object-cover rounded border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.svg';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`section-quote-${index}`}>Quote (Optional)</Label>
                    <Input
                      id={`section-quote-${index}`}
                      value={section.quote || ''}
                      onChange={(e) => handleSectionChange(index, 'quote', e.target.value)}
                      placeholder="Inspirational quote"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`section-quote-author-${index}`}>Quote Author (Optional)</Label>
                    <Input
                      id={`section-quote-author-${index}`}
                      value={section.quoteAuthor || ''}
                      onChange={(e) => handleSectionChange(index, 'quoteAuthor', e.target.value)}
                      placeholder="Quote author"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`section-highlight-title-${index}`}>Highlight Title (Optional)</Label>
                  <Input
                    id={`section-highlight-title-${index}`}
                    value={section.highlightTitle || ''}
                    onChange={(e) => handleSectionChange(index, 'highlightTitle', e.target.value)}
                    placeholder="Title for highlights section"
                  />
                </div>

                <div>
                  <Label htmlFor={`section-highlights-${index}`}>Highlights (Optional)</Label>
                  <Textarea
                    id={`section-highlights-${index}`}
                    value={section.highlights?.join('\n') || ''}
                    onChange={(e) => handleSectionChange(index, 'highlights', e.target.value.split('\n').filter(h => h.trim()))}
                    placeholder="Enter each highlight on a new line"
                    rows={4}
                  />
                  <p className="text-sm text-gray-500 mt-1">Enter each highlight on a new line</p>
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addSection}>
              Add Section
            </Button>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/webdata/blog">
              Cancel
            </Link>
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save as Draft'}
          </Button>
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, 'published')}
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Publish Now'}
          </Button>
        </div>
      </form>
    </div>
  )
}
