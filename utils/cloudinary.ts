export async function uploadToCloudinary(file: File): Promise<string> {
  // Validate file type (support both images and PDFs)
  const isImage = file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';

  if (!isImage && !isPDF) {
    throw new Error('File must be an image or PDF');
  }

  // Validate file size (10MB limit for PDFs, 5MB for images)
  const maxSize = isPDF ? 10 * 1024 * 1024 : 5 * 1024 * 1024; // 10MB for PDF, 5MB for images
  if (file.size > maxSize) {
    const maxSizeText = isPDF ? '10MB' : '5MB';
    throw new Error(`File size must be less than ${maxSizeText}`);
  }

  const formData = new FormData();
  formData.append('file', file);

  // Use different upload presets for images vs PDFs
  const uploadPreset = isPDF
    ? (process.env.NEXT_PUBLIC_CLOUDINARY_PDF_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'images_preset')
    : (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'images_preset');

  formData.append('upload_preset', uploadPreset);
  formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '');

  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPresetEnv = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

    if (!cloudName || !uploadPresetEnv || !apiKey) {
      throw new Error('Missing Cloudinary configuration. Please check your environment variables.');
    }

    console.log('Cloudinary upload config:', {
      cloudName,
      uploadPreset: uploadPreset,
      fileType: file.type,
      fileSize: file.size,
      isPDF,
      isImage
    });



    // Use different endpoints for images vs PDFs
    const uploadEndpoint = isPDF
      ? `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`
      : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const response = await fetch(uploadEndpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type header, let the browser set it with the boundary
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Cloudinary Upload Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        fileType: file.type,
        uploadEndpoint,
        uploadPreset
      });

      if (isPDF && response.status === 400) {
        throw new Error(`PDF upload failed. Please ensure your Cloudinary upload preset "${uploadPreset}" allows raw file uploads. Check your Cloudinary dashboard settings.`);
      }

      throw new Error(`Failed to upload file: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
} 