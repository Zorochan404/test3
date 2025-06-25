"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorDisplay } from '@/components/error-display'

export default function TestErrorHandlingPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: ''
  })
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Simulate API call that returns validation errors
  const simulateValidationError = async () => {
    setLoading(true)
    setError(null)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate the error response you showed
    const mockError = new Error('Please check your input and try again.')
    ;(mockError as any).details = [
      "Path `description` (`qwer`) is shorter than the minimum allowed length (10).",
      "Path `name` is required.",
      "Path `email` must be a valid email address."
    ]
    ;(mockError as any).errorType = 'VALIDATION'
    ;(mockError as any).status = 422
    
    setError(mockError)
    setLoading(false)
  }

  const simulateNetworkError = async () => {
    setLoading(true)
    setError(null)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockError = new Error('Network error. Please check your internet connection and try again.')
    ;(mockError as any).status = 0
    
    setError(mockError)
    setLoading(false)
  }

  const simulateServerError = async () => {
    setLoading(true)
    setError(null)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockError = new Error('Server error. Please try again later.')
    ;(mockError as any).status = 500
    
    setError(mockError)
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Error Handling Test</CardTitle>
          <CardDescription>
            Test different types of API errors and see how they are displayed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Display any errors */}
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
              onClick={simulateValidationError}
              disabled={loading}
              variant="destructive"
            >
              {loading ? 'Testing...' : 'Test Validation Error'}
            </Button>
            
            <Button 
              onClick={simulateNetworkError}
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Testing...' : 'Test Network Error'}
            </Button>
            
            <Button 
              onClick={simulateServerError}
              disabled={loading}
              variant="secondary"
            >
              {loading ? 'Testing...' : 'Test Server Error'}
            </Button>
          </div>
          
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Validation Error:</strong> Shows specific field validation issues</li>
              <li>• <strong>Network Error:</strong> Shows connection issues</li>
              <li>• <strong>Server Error:</strong> Shows server-side problems</li>
              <li>• <strong>Close Button:</strong> Click the X to dismiss errors</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 