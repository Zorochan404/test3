// Course Program Details API
import { buildApiUrl, getApiHeaders, apiClient, handleApiResponse } from '@/lib/api-config';

const API_BASE_URL = buildApiUrl('courses')

// Interfaces for Course Program Details
export interface AdmissionStep {
  _id?: string;
  stepNumber: number;
  icon: string; // emoji or icon class
  title: string;
  description: string;
  order: number;
}

export interface CurriculumYear {
  _id?: string;
  year: string; // "1st Year", "2nd Year", etc.
  semesters: CurriculumSemester[];
  imageUrl?: string;
  description?: string;
  order: number;
}

export interface CurriculumSemester {
  _id?: string;
  semester: string; // "Semester 1", "Semester 2"
  subjects: string[];
  order: number;
}

export interface SoftwareTool {
  _id?: string;
  name: string;
  logoUrl: string;
  description?: string;
  order: number;
}

export interface CareerPath {
  _id?: string;
  title: string; // "Interior Designer", "Design Consultant"
  roles: string[]; // ["Residential", "Commercial", "Hospitality"]
  description?: string;
  order: number;
}

export interface IndustryPartner {
  _id?: string;
  name: string;
  logoUrl: string;
  description?: string;
  order: number;
}

export interface ProgramHighlight {
  _id?: string;
  icon: string;
  title: string;
  description: string;
  order: number;
}

export interface CourseGalleryImage {
  _id?: string;
  imageUrl: string;
  caption?: string;
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

export interface CourseFeeBenefit {
  _id?: string;
  title: string;
  description: string;
  order: number;
}

export interface CourseEligibility {
  _id?: string;
  requirement: string;
  description?: string;
  order: number;
}

export interface CourseSchedule {
  _id?: string;
  type: string; // "Full-Time", "Part-Time", "Weekend"
  duration: string;
  schedule: string;
  description?: string;
  order: number;
}

export interface CourseProgram {
  _id?: string;

  // Basic Information
  slug: string; // "bdes-in-interior-design"
  title: string; // "Bachelor of Design in Interior Design"
  parentCourseSlug: string; // "interior-design"
  parentCourseTitle: string; // "Interior Design"

  // Hero Section
  heroImage: string;
  duration: string; // "4 Years Full-Time"
  description: string;
  shortDescription?: string;

  // Required by backend
  imageUrl: string; // Program image URL (required)
  detailsUrl: string; // Program details URL (required)
  order: number; // Display order (required)
  
  // Course Overview
  courseOverview: string;
  
  // Admission Process
  admissionSteps: AdmissionStep[];
  admissionQuote?: string;
  galleryImages: CourseGalleryImage[];
  
  // Program Highlights
  programHighlights: ProgramHighlight[];
  
  // Career Prospects
  careerPaths: CareerPath[];
  
  // Curriculum
  curriculum: CurriculumYear[];
  
  // Software & Tools
  softwareTools: SoftwareTool[];
  
  // Industry Partners
  industryPartners: IndustryPartner[];
  
  // Testimonials
  testimonials: CourseTestimonial[];
  
  // FAQs
  faqs: CourseFAQ[];
  
  // Fee & Benefits
  feeBenefits: CourseFeeBenefit[];
  
  // Fee Structure
  feeStructure?: FeeStructure;
  
  // Eligibility
  eligibility: CourseEligibility[];
  
  // Schedule Options
  scheduleOptions: CourseSchedule[];
  
  // CTA Section
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  
  // Settings
  isActive: boolean;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;

