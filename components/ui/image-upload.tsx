"use client"

import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { uploadToCloudinary } from '@/utils/cloudinary'

interface ImageUploadProps {
  label: string
  value: string
  onChange: (url: string) => void
  placeholder?: string
  required?: boolean
  className?: string
  imageClassName?: string
  description?: string
  accept?: string
  disabled?: boolean
}

export function ImageUpload({
  label,
  value,
  onChange,
  placeholder = "https://example.com/image.jpg or upload below",
  required = false,
  className = "",
  imageClassName = "w-32 h-20 object-cover rounded border",
  description,
  accept = "image/*",
  disabled = false
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (accept === "image/*" && !file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    try {
      setUploading(true)
      const imageUrl = await uploadToCloudinary(file)
      onChange(imageUrl)
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={className}>
      <Label htmlFor={`image-${label.replace(/\s+/g, '-').toLowerCase()}`}>
        {label} {required && '*'}
      </Label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            id={`image-${label.replace(/\s+/g, '-').toLowerCase()}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
            required={required}
            disabled={disabled}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || disabled}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
        <Input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleImageUpload}
          className="hidden"
          disabled={disabled}
        />
        {uploading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            Uploading image to Cloudinary...
          </div>
        )}
        {value && (
          <div className="mt-2">
            <img
              src={value}
              alt={`${label} preview`}
              className={imageClassName}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-image.svg';
              }}
            />
          </div>
        )}
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
    </div>
  )
}

// Specialized variants for common use cases
export function HeroImageUpload({ value, onChange, disabled = false }: { 
  value: string; 
  onChange: (url: string) => void; 
  disabled?: boolean;
}) {
  return (
    <ImageUpload
      label="Hero Image"
      value={value}
      onChange={onChange}
      imageClassName="w-full max-w-md h-48 object-cover rounded border"
      description="Recommended: 1920x1080 pixels or higher, JPG/PNG format"
      disabled={disabled}
    />
  )
}

export function ProgramImageUpload({ value, onChange, disabled = false }: { 
  value: string; 
  onChange: (url: string) => void; 
  disabled?: boolean;
}) {
  return (
    <ImageUpload
      label="Program Image"
      value={value}
      onChange={onChange}
      imageClassName="w-32 h-20 object-cover rounded border"
      description="Recommended: 800x600 pixels, JPG/PNG format"
      disabled={disabled}
    />
  )
}

export function FeatureImageUpload({ value, onChange, disabled = false }: { 
  value: string; 
  onChange: (url: string) => void; 
  disabled?: boolean;
}) {
  return (
    <ImageUpload
      label="Feature Image (Optional)"
      value={value}
      onChange={onChange}
      imageClassName="w-32 h-20 object-cover rounded border"
      description="Optional: Icon or illustration for this feature"
      disabled={disabled}
    />
  )
}

export function StudentImageUpload({ value, onChange, disabled = false }: { 
  value: string; 
  onChange: (url: string) => void; 
  disabled?: boolean;
}) {
  return (
    <ImageUpload
      label="Student Image"
      value={value}
      onChange={onChange}
      imageClassName="w-16 h-16 object-cover rounded-full border"
      description="Student photo for testimonial"
      disabled={disabled}
    />
  )
}
