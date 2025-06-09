"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { uploadToCloudinary } from '@/utils/cloudinary'
import {
  createDownload,
  getDownloads,
  formatFileSize,
  validatePDFFile,
  DEFAULT_DOWNLOAD_CATEGORIES,
  type DownloadItemData
} from '../apis'

export default function AddDownloadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [showCustomCategory, setShowCustomCategory] = useState(false)
  const [customCategoryName, setCustomCategoryName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<DownloadItemData>({
    title: '',
    description: '',
    category: '',
    fileUrl: '',
    fileName: '',
    fileSize: '',
    uploadDate: new Date().toISOString().split('T')[0],
    downloadCount: 0,
    isActive: true
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const downloads = await getDownloads()
      // Extract unique categories from existing downloads
      const existingCategories = downloads.map(download => download.category).filter(Boolean)
      const uniqueCategories = Array.from(new Set([...DEFAULT_DOWNLOAD_CATEGORIES, ...existingCategories]))
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error loading categories:', error)
      // Fall back to default categories
      setCategories(DEFAULT_DOWNLOAD_CATEGORIES)
    }
  }

  const handleCreateNewCategory = () => {
    if (!customCategoryName.trim()) {
      toast.error('Category name is required')
      return
    }

    if (customCategoryName.trim().length < 3) {
      toast.error('Category name must be at least 3 characters long')
      return
    }

    // Check if category already exists (case-insensitive)
    if (categories.some(cat => cat.toLowerCase() === customCategoryName.trim().toLowerCase())) {
      toast.error('Category with this name already exists')
      return
    }

    // Add new category to the list
    const newCategory = customCategoryName.trim()
    setCategories(prev => [...prev, newCategory])

    // Select the new category and close the input
    handleInputChange('category', newCategory)
    setCustomCategoryName('')
    setShowCustomCategory(false)
    toast.success('Category added successfully!')
  }

  const handleCategoryChange = (value: string) => {
    if (value === 'add-new-category') {
      setShowCustomCategory(true)
      setCustomCategoryName('')
    } else {
      setShowCustomCategory(false)
      handleInputChange('category', value)
    }
  }

  const handleInputChange = (field: keyof DownloadItemData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Validate PDF file
      validatePDFFile(file)
      
      setUploading(true)
      
      // Upload to Cloudinary
      const fileUrl = await uploadToCloudinary(file)
      
      // Update form data with file information
      setFormData(prev => ({
        ...prev,
        fileUrl,
        fileName: file.name,
        fileSize: formatFileSize(file.size)
      }))
      
      toast.success('PDF uploaded successfully to Cloudinary')
    } catch (error) {
      console.error('Error uploading PDF:', error)
      if (error instanceof Error) {
        if (error.message.includes('Only PDF files are allowed')) {
          toast.error('Please select a PDF file')
        } else if (error.message.includes('File size must be less than 10MB')) {
          toast.error('PDF size must be less than 10MB')
        } else if (error.message.includes('Missing Cloudinary configuration')) {
          toast.error('Server configuration error. Please contact support.')
        } else {
          toast.error('Failed to upload PDF. Please try again.')
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate title
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }
    
    if (formData.title.trim().length < 3) {
      toast.error('Title must be at least 3 characters long')
      return
    }
    
    // Validate description
    if (!formData.description.trim()) {
      toast.error('Description is required')
      return
    }
    
    if (formData.description.trim().length < 10) {
      toast.error('Description must be at least 10 characters long')
      return
    }

    if (!formData.category) {
      toast.error('Category is required')
      return
    }

    if (!formData.fileUrl) {
      toast.error('PDF file is required')
      return
    }

    try {
      setLoading(true)
      await createDownload(formData)
      toast.success('Download created successfully!')
      router.push('/dashboard/webdata/download')
    } catch (error: unknown) {
      console.error('Error creating download:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create download')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Add New Download</h1>
          <p className="text-gray-600">Create a new downloadable resource</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/webdata/download">
            Back to Downloads
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the basic details of your download</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title * (minimum 3 characters)</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter download title (minimum 3 characters)"
                required
                className={formData.title.trim().length > 0 && formData.title.trim().length < 3 ? 'border-red-500' : ''}
              />
              <p className={`text-sm mt-1 ${formData.title.trim().length < 3 ? 'text-red-500' : 'text-gray-500'}`}>
                {formData.title.trim().length}/3 characters
              </p>
            </div>

            <div>
              <Label htmlFor="description">Description * (minimum 10 characters)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of the download (minimum 10 characters)"
                rows={3}
                required
                className={formData.description.trim().length > 0 && formData.description.trim().length < 10 ? 'border-red-500' : ''}
              />
              <p className={`text-sm mt-1 ${formData.description.trim().length < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                {formData.description.trim().length}/10 characters
              </p>
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              {!showCustomCategory ? (
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                  <option value="add-new-category" className="font-medium text-blue-600">
                    + Add New Category
                  </option>
                </select>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={customCategoryName}
                      onChange={(e) => setCustomCategoryName(e.target.value)}
                      placeholder="Enter new category name (min 3 characters)"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleCreateNewCategory()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleCreateNewCategory}
                      disabled={customCategoryName.trim().length < 3}
                      size="sm"
                    >
                      Add
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCustomCategory(false)
                        setCustomCategoryName('')
                      }}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                  <p className={`text-sm ${customCategoryName.trim().length < 3 ? 'text-red-500' : 'text-gray-500'}`}>
                    {customCategoryName.trim().length}/3 characters
                  </p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="uploadDate">Upload Date</Label>
              <Input
                id="uploadDate"
                type="date"
                value={formData.uploadDate}
                onChange={(e) => handleInputChange('uploadDate', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle>PDF File Upload</CardTitle>
            <CardDescription>Upload your PDF file to Cloudinary (Max 10MB)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fileUrl">PDF File *</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="fileUrl"
                    value={formData.fileUrl}
                    onChange={(e) => handleInputChange('fileUrl', e.target.value)}
                    placeholder="PDF URL will appear here after upload"
                    className="flex-1"
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload PDF'}
                  </Button>
                </div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {uploading && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    Uploading PDF to Cloudinary...
                  </div>
                )}
                {formData.fileUrl && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">📄</span>
                      <div>
                        <p className="text-sm font-medium text-green-800">{formData.fileName}</p>
                        <p className="text-xs text-green-600">Size: {formData.fileSize}</p>
                        <a 
                          href={formData.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Preview PDF
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/webdata/download">
              Cancel
            </Link>
          </Button>
          <Button type="submit" disabled={loading || uploading}>
            {loading ? 'Creating...' : 'Create Download'}
          </Button>
        </div>
      </form>
    </div>
  )
}
