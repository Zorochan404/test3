"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";


const buttons = [
  { "link": "about-us", "title": "About Us" },
  { "link": "industry-and-placement-partner", "title": "Industry Placement Partner" },
  { "link": "session-login-details", "title": "Session Login Details" },
  { "link": "life-at-inframe", "title": "Life at Inframe" },
  { "link": "membership", "title": "Membership Placement Partner" },
  { "link": "testimonials", "title": "Testimonial" },
  { "link": "contact", "title": "Contact us" },
  { "link": "blog", "title": "Blogs" },
  { "link": "advisors", "title": "Advisor and Mentor" },
  { "link": "download", "title": "Downloads" },
  { "link": "enquiries", "title": "Enquiries" },
  { "link": "free-courses", "title": "Free Courses" },
  { "link": "careers", "title": "Careers" },
]

// const toSlug = (str: string) => str.toLowerCase().replace(/\s+/g, "-");


export default function Page() {
  return (
    <div>
      {buttons.map((button)=> 
      <Link key={button.link} href={`/dashboard/webdata/${button.link}`}>
      <Button className="mx-2 my-2">{button.title}</Button>
    </Link>
      )}
    </div>

  )
}