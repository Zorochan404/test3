# Download Management System

This is a comprehensive download management system for the Inframe School website, based on the structure from https://www.inframeschool.com/download. It allows administrators to manage downloadable resources like PDFs, documents, and other files through an intuitive dashboard interface.

## Features

### 📁 Download Management
- **Create New Downloads**: Add new downloadable resources with PDF upload
- **Edit Existing Downloads**: Update download information and replace files
- **Delete Downloads**: Remove unwanted downloads
- **Preview Downloads**: View PDF files directly in browser

### 🔍 Search & Filter
- **Search**: Find downloads by title or description
- **Category Filter**: Filter by predefined categories from the website
- **Real-time Filtering**: Instant results as you type

### 📄 PDF Upload Integration
- **Cloudinary Upload**: Direct PDF upload to Cloudinary
- **File Validation**: PDF type and size validation (10MB limit)
- **Automatic Metadata**: File name and size extraction
- **Preview Functionality**: Direct PDF preview links

### 📊 Download Categories

Based on the live website structure:
- Entrance Exam Schedule
- Previous Year Sample Papers
- Newsletters
- Brochure/Prospectus
- Placement Partner Documents
- Club Documents
- Scholarship and Discount

## File Structure

```
app/dashboard/webdata/download/
├── page.tsx                    # Main download listing page
├── apis.tsx                    # API functions and TypeScript types
├── add/
│   └── page.tsx               # Add new download page
├── edit/
│   └── [id]/
│       └── page.tsx           # Edit existing download page
└── README.md                  # This documentation file
```

## Usage

### Accessing Download Management

1. Navigate to `/dashboard/webdata/download` in your admin dashboard
2. You'll see a list of all downloads with search and filter options
3. Use the "Add New Download" button to create new resources

### Creating a New Download

1. Click "Add New Download" from the main download page
2. Fill in the basic information:
   - **Title**: Name of the download (minimum 3 characters)
   - **Description**: Brief description (minimum 10 characters)
   - **Category**: Select from predefined categories
   - **Upload Date**: Date of upload (defaults to today)

3. Upload PDF file:
   - Click "Upload PDF" button
   - Select a PDF file (max 10MB)
   - File will be uploaded to Cloudinary automatically
   - URL, filename, and size will be populated automatically

4. Click "Create Download" to save

### Editing a Download

1. From the main download page, click "Edit" on any download
2. Modify any fields as needed
3. Optionally replace the PDF file using "Replace PDF" button
4. Click "Update Download" to save changes

### Download Features

Each download item displays:
- **Title and Description**: Basic information
- **Category Badge**: Visual category indicator
- **Status Badge**: Active/Inactive status
- **File Information**: Filename and size
- **Statistics**: Upload date and download count
- **Actions**: Preview, Edit, Delete buttons

## API Integration

The system integrates with your backend API. Update the API endpoints in `apis.tsx` to match your backend structure.

### Expected API Endpoints

- `GET /api/v1/download/getdownloads` - Get all downloads
- `GET /api/v1/download/getdownloadbyid/:id` - Get download by ID
- `POST /api/v1/download/adddownload` - Create new download
- `PUT /api/v1/download/updatedownload/:id` - Update download
- `DELETE /api/v1/download/deletedownload/:id` - Delete download

### Data Structure

```typescript
interface DownloadItem {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;        // Cloudinary URL
  fileName: string;       // Original filename
  fileSize: string;       // Formatted size (e.g., "2.5 MB")
  uploadDate: string;     // YYYY-MM-DD format
  downloadCount: number;  // Number of downloads
  isActive: boolean;      // Active/inactive status
}
```

## PDF Upload Workflow

1. **User selects PDF file** from their device
2. **File validation** checks type and size
3. **Upload to Cloudinary** using existing configuration
4. **Cloudinary URL** is stored in the database
5. **Backend receives** only the URL, not the file itself

This follows your preferred pattern of uploading files to Cloudinary first, then sharing URLs with the backend.

## Validation Rules

### Title Validation
- **Required**: Must not be empty
- **Minimum Length**: 3 characters
- **Real-time feedback**: Character counter and visual indicators

### Description Validation
- **Required**: Must not be empty
- **Minimum Length**: 10 characters
- **Real-time feedback**: Character counter and visual indicators

### File Validation
- **File Type**: Only PDF files allowed
- **File Size**: Maximum 10MB
- **Required**: File URL must be present

## Error Handling

Comprehensive error handling for:
- **Invalid file types**: Clear message for non-PDF files
- **File size limits**: Warning for files over 10MB
- **Upload failures**: Network and Cloudinary errors
- **API errors**: Backend communication issues
- **Validation errors**: Form field validation

## User Experience Features

### Visual Feedback
- **Upload progress**: Spinning loader during upload
- **Success notifications**: Toast messages for successful operations
- **Error messages**: Clear, actionable error descriptions
- **File previews**: PDF preview with file information
- **Status indicators**: Active/inactive badges

### Responsive Design
- **Mobile-friendly**: Works on all device sizes
- **Grid layout**: Responsive card grid for downloads
- **Touch-friendly**: Large buttons and touch targets

## Integration with Live Website

The system is designed to match the structure of https://www.inframeschool.com/download:

- **Same categories**: Matches the 7 categories from the live site
- **Similar layout**: Card-based design with clear categorization
- **Professional appearance**: Consistent with the website's design language

## Security Considerations

- **File type validation**: Only PDF files accepted
- **Size limits**: Prevents large file uploads
- **Cloudinary integration**: Secure file hosting
- **URL validation**: Ensures valid Cloudinary URLs

## Future Enhancements

Potential improvements:
- **Bulk upload**: Multiple file upload at once
- **Download analytics**: Track download statistics
- **File versioning**: Keep multiple versions of files
- **Access control**: User-based download permissions
- **Automatic categorization**: AI-based category suggestions
- **File compression**: Automatic PDF optimization

## Support

For questions or issues with the download management system, please refer to the main application documentation or contact the development team.

The system is ready for production use and follows the same patterns as other sections of your application.
