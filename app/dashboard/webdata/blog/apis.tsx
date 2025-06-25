// Blog API functions and types

export interface BlogAuthor {
  name: string;
  image: string;
}

export interface BlogSection {
  id: string;
  title: string;
  content: string;
  image?: string;
  quote?: string;
  quoteAuthor?: string;
  highlights?: string[];
  highlightTitle?: string;
}

export interface RelatedPost {
  id: string;
  title: string;
  image: string;
  category: string;
}

export interface BlogPostData {
  title: string;
  excerpt: string;
  heroImage: string;
  category: string;
  date: string;
  readTime: string;
  author: BlogAuthor;
  sections: BlogSection[];
  relatedPosts: RelatedPost[];
  status: 'draft' | 'published' | 'archived';
  isPublished: boolean;
  isDraft: boolean;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
}

export interface BlogPost extends BlogPostData {
  id: string;
  _id?: string; // Optional MongoDB _id for backward compatibility
  slug: string;
}

import { apiClient, handleApiResponse } from '@/lib/api-config';

// API Functions
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await apiClient.get('/blog/getallblogs');
    const blogs = handleApiResponse<any[]>(response);

    // Ensure each blog has proper status field
    return blogs.map((blog: any) => ({
      ...blog,
      status: blog.status || (blog.isDraft ? 'draft' : (blog.isPublished ? 'published' : 'draft')),
      id: blog._id || blog.id,
      _id: blog._id
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const response = await apiClient.get(`/blog/getblogbyid/${id}`);
    return handleApiResponse<BlogPost>(response);
  } catch (error: any) {
    if (error.status === 404) {
        return null; // Blog post not found
    }
    console.error('Error fetching blog post:', error);
    throw error;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await apiClient.get(`/blog/getblogbyslug/${slug}`);
    return handleApiResponse<BlogPost>(response);
  } catch (error: any) {
    if (error.status === 404) {
        return null; // Blog post not found
    }
    console.error('Error fetching blog post by slug:', error);
    throw error;
  }
}

export async function createBlogPost(data: BlogPostData): Promise<BlogPost> {
  try {
    // Validate required fields
    if (!data.title || data.title.trim().length < 10) {
      throw new Error('Title must be at least 10 characters long');
    }

    if (!data.excerpt || data.excerpt.trim().length < 10) {
      throw new Error('Excerpt must be at least 10 characters long');
    }

    if (!data.sections || data.sections.length === 0) {
      throw new Error('At least one content section is required');
    }

    // Validate each section has minimum content length
    for (const section of data.sections) {
      if (!section.content || section.content.trim().length < 10) {
        throw new Error(`Section "${section.title}" content must be at least 10 characters long`);
      }
    }

    // Generate slug from title
    const slug = generateSlug(data.title);
    if (!slug) {
      throw new Error('Could not generate valid slug from title');
    }

    // Prepare data for API with slug
    const blogPostPayload = {
      ...data,
      slug,
      title: data.title.trim(),
      excerpt: data.excerpt.trim(),
      sections: data.sections.map(section => ({
        ...section,
        content: section.content.trim()
      }))
    };

    const response = await apiClient.post('/blog/addblog', blogPostPayload);
    return handleApiResponse<BlogPost>(response);
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
}

export async function updateBlogPost(id: string, data: BlogPostData): Promise<BlogPost> {
  try {
    // Validate required fields
    if (!data.title || data.title.trim().length < 10) {
      throw new Error('Title must be at least 10 characters long');
    }

    if (!data.excerpt || data.excerpt.trim().length < 10) {
      throw new Error('Excerpt must be at least 10 characters long');
    }

    if (!data.sections || data.sections.length === 0) {
      throw new Error('At least one content section is required');
    }

    // Validate each section has minimum content length
    for (const section of data.sections) {
      if (!section.content || section.content.trim().length < 10) {
        throw new Error(`Section "${section.title}" content must be at least 10 characters long`);
      }
    }

    // Prepare data for API
    const blogPostPayload = {
      ...data,
      title: data.title.trim(),
      excerpt: data.excerpt.trim(),
      sections: data.sections.map(section => ({
        ...section,
        content: section.content.trim()
      }))
    };

    const response = await apiClient.put(`/blog/updateblog/${id}`, blogPostPayload);
    return handleApiResponse<BlogPost>(response);
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
}

export async function deleteBlogPost(id: string): Promise<void> {
  try {
    await apiClient.delete(`/blog/deleteblog/${id}`);
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
}

export async function updateBlogPostStatus(id: string, status: 'draft' | 'published' | 'archived'): Promise<BlogPost> {
  try {
    let endpoint = '';
    let body = {};

    // Use the specific endpoints based on status
    switch (status) {
      case 'published':
        endpoint = `/blog/publishblog/${id}`;
        body = {
          isPublished: true,
          isDraft: false,
          status: 'published',
          publishedAt: new Date().toISOString()
        };
        break;
      case 'draft':
        endpoint = `/blog/saveblogasdraft/${id}`;
        body = {
          isPublished: false,
          isDraft: true,
          status: 'draft'
        };
        break;
      case 'archived':
        endpoint = `/blog/archiveblog/${id}`;
        body = {
          isPublished: false,
          isDraft: false,
          status: 'archived'
        };
        break;
      default:
        throw new Error('Invalid status');
    }

    const response = await apiClient.put(endpoint, body);
    return handleApiResponse<BlogPost>(response);
  } catch (error) {
    console.error('Error updating blog post status:', error);
    throw error;
  }
}

// Additional API functions to match backend endpoints
export async function getPublishedBlogs(): Promise<BlogPost[]> {
  try {
    const response = await apiClient.get('/blog/getpublishedblogs');
    return handleApiResponse<BlogPost[]>(response);
  } catch (error) {
    console.error('Error fetching published blogs:', error);
    throw error;
  }
}

export async function getDraftBlogs(): Promise<BlogPost[]> {
  try {
    const response = await apiClient.get('/blog/getdraftblogs');
    return handleApiResponse<BlogPost[]>(response);
  } catch (error) {
    console.error('Error fetching draft blogs:', error);
    throw error;
  }
}

export async function getBlogsByStatus(status: string): Promise<BlogPost[]> {
  try {
    const response = await apiClient.get(`/blog/getblogsbystatus/${status}`);
    return handleApiResponse<BlogPost[]>(response);
  } catch (error) {
    console.error(`Error fetching blogs by status ${status}:`, error);
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
