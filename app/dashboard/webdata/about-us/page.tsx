"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function AboutUsPage() {
  const sections = [
    {
      title: "Hero Gallery",
      description: "Manage the image carousel at the top of the About Us page",
      link: "/dashboard/webdata/about-us/hero-gallery",
      icon: ""
    },
    {
      title: "Who We Are Section", 
      description: "Edit the main introduction and 'Who We Are' content",
      link: "/dashboard/webdata/about-us/who-we-are",
      icon: ""
    },
    {
      title: "About Us Content",
      description: "Manage the detailed About Us text content",
      link: "/dashboard/webdata/about-us/content",
      icon: ""
    },
    {
      title: "Statistics Section",
      description: "Edit Research Excellence, Global Network, and Innovation Hub stats",
      link: "/dashboard/webdata/about-us/statistics",
      icon: ""
    },
    {
      title: "Vision Section",
      description: "Update the Vision statement and content",
      link: "/dashboard/webdata/about-us/vision",
      icon: ""
    },
    {
      title: "Core Values",
      description: "Manage the Our Core Values section with images and descriptions",
      link: "/dashboard/webdata/about-us/core-values",
      icon: ""
    },
    {
      title: "Mission Section",
      description: "Edit the Mission statement and content",
      link: "/dashboard/webdata/about-us/mission",
      icon: ""
    },
    {
      title: "Campus Life Gallery",
      description: "Manage the Experience Campus Life image gallery",
      link: "/dashboard/webdata/about-us/campus-gallery",
      icon: ""
    },
    {
      title: "Core Values Text",
      description: "Edit the bottom Core Values text content",
      link: "/dashboard/webdata/about-us/core-values-text",
      icon: ""
    }
  ]

  return (
    <div className="p-6">
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-3xl font-bold'>About Us Management</h1>
          <p className='text-gray-600 mt-2'>Manage content for the About Us website page</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="https://www.inframeschool.com/about-us" target="_blank" rel="noopener noreferrer">
              View Live Page
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="text-2xl">{section.icon}</span>
                {section.title}
              </CardTitle>
              <CardDescription>
                {section.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={section.link}>
                <Button className="w-full">
                  Edit Content
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Overview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>About Us Page Overview</CardTitle>
          <CardDescription>Current structure of the About Us page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Page Sections</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Hero Image Carousel (12 images)</li>
                <li>• Who We Are introduction</li>
                <li>• About Us detailed content</li>
                <li>• Statistics (Research, Network, Innovation)</li>
                <li>• Vision statement</li>
                <li>• Core Values with images</li>
                <li>• Mission statement</li>
                <li>• Campus Life gallery</li>
                <li>• Core Values text content</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Content Guidelines</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Keep content engaging and informative</li>
                <li>• Use high-quality images (min 1200px width)</li>
                <li>• Maintain consistent tone and voice</li>
                <li>• Focus on student benefits and outcomes</li>
                <li>• Include specific achievements and numbers</li>
                <li>• Highlight unique selling propositions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
