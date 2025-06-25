// Course API functions and types

export interface CourseProgram {
  _id?: string;
  title: string;
  duration: string;
  description: string;
  imageUrl: string; // Required by backend
  detailsUrl: string; // Required by backend
  order: number; // Required by backend
  isActive: boolean;
}

export interface CourseFeature {
  _id?: string;
  title: string;
  description: string;
  imageUrl?: string;
  order: number;
}

export interface CourseTestimonial {
  _id?: string;
  studentName: string;
  studentImage?: string;
  testimonialText: string;
  youtubeUrl?: string;
  course?: string;
  batch?: string;
  order: number;
  isActive: boolean;
}

export interface CourseFAQ {
  _id?: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export interface CourseCurriculum {
  _id?: string;
  year: string;
  semester: string;
  subjects: string[];
  description?: string;
  imageUrl?: string;
  order: number;
}

export interface CourseSoftware {
  _id?: string;
  name: string;
  logoUrl: string;
  description?: string;
  order: number;
}

export interface CourseCareerProspect {
  _id?: string;
  title: string;
  roles: string[];
  description?: string;
  order: number;
}

export interface Course {
  _id?: string;
  slug: string; // e.g., "interior-design", "fashion-design"
  title: string; // e.g., "Interior Design", "Fashion Design"
  description: string;
  heroImage: string;
  programs: CourseProgram[];
  features: CourseFeature[];
  testimonials: CourseTestimonial[];
  faqs: CourseFAQ[];
  curriculum: CourseCurriculum[];
  software: CourseSoftware[];
  careerProspects: CourseCareerProspect[];
  ctaTitle: string;
  ctaDescription: string;
  brochurePdfUrl?: string; // Changed from brochureUrl to brochurePdfUrl
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt?: string;
  updatedAt?: string;
}

import { apiClient, handleApiResponse } from '@/lib/api-config';

// API Base URL
const API_BASE_URL = 'https://backend-rakj.onrender.com/api/v1/courses';

// Course CRUD Operations
export async function getCourses(): Promise<Course[]> {
  try {
    const response = await apiClient.get('/courses');
    return handleApiResponse<Course[]>(response);
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const response = await apiClient.get(`/courses/slug/${slug}`);
    return handleApiResponse<Course>(response);
  } catch (error: any) {
    if (error.status === 404) {
      return null;
    }
    console.error('Error fetching course by slug:', error);
    throw error;
  }
}

export async function getCourseById(id: string): Promise<Course | null> {
  try {
    const response = await apiClient.get(`/courses/${id}`);
    return handleApiResponse<Course>(response);
  } catch (error: any) {
    if (error.status === 404) {
      return null;
    }
    console.error('Error fetching course by ID:', error);
    throw error;
  }
}

export async function createCourse(data: Omit<Course, '_id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
  try {
    const response = await apiClient.post('/courses', data);
    return handleApiResponse<Course>(response);
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
}

export async function updateCourse(id: string, data: Partial<Course>): Promise<Course> {
  try {
    const response = await apiClient.put(`/courses/${id}`, data);
    return handleApiResponse<Course>(response);
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
}

export async function deleteCourse(id: string): Promise<void> {
  try {
    await apiClient.delete(`/courses/${id}`);
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
}

// Course Program Operations
export async function addCourseProgram(courseId: string, program: Omit<CourseProgram, '_id'>): Promise<CourseProgram> {
  try {
    const response = await apiClient.post(`/courses/${courseId}/programs`, program);
    return handleApiResponse<CourseProgram>(response);
  } catch (error) {
    console.error('Error adding course program:', error);
    throw error;
  }
}

export async function updateCourseProgram(courseId: string, programId: string, data: Partial<CourseProgram>): Promise<CourseProgram> {
  try {
    const response = await apiClient.put(`/courses/${courseId}/programs/${programId}`, data);
    return handleApiResponse<CourseProgram>(response);
  } catch (error) {
    console.error('Error updating course program:', error);
    throw error;
  }
}

export async function deleteCourseProgram(courseId: string, programId: string): Promise<void> {
  try {
    await apiClient.delete(`/courses/${courseId}/programs/${programId}`);
  } catch (error) {
    console.error('Error deleting course program:', error);
    throw error;
  }
}

// Course Feature Operations
export async function addCourseFeature(courseId: string, feature: Omit<CourseFeature, '_id'>): Promise<CourseFeature> {
  try {
    const response = await apiClient.post(`/courses/${courseId}/features`, feature);
    return handleApiResponse<CourseFeature>(response);
  } catch (error) {
    console.error('Error adding course feature:', error);
    throw error;
  }
}

export async function updateCourseFeature(courseId: string, featureId: string, data: Partial<CourseFeature>): Promise<CourseFeature> {
  try {
    const response = await apiClient.put(`/courses/${courseId}/features/${featureId}`, data);
    return handleApiResponse<CourseFeature>(response);
  } catch (error) {
    console.error('Error updating course feature:', error);
    throw error;
  }
}

export async function deleteCourseFeature(courseId: string, featureId: string): Promise<void> {
  try {
    await apiClient.delete(`/courses/${courseId}/features/${featureId}`);
  } catch (error) {
    console.error('Error deleting course feature:', error);
    throw error;
  }
}

// Testimonial Operations
export async function addCourseTestimonial(courseId: string, testimonial: Omit<CourseTestimonial, '_id'>): Promise<CourseTestimonial> {
  try {
    const response = await apiClient.post(`/courses/${courseId}/testimonials`, testimonial);
    return handleApiResponse<CourseTestimonial>(response);
  } catch (error) {
    console.error('Error adding course testimonial:', error);
    throw error;
  }
}

export async function updateCourseTestimonial(courseId: string, testimonialId: string, data: Partial<CourseTestimonial>): Promise<CourseTestimonial> {
  try {
    const response = await apiClient.put(`/courses/${courseId}/testimonials/${testimonialId}`, data);
    return handleApiResponse<CourseTestimonial>(response);
  } catch (error) {
    console.error('Error updating course testimonial:', error);
    throw error;
  }
}

export async function deleteCourseTestimonial(courseId: string, testimonialId: string): Promise<void> {
  try {
    await apiClient.delete(`/courses/${courseId}/testimonials/${testimonialId}`);
  } catch (error) {
    console.error('Error deleting course testimonial:', error);
    throw error;
  }
}

// FAQ Operations
export async function addCourseFAQ(courseId: string, faq: Omit<CourseFAQ, '_id'>): Promise<CourseFAQ> {
  try {
    const response = await apiClient.post(`/courses/${courseId}/faqs`, faq);
    return handleApiResponse<CourseFAQ>(response);
  } catch (error) {
    console.error('Error adding course FAQ:', error);
    throw error;
  }
}

export async function updateCourseFAQ(courseId: string, faqId: string, data: Partial<CourseFAQ>): Promise<CourseFAQ> {
  try {
    const response = await apiClient.put(`/courses/${courseId}/faqs/${faqId}`, data);
    return handleApiResponse<CourseFAQ>(response);
  } catch (error) {
    console.error('Error updating course FAQ:', error);
    throw error;
  }
}

export async function deleteCourseFAQ(courseId: string, faqId: string): Promise<void> {
  try {
    await apiClient.delete(`/courses/${courseId}/faqs/${faqId}`);
  } catch (error) {
    console.error('Error deleting course FAQ:', error);
    throw error;
  }
}

// Utility function to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Image upload utility function
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your_upload_preset'); // Replace with your Cloudinary upload preset

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, // Replace with your cloud name
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Default course data for common courses
export const defaultCourses = [
  {
    slug: 'interior-design',
    title: 'Interior Design',
    description: 'Transform spaces and create beautiful environments with our comprehensive interior design programs. Learn from industry experts and build a successful career in interior design.',
    heroImage: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1920&auto=format&fit=crop',
    programs: [
      {
        title: 'Bachelor of Design in Interior Design',
        duration: '4 Years Full-Time',
        description: 'Transform spaces and shape experiences through our comprehensive design program. Learn from industry experts and build a successful career in interior design.',
        imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
        detailsUrl: '/interior-design/bdes-in-interior-design',
        order: 1,
        isActive: true
      },
      {
        title: 'B.VOC in Interior Design',
        duration: '3 Years Full-Time',
        description: 'Combine practical skills with theoretical knowledge in our vocational bachelor\'s program. Perfect for hands-on learners ready to enter the industry.',
        imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6',
        detailsUrl: '/interior-design/bvoc-in-interior-design',
        order: 2,
        isActive: true
      },
      {
        title: 'B.SC in Interior Design',
        duration: '3 Years Full-Time',
        description: 'Master the technical aspects of interior design with our science-focused program. Ideal for analytical minds passionate about design.',
        imageUrl: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80',
        detailsUrl: '/interior-design/bsc-in-interior-design',
        order: 3,
        isActive: true
      }
    ],
    features: [
      {
        title: 'Industry-Relevant Curriculum',
        description: 'Our programs are designed in collaboration with industry experts to ensure you learn the most relevant skills and knowledge.',
        order: 1
      },
      {
        title: 'Experienced Faculty',
        description: 'Learn from industry professionals and experienced educators who bring real-world knowledge to the classroom.',
        order: 2
      },
      {
        title: 'Career Support',
        description: 'Get placement assistance, internship opportunities, and career guidance to help you succeed in your professional journey.',
        order: 3
      }
    ],
    ctaTitle: 'Ready to Start Your Journey?',
    ctaDescription: 'Take the first step towards a successful career in interior design. Apply now or contact us for more information.',
    testimonials: [],
    faqs: [],
    curriculum: [],
    software: [],
    careerProspects: [],
    isActive: true
  },
  {
    slug: 'fashion-design',
    title: 'Fashion Design',
    description: 'Unleash your creativity in the world of fashion. Our programs prepare you for a dynamic career in fashion design, from concept to runway.',
    heroImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1920&auto=format&fit=crop',
    programs: [
      {
        title: 'Bachelor of Design in Fashion Design',
        duration: '4 Years Full-Time',
        description: 'Shape the future of fashion through innovative design and creative expression.',
        imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
        detailsUrl: '/fashion-design/bdes-in-fashion-design',
        order: 1,
        isActive: true
      },
      {
        title: 'B.VOC in Fashion Design',
        duration: '3 Years Full-Time',
        description: 'Master practical fashion design skills with industry-focused training.',
        imageUrl: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d',
        detailsUrl: '/fashion-design/bvoc-in-fashion-design',
        order: 2,
        isActive: true
      },
      {
        title: 'B.SC in Fashion Design',
        duration: '3 Years Full-Time',
        description: 'Combine scientific knowledge with fashion design expertise.',
        imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
        detailsUrl: '/fashion-design/bsc-in-fashion-design',
        order: 3,
        isActive: true
      }
    ],
    features: [
      {
        title: 'Industry-Relevant Curriculum',
        description: 'Our programs are designed in collaboration with industry experts to ensure you learn the most relevant skills and knowledge.',
        order: 1
      },
      {
        title: 'Experienced Faculty',
        description: 'Learn from industry professionals and experienced educators who bring real-world knowledge to the classroom.',
        order: 2
      },
      {
        title: 'Career Support',
        description: 'Get placement assistance, internship opportunities, and career guidance to help you succeed in your professional journey.',
        order: 3
      }
    ],
    ctaTitle: 'Ready to Start Your Journey?',
    ctaDescription: 'Take the first step towards a successful career in fashion design. Apply now or contact us for more information.',
    testimonials: [],
    faqs: [],
    curriculum: [],
    software: [],
    careerProspects: [],
    isActive: true
  }
];
