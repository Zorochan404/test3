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
    const response = await fetch('https://backend-rakj.onrender.com/api/v1/lifeatinframesection/getlifeatinframesections');

    if (!response.ok) {
        throw new Error(`Failed to fetch sections: ${response.status} ${response.statusText}`);
    }

    const sections = await response.json();
    return sections.data;
}

export async function getLifeAtInframeSectionById(id: string) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/lifeatinframesection/getlifeatinframesectionbyid/${id}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch section: ${response.status} ${response.statusText}`);
    }

    const section = await response.json();
    return section.data;
}

export async function updateLifeAtInframeSection(id: string, data: LifeAtInframeSection) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/lifeatinframesection/updatelifeatinframesection/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update section: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const section = await response.json();
    return section.data;
}

export async function addLifeAtInframeSection(data: LifeAtInframeSection) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/lifeatinframesection/addlifeatinframesection`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add section: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const section = await response.json();
    return section.data;
}

export async function deleteLifeAtInframeSection(id: string) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/lifeatinframesection/deletelifeatinframesection/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const section = await response.json();
    return section.data;
}

// Student Services API
export async function getStudentServices() {
    const response = await fetch('https://backend-rakj.onrender.com/api/v1/studentservice/getstudentservices');
    const services = await response.json();
    return services.data;
}

export async function addStudentService(data: StudentService) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/studentservice/addstudentservice`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to add service: ${response.statusText}`);
    }
    
    const service = await response.json();
    return service.data;
}

export async function updateStudentService(id: string, data: StudentService) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/studentservice/updatestudentservice/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to update service: ${response.statusText}`);
    }
    
    const service = await response.json();
    return service.data;
}

export async function deleteStudentService(id: string) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/studentservice/deletestudentservice/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const service = await response.json();
    return service.data;
}

// Student Clubs API
export async function getStudentClubs() {
    const response = await fetch('https://backend-rakj.onrender.com/api/v1/studentclub/getstudentclubs');

    if (!response.ok) {
        throw new Error(`Failed to fetch clubs: ${response.status} ${response.statusText}`);
    }

    const clubs = await response.json();
    return clubs.data;
}

export async function addStudentClub(data: StudentClub) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/studentclub/addstudentclub`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add club: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const club = await response.json();
    return club.data;
}

export async function updateStudentClub(id: string, data: StudentClub) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/studentclub/updatestudentclub/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update club: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const club = await response.json();
    return club.data;
}

export async function deleteStudentClub(id: string) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/studentclub/deletestudentclub/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete club: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const club = await response.json();
    return club.data;
}

// Campus Events API
export async function getCampusEvents() {
    const response = await fetch('https://backend-rakj.onrender.com/api/v1/campusevent/getcampusevents');
    const events = await response.json();
    return events.data;
}

export async function addCampusEvent(data: CampusEvent) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/campusevent/addcampusevent`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to add event: ${response.statusText}`);
    }
    
    const event = await response.json();
    return event.data;
}

export async function updateCampusEvent(id: string, data: CampusEvent) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/campusevent/updatecampusevent/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to update event: ${response.statusText}`);
    }
    
    const event = await response.json();
    return event.data;
}

export async function deleteCampusEvent(id: string) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/campusevent/deletecampusevent/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const event = await response.json();
    return event.data;
}

// Gallery API
export async function getGalleryImages() {
    const response = await fetch('https://backend-rakj.onrender.com/api/v1/galleryimage/getgalleryimages');
    const images = await response.json();
    return images.data;
}

export async function addGalleryImage(data: GalleryImage) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/galleryimage/addgalleryimage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to add gallery image: ${response.statusText}`);
    }
    
    const image = await response.json();
    return image.data;
}

export async function updateGalleryImage(id: string, data: GalleryImage) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/galleryimage/updategalleryimage/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to update gallery image: ${response.statusText}`);
    }
    
    const image = await response.json();
    return image.data;
}

export async function deleteGalleryImage(id: string) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/galleryimage/deletegalleryimage/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const image = await response.json();
    return image.data;
}

// Sports Facilities API
export async function getSportsFacilities() {
    const response = await fetch('https://backend-rakj.onrender.com/api/v1/sportsfacility/getsportsfacilities');
    const facilities = await response.json();
    return facilities.data;
}

export async function addSportsFacility(data: SportsFacility) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/sportsfacility/addsportsfacility`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`Failed to add sports facility: ${response.statusText}`);
    }

    const facility = await response.json();
    return facility.data;
}

export async function updateSportsFacility(id: string, data: SportsFacility) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/sportsfacility/updatesportsfacility/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`Failed to update sports facility: ${response.statusText}`);
    }

    const facility = await response.json();
    return facility.data;
}

export async function deleteSportsFacility(id: string) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/sportsfacility/deletesportsfacility/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to delete sports facility: ${response.statusText}`);
    }

    const facility = await response.json();
    return facility.data;
}
