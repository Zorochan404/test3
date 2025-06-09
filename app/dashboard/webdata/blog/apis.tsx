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
}

export interface BlogPost extends BlogPostData {
  id: string;
  _id?: string; // Optional MongoDB _id for backward compatibility
  slug: string;
}

// API functions now connect directly to backend endpoints

// Mock data removed - now using actual API endpoints

// API Functions
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch('https://backend-rakj.onrender.com/api/v1/blog/getblogs');

    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    // Replace with actual API call
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/blog/getblogbyid/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Blog post not found
      }
      throw new Error('Failed to fetch blog post');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw error;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Replace with actual API call
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/blog/getblogbyslug/${slug}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Blog post not found
      }
      throw new Error('Failed to fetch blog post');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
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

    const response = await fetch('https://backend-rakj.onrender.com/api/v1/blog/addblog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blogPostPayload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create blog post');
    }

    const result = await response.json();
    return result.data;

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

    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/blog/updateblog/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blogPostPayload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update blog post');
    }

    const result = await response.json();
    return result.data;

  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
}

export async function deleteBlogPost(id: string): Promise<void> {
  try {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/blog/deleteblog/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete blog post');
    }
  } catch (error) {
    console.error('Error deleting blog post:', error);
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
