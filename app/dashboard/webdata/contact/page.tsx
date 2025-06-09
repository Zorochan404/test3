"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  getContactSubmissions,
  deleteContactSubmission,
  markContactAsRead,
  markContactAsReplied,
  type ContactSubmission
} from './apis'
import { formatDistanceToNow } from 'date-fns'

export default function ContactPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all')

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true)
        const data = await getContactSubmissions()
        setContacts(data || [])
      } catch (error) {
        console.error('Error fetching contact submissions:', error)
        setError('Failed to fetch contact submissions')
        toast.error('Failed to load contact submissions')
      } finally {
        setLoading(false)
      }
    }
    fetchContacts()
  }, [])

  const handleMarkAsRead = async (id: string) => {
    try {
      await markContactAsRead(id)
      setContacts(prev => prev.map(contact =>
        contact._id === id ? { ...contact, status: 'read' } : contact
      ))
      toast.success('Marked as read')
    } catch (error) {
      console.error('Error marking as read:', error)
      toast.error('Failed to mark as read')
    }
  }

  const handleMarkAsReplied = async (id: string) => {
    try {
      await markContactAsReplied(id)
      setContacts(prev => prev.map(contact =>
        contact._id === id ? { ...contact, status: 'replied' } : contact
      ))
      toast.success('Marked as replied')
    } catch (error) {
      console.error('Error marking as replied:', error)
      toast.error('Failed to mark as replied')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) {
      return
    }

    try {
      await deleteContactSubmission(id)
      setContacts(prev => prev.filter(contact => contact._id !== id))
      toast.success('Contact submission deleted')
    } catch (error) {
      console.error('Error deleting contact:', error)
      toast.error('Failed to delete contact submission')
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800'
      case 'read': return 'bg-yellow-100 text-yellow-800'
      case 'replied': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading contact submissions...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contact Submissions</h1>
          <p className="text-gray-600">Manage contact form submissions from your website</p>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="outline" asChild>
            <a href="/dashboard/contact/test-form">
              Test Contact Form
            </a>
          </Button>
          <Badge variant="secondary">
            Total: {contacts.length}
          </Badge>
          <Badge variant="destructive">
            New: {contacts.filter(c => c.status === 'new' || !c.status).length}
          </Badge>
        </div>
      </div>

      <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'new' | 'read' | 'replied')} className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All ({contacts.length})</TabsTrigger>
            <TabsTrigger value="new">New ({contacts.filter(c => c.status === 'new' || !c.status).length})</TabsTrigger>
            <TabsTrigger value="read">Read ({contacts.filter(c => c.status === 'read').length})</TabsTrigger>
            <TabsTrigger value="replied">Replied ({contacts.filter(c => c.status === 'replied').length})</TabsTrigger>
          </TabsList>

          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <TabsContent value={statusFilter} className="space-y-4">
          {filteredContacts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">No contact submissions found</h3>
                  <p className="text-gray-600">
                    {statusFilter === 'all'
                      ? 'No contact submissions have been received yet.'
                      : `No ${statusFilter} contact submissions found.`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredContacts.map((contact) => (
                <Card key={contact._id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {contact.firstName} {contact.lastName}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <span>{contact.email}</span>
                          <Badge className={getStatusColor(contact.status)} variant="secondary">
                            {contact.status || 'new'}
                          </Badge>
                        </CardDescription>
                      </div>
                      <div className="text-sm text-gray-500">
                        {contact.submittedAt && formatDistanceToNow(new Date(contact.submittedAt), { addSuffix: true })}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Message:</h4>
                      <p className="text-gray-700 leading-relaxed">{contact.message}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {(!contact.status || contact.status === 'new') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsRead(contact._id!)}
                        >
                          Mark as Read
                        </Button>
                      )}
                      {contact.status === 'read' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsReplied(contact._id!)}
                        >
                          Mark as Replied
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(contact._id!)}
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
      </Tabs>
    </div>
  )
}