  courseId?: string;
  courseName?: string;
  courseSlug?: string;
}

// Fee Structure Interfaces
export interface EMIOption {
  _id?: string;
  months: number; // 3, 6, 12, 24, etc.
  monthlyAmount: number;
  totalAmount: number;
  processingFee?: number;
  interestRate?: number;
  isActive: boolean;
  order: number;
}

export interface CouponCode {
  _id?: string;
  code: string; // "SAVE20", "WELCOME50"
  discountType: 'percentage' | 'fixed'; // percentage or fixed amount
  discountValue: number; // 20 for 20% or 5000 for ₹5000
  minimumAmount?: number; // minimum purchase amount required
  maximumDiscount?: number; // maximum discount amount (for percentage)
  validFrom: string; // ISO date string
  validUntil: string; // ISO date string
  usageLimit?: number; // total number of times this coupon can be used
  usedCount: number; // number of times already used
  isActive: boolean;
  description?: string;
  order: number;
}

export interface FeeStructure {
  _id?: string;
  totalFee: number;
  monthlyFee?: number;
  yearlyFee?: number;
  processingFee?: number;
  registrationFee?: number;
  emiOptions: EMIOption[];
  discountPercentage?: number; // general discount percentage
  couponCodes: CouponCode[];
  paymentTerms?: string; // "50% upfront, 50% in 3 months"
  refundPolicy?: string;
  isActive: boolean;
  order: number;
}

// API Functions
export async function getCoursePrograms(): Promise<CourseProgram[]> {
  try {
    const response = await apiClient.get('/courses');
    const result = handleApiResponse<any[]>(response);
    
    // Extract programs from all courses
    const allPrograms: CourseProgram[] = [];
    
    result.forEach((course: any) => {
      if (course.programs && Array.isArray(course.programs)) {
        course.programs.forEach((program: any) => {
          allPrograms.push({
            ...program,
            courseId: course._id,
            courseName: course.name,
            courseSlug: course.slug
          });
        });
      }
    });
    
    return allPrograms;
  } catch (error) {
    console.error('Error fetching course programs:', error);
    throw error;
  }
}

export async function getCourseProgramById(id: string): Promise<CourseProgram | null> {
  try {
    const response = await apiClient.get('/courses');
    const courses = handleApiResponse<any[]>(response);
    
    // Search through all courses to find the program
    for (const course of courses) {
      if (course.programs && Array.isArray(course.programs)) {
        const program = course.programs.find((p: any) => p._id === id);
        if (program) {
          return {
            ...program,
            courseId: course._id,
            courseName: course.name,
            courseSlug: course.slug
          };
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching course program by ID:', error);
    return null;
  }
}

export async function getCourseProgramBySlug(parentSlug: string, programSlug: string): Promise<CourseProgram | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/${parentSlug}`, {
      headers: getApiHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch course: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    const course = result.data;
    
    if (course && course.programs && Array.isArray(course.programs)) {
      const program = course.programs.find((p: any) => p.slug === programSlug);
      if (program) {
        return {
          _id: program._id,
          slug: program.slug,
          title: program.title,
          parentCourseSlug: course.slug,
          parentCourseTitle: course.title,
          heroImage: program.imageUrl || course.heroImage,
          duration: program.duration,
          description: program.description,
          shortDescription: program.shortDescription,
          courseOverview: program.courseOverview,
          imageUrl: program.imageUrl,
          detailsUrl: program.detailsUrl,
          order: program.order,
          admissionSteps: program.admissionSteps || [],
          galleryImages: program.galleryImages || [],
          programHighlights: program.programHighlights || [],
          careerPaths: program.careerPaths || [],
          curriculum: program.curriculum || [],
          softwareTools: program.softwareTools || [],
          industryPartners: program.industryPartners || [],
          testimonials: program.testimonials || [],
          faqs: program.faqs || [],
          feeBenefits: program.feeBenefits || [],
          feeStructure: program.feeStructure || null,
          eligibility: program.eligibility || [],
          scheduleOptions: program.scheduleOptions || [],
          ctaTitle: program.ctaTitle || 'Ready to Start Your Journey?',
          ctaDescription: program.ctaDescription || 'Take the first step towards a successful career.',
          ctaButtonText: program.ctaButtonText || 'Apply Now',
          isActive: program.isActive,
          metaTitle: program.metaTitle,
          metaDescription: program.metaDescription,
          metaKeywords: program.metaKeywords,
          createdAt: program.createdAt,
          updatedAt: program.updatedAt,
          courseId: course._id,
          courseName: course.name,
          courseSlug: course.slug
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching course program by slug:', error);
    return null;
  }
}

export async function createCourseProgram(courseId: string, data: Omit<CourseProgram, '_id' | 'courseId' | 'courseName' | 'courseSlug'>): Promise<CourseProgram> {
  try {
    const response = await apiClient.post(`/courses/${courseId}/programs`, data);
    return handleApiResponse<CourseProgram>(response);
  } catch (error) {
    console.error('Error creating course program:', error);
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

// Fetch parent courses from backend
export async function getParentCourses(): Promise<{ _id?: string; slug: string; title: string }[]> {
  try {
    const response = await fetch(buildApiUrl('courses'), {
      headers: getApiHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch parent courses: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.success && result.data && Array.isArray(result.data)) {
      return result.data.map((course: any) => ({
      _id: course._id,
      slug: course.slug,
      title: course.title
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching parent courses:', error);
    // Fallback to mock data if API fails
    return [
      { slug: 'interior-design', title: 'Interior Design' },
      { slug: 'fashion-design', title: 'Fashion Design' },
      { slug: 'graphic-design', title: 'Graphic Design' },
      { slug: 'uiux-design', title: 'UI/UX Design' }
    ];
  }
}

// Get course ID by slug
export async function getCourseIdBySlug(slug: string): Promise<string | null> {
  try {
    const courses = await getParentCourses();
    const course = courses.find(c => c.slug === slug);
    return course?._id || course?.slug || null; // Fallback to slug if _id not available
  } catch (error) {
    console.error('Error getting course ID by slug:', error);
    return null;
  }
}

// Course Curriculum Operations
export async function addCourseCurriculum(courseId: string, curriculum: Omit<CurriculumYear, '_id'>): Promise<CurriculumYear> {
  try {
    const response = await fetch(`${API_BASE_URL}/${courseId}/curriculum`, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify(curriculum)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add course curriculum: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error adding course curriculum:', error);
    throw error;
  }
}

export async function updateCourseCurriculum(courseId: string, curriculumId: string, data: Partial<CurriculumYear>): Promise<CurriculumYear> {
  try {
    const response = await apiClient.put(`/courses/${courseId}/curriculum/${curriculumId}`, data);
    return handleApiResponse<CurriculumYear>(response);
  } catch (error) {
    console.error('Error updating course curriculum:', error);
    throw error;
  }
}

export async function deleteCourseCurriculum(courseId: string, curriculumId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/${courseId}/curriculum/${curriculumId}`, {
      method: 'DELETE',
      headers: getApiHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete course curriculum: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting course curriculum:', error);
    throw error;
  }
}

// Course Software Operations
export async function addCourseSoftware(courseId: string, software: Omit<SoftwareTool, '_id'>): Promise<SoftwareTool> {
  try {
    const response = await fetch(`${API_BASE_URL}/${courseId}/software`, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify(software)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add course software: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error adding course software:', error);
    throw error;
  }
}

export async function updateCourseSoftware(courseId: string, softwareId: string, data: Partial<SoftwareTool>): Promise<SoftwareTool> {
  try {
    const response = await fetch(`${API_BASE_URL}/${courseId}/software/${softwareId}`, {
      method: 'PUT',
      headers: getApiHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update course software: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating course software:', error);
    throw error;
  }
}

export async function deleteCourseSoftware(courseId: string, softwareId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/${courseId}/software/${softwareId}`, {
      method: 'DELETE',
      headers: getApiHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete course software: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting course software:', error);
    throw error;
  }
}

// Course Career Prospect Operations
export async function addCourseCareerProspect(courseId: string, careerProspect: Omit<CareerPath, '_id'>): Promise<CareerPath> {
  try {
    const response = await fetch(`${API_BASE_URL}/${courseId}/career-prospects`, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify(careerProspect)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add course career prospect: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error adding course career prospect:', error);
    throw error;
  }
}

export async function updateCourseCareerProspect(courseId: string, careerProspectId: string, data: Partial<CareerPath>): Promise<CareerPath> {
  try {
    const response = await fetch(`${API_BASE_URL}/${courseId}/career-prospects/${careerProspectId}`, {
      method: 'PUT',
      headers: getApiHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update course career prospect: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating course career prospect:', error);
    throw error;
  }
}

export async function deleteCourseCareerProspect(courseId: string, careerProspectId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/${courseId}/career-prospects/${careerProspectId}`, {
      method: 'DELETE',
      headers: getApiHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete course career prospect: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting course career prospect:', error);
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

// Generate slug from title using backend API
export async function generateSlugFromTitle(title: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-slug/${encodeURIComponent(title)}`, {
      headers: getApiHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to generate slug: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.slug || generateSlug(title); // Fallback to local function
  } catch (error) {
    console.error('Error generating slug from backend:', error);
    return generateSlug(title); // Fallback to local function
  }
}