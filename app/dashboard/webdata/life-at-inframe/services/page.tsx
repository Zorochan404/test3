"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  StudentService,
  getStudentServices,
  addStudentService,
  updateStudentService,
  deleteStudentService
} from '../apis'

export default function StudentServicesPage() {
  const [services, setServices] = useState<StudentService[]>([])
  const [newService, setNewService] = useState<StudentService>({
    title: '',
    description: '',
    icon: '',
    order: 1
  })

  const [editingService, setEditingService] = useState<StudentService | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set())

  const toggleDescription = (serviceId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId)
      } else {
        newSet.add(serviceId)
      }
      return newSet
    })
  }

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  // Fetch services from backend on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setInitialLoading(true)
        const data = await getStudentServices()
        setServices((data as StudentService[]) || [])
        setNewService(prev => ({ ...prev, order: ((data as StudentService[])?.length || 0) + 1 }))
      } catch (error) {
        console.error('Error fetching services:', error)
        toast.error('Failed to load services')
      } finally {
        setInitialLoading(false)
      }
    }

    fetchServices()
  }, [])

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newService.title.trim() || !newService.description.trim()) {
      toast.error('Title and description are required')
      return
    }

    setLoading(true)
    try {
      const addedService = await addStudentService(newService)
      setServices(prev => [...prev, addedService as StudentService])
      setNewService({
        title: '',
        description: '',
        icon: '',
        order: services.length + 2
      })
      toast.success('Service added successfully')
    } catch (error) {
      console.error('Error adding service:', error)
      toast.error('Failed to add service')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingService || !editingService.title.trim() || !editingService.description.trim()) {
      toast.error('Title and description are required')
      return
    }

    if (!editingService._id) {
      toast.error('Service ID is required for update')
      return
    }

    setLoading(true)
    try {
      const updatedService = await updateStudentService(editingService._id, editingService)
      setServices(prev => prev.map(service =>
        service._id === editingService._id ? (updatedService as StudentService) : service
      ))
      setEditingService(null)
      toast.success('Service updated successfully')
    } catch (error) {
      console.error('Error updating service:', error)
      toast.error('Failed to update service')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return
    }

    try {
      await deleteStudentService(id)
      setServices(prev => prev.filter(service => service._id !== id))
      toast.success('Service deleted successfully')
    } catch (error) {
      console.error('Error deleting service:', error)
      toast.error('Failed to delete service')
    }
  }

  if (initialLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading services...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Student Services</h1>
          <p className="text-gray-600">Manage comprehensive student support services</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/webdata/life-at-inframe">
              Back to Overview
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://www.inframeschool.com/lifeatinframe#services" target="_blank" rel="noopener noreferrer">
              View Live
            </a>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="manage" className="space-y-6">
        <TabsList>
          <TabsTrigger value="manage">Manage Services</TabsTrigger>
          <TabsTrigger value="add">Add New Service</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-4">
          {services.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">No services found</h3>
                  <p className="text-gray-600 mb-4">Get started by adding your first student service.</p>
                  <Button onClick={() => (document.querySelector('[data-value="add"]') as HTMLElement)?.click()}>
                    Add First Service
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service._id} className="relative flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-2xl flex-shrink-0">{service.icon}</span>
                        <CardTitle className="text-lg break-words leading-tight line-clamp-2">{service.title}</CardTitle>
                      </div>
                      <Badge variant="secondary" className="flex-shrink-0">#{service.order}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col h-full">
                    <div className="mb-4 flex-grow">
                      <CardDescription className="text-sm leading-relaxed break-words">
                        {expandedDescriptions.has(service._id!)
                          ? service.description
                          : truncateText(service.description)
                        }
                      </CardDescription>
                      {service.description.length > 120 && (
                        <button
                          onClick={() => toggleDescription(service._id!)}
                          className="text-blue-600 hover:text-blue-800 text-xs mt-1 font-medium"
                        >
                          {expandedDescriptions.has(service._id!) ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingService(service)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteService(service._id!)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Student Service</CardTitle>
              <CardDescription>Create a new student support service</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddService} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Service Title *</Label>
                    <Input
                      id="title"
                      value={newService.title}
                      onChange={(e) => setNewService(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Academic Support"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon (Emoji)</Label>
                    <Input
                      id="icon"
                      value={newService.icon}
                      onChange={(e) => setNewService(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="🎓"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newService.description}
                    onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the service and how it helps students..."
                    rows={4}
                    required
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Keep descriptions concise for better card layout</span>
                    <span>{newService.description.length}/300 characters</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={newService.order}
                    onChange={(e) => setNewService(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                    min="1"
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Service'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Content Guidelines */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Content Guidelines</CardTitle>
              <CardDescription>Best practices for student service content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Title Guidelines</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Keep titles concise (2-4 words)</li>
                    <li>• Use clear, descriptive language</li>
                    <li>• Avoid abbreviations</li>
                    <li>• Maximum 30 characters recommended</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Description Guidelines</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Focus on student benefits</li>
                    <li>• Use active voice</li>
                    <li>• Keep under 200 characters for best display</li>
                    <li>• Include specific details about the service</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Service Modal/Form */}
      {editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Edit Service</CardTitle>
              <CardDescription>Update the service information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateService} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Service Title *</Label>
                    <Input
                      id="edit-title"
                      value={editingService.title}
                      onChange={(e) => setEditingService(prev => prev ? { ...prev, title: e.target.value } : null)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-icon">Icon (Emoji)</Label>
                    <Input
                      id="edit-icon"
                      value={editingService.icon}
                      onChange={(e) => setEditingService(prev => prev ? { ...prev, icon: e.target.value } : null)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description *</Label>
                  <Textarea
                    id="edit-description"
                    value={editingService.description}
                    onChange={(e) => setEditingService(prev => prev ? { ...prev, description: e.target.value } : null)}
                    rows={4}
                    required
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Keep descriptions concise for better card layout</span>
                    <span>{editingService.description.length}/300 characters</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-order">Display Order</Label>
                  <Input
                    id="edit-order"
                    type="number"
                    value={editingService.order}
                    onChange={(e) => setEditingService(prev => prev ? { ...prev, order: parseInt(e.target.value) || 1 } : null)}
                    min="1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Service'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setEditingService(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
