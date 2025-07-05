// Mentor API functions
const BASE_URL = "http://localhost:5500/api/v1/mentor";

export interface Mentor {
  _id?: string;
  name: string;
  role: string;
  description: string;
  image: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface MentorResponse {
  success: boolean;
  message: string;
  data: Mentor | {
    mentors?: Mentor[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalMentors: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  statusCode: number;
  timestamp: string;
}

export interface SingleMentorResponse {
  success: boolean;
  message: string;
  data: Mentor;
  statusCode: number;
  timestamp: string;
}

export interface MultipleMentorsResponse {
  success: boolean;
  message: string;
  data: {
    mentors: Mentor[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalMentors: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  statusCode: number;
  timestamp: string;
}

// Create a new mentor
export const createMentor = async (mentorData: Omit<Mentor, '_id' | 'createdAt' | 'updatedAt' | '__v'>): Promise<MentorResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mentorData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create mentor');
    }

    return data;
  } catch (error) {
    console.error('Error creating mentor:', error);
    throw error;
  }
};

// Get all mentors
export const getAllMentors = async (): Promise<MultipleMentorsResponse> => {
  try {
    console.log('Fetching all mentors from:', `${BASE_URL}/all`);
    
    const response = await fetch(`${BASE_URL}/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch mentors');
    }

    return data;
  } catch (error) {
    console.error('Error fetching mentors:', error);
    throw error;
  }
};

// Get mentor by ID
export const getMentorById = async (id: string): Promise<SingleMentorResponse> => {
  try {
    console.log('Fetching mentor with ID:', id);
    console.log('Request URL:', `${BASE_URL}/${id}`);
    
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch mentor');
    }

    return data;
  } catch (error) {
    console.error('Error fetching mentor:', error);
    throw error;
  }
};

// Update mentor
export const updateMentor = async (id: string, mentorData: Partial<Mentor>): Promise<SingleMentorResponse> => {
  try {
    console.log('Updating mentor with ID:', id);
    console.log('Request URL:', `${BASE_URL}/${id}`);
    console.log('Update data:', mentorData);
    
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mentorData),
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update mentor');
    }

    return data;
  } catch (error) {
    console.error('Error updating mentor:', error);
    throw error;
  }
};

// Delete mentor
export const deleteMentor = async (id: string): Promise<SingleMentorResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete mentor');
    }

    return data;
  } catch (error) {
    console.error('Error deleting mentor:', error);
    throw error;
  }
}; 