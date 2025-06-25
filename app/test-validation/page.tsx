"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorDisplay } from '@/components/error-display'

export default function TestValidationPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: ''
  })
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Simulate the exact error response you're getting from your backend
  const simulateYourBackendError = async () => {
    setLoading(true)
    setError(null)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Create the exact error structure you showed
    const mockError = new Error('Please check your input and try again.')
    ;(mockError as any).details = [
      "Path `description` (`qwer`) is shorter than the minimum allowed length (10)."
    ]
    ;(mockError as any).errorType = 'VALIDATION'
    ;(mockError as any).status = 400
    ;(mockError as any).data = {
      success: false,
      error: "Please check your input and try again.",
      details: [
        "Path `description` (`qwer`) is shorter than the minimum allowed length (10)."
      ],
      errorType: "VALIDATION",
      statusCode: 400,
      timestamp: new Date().toISOString()
    }
    
    setError(mockError)
    setLoading(false)
  }

  const simulateMultipleValidationErrors = async () => {
    setLoading(true)
    setError(null)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockError = new Error('Please check your input and try again.')
    ;(mockError as any).details = [
      "Path `name` is required.",
      "Path `description` is shorter than the minimum allowed length (10).",
      "Path `email` must be a valid email address."
    ]
    ;(mockError as any).errorType = 'VALIDATION'
    ;(mockError as any).status = 400
    ;(mockError as any).data = {
      success: false,
      error: "Please check your input and try again.",
      details: [
        "Path `name` is required.",
        "Path `description` is shorter than the minimum allowed length (10).",
        "Path `email` must be a valid email address."
      ],
      errorType: "VALIDATION",
      statusCode: 400,
      timestamp: new Date().toISOString()
    }
    
    setError(mockError)
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Validation Error Display Test</CardTitle>
          <CardDescription>
            This demonstrates how your backend validation errors will be displayed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* This is where your validation errors will appear */}
          <ErrorDisplay error={error} onClose={() => setError(null)} />
          
          {/* Test form */}
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter a description (minimum 10 characters)"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
              />
            </div>
          </form>
          
          {/* Test buttons */}
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={simulateYourBackendError}
              disabled={loading}
              variant="destructive"
            >
              {loading ? 'Testing...' : 'Test Your Backend Error'}
            </Button>
            
            <Button 
              onClick={simulateMultipleValidationErrors}
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Testing...' : 'Test Multiple Validation Errors'}
            </Button>
          </div>
          
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">What you'll see now:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Red error box</strong> at the top of the form</li>
              <li>• <strong>Validation Error</strong> header</li>
              <li>• <strong>Direct validation details</strong> as bullet points (no main error message)</li>
              <li>• <strong>Close button (X)</strong> to dismiss the error</li>
              <li>• <strong>No more toast notifications</strong> in the bottom corner</li>
            </ul>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Key Changes:</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• <strong>Validation errors</strong> now show details directly instead of the main error message</li>
              <li>• <strong>Other errors</strong> still show the main message + additional details if available</li>
              <li>• <strong>Cleaner display</strong> - no redundant "Please check your input" message</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 