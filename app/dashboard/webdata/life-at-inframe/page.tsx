"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LifeAtInframePage() {
  const sections = [
    {
      title: "Hero Section",
      description: "Main banner and introduction text for Life at Inframe",
      link: "/dashboard/webdata/life-at-inframe/hero",
      icon: "🎯"
    },
    {
      title: "Welcome Section", 
      description: "Campus life introduction and welcome message",
      link: "/dashboard/webdata/life-at-inframe/welcome",
      icon: "👋"
    },
    {
      title: "Student Services",
      description: "Academic Support, Career Development, Student Wellness",
      link: "/dashboard/webdata/life-at-inframe/services",
      icon: "🎓"
    },
    {
      title: "Student Clubs & Societies",
      description: "Arts & Creative, Sports, Academic, Cultural clubs",
      link: "/dashboard/webdata/life-at-inframe/clubs",
      icon: "🏆"
    },
    {
      title: "Sports Arena",
      description: "Sports facilities and arena information",
      link: "/dashboard/webdata/life-at-inframe/sports",
      icon: "⚽"
    },
   
    {
      title: "Campus Gallery",
      description: "Manage campus images and photo gallery",
      link: "/dashboard/webdata/life-at-inframe/gallery",
      icon: "📸"
    },
    
  ]

  return (
    <div className="p-6">
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-3xl font-bold'>Life at Inframe</h1>
          <p className='text-gray-600 mt-2'>Manage content for the Life at Inframe website section</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="https://www.inframeschool.com/lifeatinframe" target="_blank" rel="noopener noreferrer">
              View Live Site
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

      
    </div>
  )
}
