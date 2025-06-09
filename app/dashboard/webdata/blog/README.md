# Blog Management System

This is a comprehensive blog management system for the Inframe School website. It allows administrators to create, edit, view, and manage blog posts through an intuitive dashboard interface.

## Features

### 📝 Blog Post Management
- **Create New Posts**: Add new blog posts with rich content sections
- **Edit Existing Posts**: Update blog post content and metadata
- **Delete Posts**: Remove unwanted blog posts
- **Preview Posts**: View how posts will appear on the website

### 🔍 Search & Filter
- **Search**: Find blog posts by title or excerpt
- **Category Filter**: Filter posts by category (Education, Career, Facilities, etc.)
- **Real-time Filtering**: Instant results as you type

### 📖 Rich Content Structure
- **Hero Image**: Main banner image for the blog post
- **Multiple Sections**: Organize content into structured sections
- **Images**: Add images to individual sections
- **Quotes**: Include inspirational quotes with attribution
- **Highlights**: Create bullet-point highlights with custom titles
- **Related Posts**: Link to related blog content

### 👤 Author Management
- **Author Information**: Set author name and profile image
- **Consistent Branding**: Default to "Inframe School Team"

### 🎨 SEO-Friendly
- **Auto-generated Slugs**: URL-friendly slugs from titles
- **Meta Information**: Category, date, read time
- **Structured Content**: Organized sections for better readability

## File Structure

```
app/dashboard/webdata/blog/
├── page.tsx                    # Main blog listing page
├── apis.tsx                    # API functions and TypeScript types
├── add/
│   └── page.tsx               # Add new blog post page
├── edit/
│   └── [id]/
│       └── page.tsx           # Edit existing blog post page
├── [slug]/
│   └── page.tsx               # Individual blog post preview page
└── README.md                  # This documentation file

lib/
└── blog-data.ts               # Blog data structure and types
```

## Usage

### Accessing the Blog Management

1. Navigate to `/dashboard/webdata/blog` in your admin dashboard
2. You'll see a list of all blog posts with search and filter options
3. Use the "Add New Post" button to create new content

### Creating a New Blog Post

1. Click "Add New Post" from the main blog page
2. Fill in the basic information:
   - **Title**: The main title of your blog post
   - **Excerpt**: A brief description (appears in listings)
   - **Hero Image**: Main banner image URL
   - **Category**: Post category (Education, Career, etc.)
   - **Date**: Publication date
   - **Read Time**: Estimated reading time

3. Set author information (defaults to Inframe School Team)

4. Add content sections:
   - **Section Title**: Heading for the section
   - **Content**: Main text content (supports line breaks)
   - **Section Image**: Optional image for the section
   - **Quote**: Optional inspirational quote
   - **Quote Author**: Attribution for the quote
   - **Highlight Title**: Title for bullet points
   - **Highlights**: Bullet points (one per line)

5. Click "Create Blog Post" to save

### Editing a Blog Post

1. From the main blog page, click "Edit" on any blog post
2. Modify any fields as needed
3. Add or remove sections using the "Add Section" and "Remove" buttons
4. Click "Update Blog Post" to save changes

### Viewing a Blog Post

1. Click "View" on any blog post to see the preview
2. This shows exactly how the post will appear on the website
3. Use the "Edit Post" button to make changes

## API Integration

The system is designed to work with a backend API. Currently, it uses mock data for development, but you can easily integrate with your backend by updating the API functions in `apis.tsx`.

### Expected API Endpoints

- `GET /api/v1/blog/posts` - Get all blog posts
- `GET /api/v1/blog/posts/:id` - Get blog post by ID
- `GET /api/v1/blog/posts/slug/:slug` - Get blog post by slug
- `POST /api/v1/blog/posts` - Create new blog post
- `PUT /api/v1/blog/posts/:id` - Update blog post
- `DELETE /api/v1/blog/posts/:id` - Delete blog post

### Data Structure

The blog post data follows this TypeScript interface:

```typescript
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  heroImage: string;
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    image: string;
  };
  sections: Array<{
    id: string;
    title: string;
    content: string;
    image?: string;
    quote?: string;
    quoteAuthor?: string;
    highlights?: string[];
    highlightTitle?: string;
  }>;
  relatedPosts: Array<{
    id: string;
    title: string;
    image: string;
    category: string;
  }>;
}
```

## Styling

The blog management system uses:
- **Tailwind CSS** for styling
- **shadcn/ui components** for consistent UI elements
- **Responsive design** that works on all devices
- **Hover effects** and smooth transitions

## Image Handling

Currently, the system expects image URLs. For production use, consider integrating with:
- **Cloudinary** for image uploads and optimization
- **AWS S3** for file storage
- **Local file upload** with proper validation

## Future Enhancements

Potential improvements for the blog system:
- **Rich text editor** (WYSIWYG) for content editing
- **Image upload integration** with Cloudinary
- **Draft/Published status** for posts
- **Tags system** in addition to categories
- **Comment management** if comments are enabled
- **Analytics integration** for post performance
- **Bulk operations** (delete multiple posts)
- **Import/Export** functionality

## Support

For questions or issues with the blog management system, please refer to the main application documentation or contact the development team.
