import { apiClient, handleApiResponse } from '@/lib/api-config';

export type LifeAtInframeSection = {
  _id?: string;
  sectionType: 'hero' | 'welcome' | 'services' | 'clubs' | 'sports' | 'events' | 'gallery' | 'tour';
  title: string;
  description?: string;
  content?: string;
  images?: string[];
  order: number;
  isActive: boolean;
};

export type StudentService = {
  _id?: string;
  title: string;
  description: string;
  icon?: string;
  order: number;
};

export type CampusEvent = {
  _id?: string;
  title: string;
  description: string;
  category: 'arts-culture' | 'sports-recreation' | 'organizations';
  image?: string;
  order: number;
};

export type GalleryImage = {
  _id?: string;
  title: string;
  imageUrl: string;
  category: string;
  order: number;
};

export type SportsFacility = {
  _id?: string;
  name: string;
  description?: string;
  image: string;
  category?: string;
};

export type StudentClub = {
  _id?: string;
  name: string;
  category: 'arts' | 'sports' | 'academic' | 'cultural';
  description: string;
  image?: string;
  order: number;
};

// Life at Inframe Sections API
export async function getLifeAtInframeSections() {
  try {
    const response = await apiClient.get('/lifeatinframesection/getlifeatinframesections');
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching life at inframe sections:', error);
    throw error;
  }
}

export async function getLifeAtInframeSectionById(id: string) {
  try {
    const response = await apiClient.get(`/lifeatinframesection/getlifeatinframesectionbyid/${id}`);
    return handleApiResponse(response);
  } catch (error: any) {
    if (error.status === 404) {
      return null;
    }
    console.error('Error fetching life at inframe section:', error);
    throw error;
  }
}

export async function updateLifeAtInframeSection(id: string, data: LifeAtInframeSection) {
  try {
    const response = await apiClient.put(`/lifeatinframesection/updatelifeatinframesection/${id}`, data);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error updating life at inframe section:', error);
    throw error;
  }
}

export async function addLifeAtInframeSection(data: LifeAtInframeSection) {
  try {
    const response = await apiClient.post('/lifeatinframesection/addlifeatinframesection', data);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error creating life at inframe section:', error);
    throw error;
  }
}

export async function deleteLifeAtInframeSection(id: string) {
  try {
    await apiClient.delete(`/lifeatinframesection/deletelifeatinframesection/${id}`);
  } catch (error) {
    console.error('Error deleting life at inframe section:', error);
    throw error;
  }
}

// Student Services API
export async function getStudentServices() {
  try {
    const response = await apiClient.get('/studentservice/getstudentservices');
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching student services:', error);
    throw error;
  }
}

export async function addStudentService(data: StudentService) {
  try {
    const response = await apiClient.post('/studentservice/addstudentservice', data);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error creating student service:', error);
    throw error;
  }
}

export async function updateStudentService(id: string, data: StudentService) {
  try {
    const response = await apiClient.put(`/studentservice/updatestudentservice/${id}`, data);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error updating student service:', error);
    throw error;
  }
}

export async function deleteStudentService(id: string) {
  try {
    await apiClient.delete(`/studentservice/deletestudentservice/${id}`);
  } catch (error) {
    console.error('Error deleting student service:', error);
    throw error;
  }
}

// Student Clubs API
export async function getStudentClubs() {
  try {
    const response = await apiClient.get('/studentclub/getstudentclubs');
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching student clubs:', error);
    throw error;
  }
}

export async function addStudentClub(data: StudentClub) {
  try {
    const response = await apiClient.post('/studentclub/addstudentclub', data);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error creating student club:', error);
    throw error;
  }
}

export async function updateStudentClub(id: string, data: StudentClub) {
  try {
    const response = await apiClient.put(`/studentclub/updatestudentclub/${id}`, data);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error updating student club:', error);
    throw error;
  }
}

export async function deleteStudentClub(id: string) {
  try {
    await apiClient.delete(`/studentclub/deletestudentclub/${id}`);
  } catch (error) {
    console.error('Error deleting student club:', error);
    throw error;
  }
}

// Campus Events API
export async function getCampusEvents() {
  try {
    const response = await apiClient.get('/campusevent/getcampusevents');
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching campus events:', error);
    throw error;
  }
}

export async function addCampusEvent(data: CampusEvent) {
  try {
    const response = await apiClient.post('/campusevent/addcampusevent', data);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error creating campus event:', error);
    throw error;
  }
}

export async function updateCampusEvent(id: string, data: CampusEvent) {
  try {
    const response = await apiClient.put(`/campusevent/updatecampusevent/${id}`, data);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error updating campus event:', error);
    throw error;
  }
}

export async function deleteCampusEvent(id: string) {
  try {
    await apiClient.delete(`/campusevent/deletecampusevent/${id}`);
  } catch (error) {
    console.error('Error deleting campus event:', error);
    throw error;
  }
}

// Gallery Images API
export async function getGalleryImages() {
  try {
    const response = await apiClient.get('/galleryimage/getgalleryimages');
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    throw error;
  }
}

export async function addGalleryImage(data: GalleryImage) {
  try {
    const response = await apiClient.post('/galleryimage/addgalleryimage', data);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error creating gallery image:', error);
    throw error;
  }
}

export async function updateGalleryImage(id: string, data: GalleryImage) {
  try {
    const response = await apiClient.put(`/galleryimage/updategalleryimage/${id}`, data);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    throw error;
  }
}

export async function deleteGalleryImage(id: string) {
  try {
    await apiClient.delete(`/galleryimage/deletegalleryimage/${id}`);
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    throw error;
  }
}

// Sports Facilities API
export async function getSportsFacilities() {
  try {
    const response = await apiClient.get('/sportsfacility/getsportsfacilities');
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching sports facilities:', error);
    throw error;
  }
}

export async function addSportsFacility(data: SportsFacility) {
  try {
    const response = await apiClient.post('/sportsfacility/addsportsfacility', data);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error creating sports facility:', error);
    throw error;
  }
}

export async function updateSportsFacility(id: string, data: SportsFacility) {
  try {
    const response = await apiClient.put(`/sportsfacility/updatesportsfacility/${id}`, data);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error updating sports facility:', error);
    throw error;
  }
}

export async function deleteSportsFacility(id: string) {
  try {
    await apiClient.delete(`/sportsfacility/deletesportsfacility/${id}`);
  } catch (error) {
    console.error('Error deleting sports facility:', error);
    throw error;
  }
}
