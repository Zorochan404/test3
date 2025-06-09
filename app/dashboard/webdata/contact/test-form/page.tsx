"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import ContactForm from '@/components/contact-form'

export default function TestContactFormPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Test Contact Form</h1>
          <p className="text-gray-600">Test the contact form functionality and see how submissions appear in the admin panel</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/contact">
            Back to Contact Submissions
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Form */}
        <div>
          <ContactForm 
            title="Contact Us"
            description="Fill out this form to test the contact submission system. Your submission will appear in the admin panel."
          />
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Test</CardTitle>
            <CardDescription>Follow these steps to test the contact form system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">1. Fill out the form</h4>
                <p className="text-sm text-gray-600">
                  Complete all required fields in the contact form on the left.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">2. Submit the form</h4>
                <p className="text-sm text-gray-600">
                  Click &quot;Send Message&quot; to submit your test contact form.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">3. Check the admin panel</h4>
                <p className="text-sm text-gray-600">
                  Go back to the Contact Submissions page to see your submission appear in the list.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">4. Manage submissions</h4>
                <p className="text-sm text-gray-600">
                  Test the status management features like marking as read or replied.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Integration Notes</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• This form can be embedded on your website</li>
                <li>• All submissions are stored in your backend database</li>
                <li>• You can manage submissions from the admin panel</li>
                <li>• Status tracking helps organize your responses</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
          <CardDescription>Backend endpoints used by the contact system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Contact Submission Endpoints</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <code>GET /api/v1/contact/getcontacts</code> - Fetch all submissions</li>
                <li>• <code>POST /api/v1/contact/addcontact</code> - Add new submission</li>
                <li>• <code>PUT /api/v1/contact/updatecontact/:id</code> - Update submission</li>
                <li>• <code>DELETE /api/v1/contact/deletecontact/:id</code> - Delete submission</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Data Structure</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>firstName</strong>: string (required)</li>
                <li>• <strong>lastName</strong>: string (required)</li>
                <li>• <strong>email</strong>: string (required)</li>
                <li>• <strong>message</strong>: string (required)</li>
                <li>• <strong>status</strong>: &quot;new&quot; | &quot;read&quot; | &quot;replied&quot;</li>
                <li>• <strong>submittedAt</strong>: ISO date string</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
