import { apiClient, handleApiResponse } from '@/lib/api-config';

export async function getTestimonials() {
    try {
        const response = await apiClient.get('/testimonials/gettestimonials');
        return handleApiResponse(response);
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
    }
}

export async function getTestimonialById(id: string) {
    try {
        const response = await apiClient.get(`/testimonials/gettestimonialsbyid/${id}`);
        return handleApiResponse(response);
    } catch (error: any) {
        if (error.status === 404) {
            return null;
        }
        console.error('Error fetching testimonial:', error);
        throw error;
    }
}

export async function deleteTestimonial(id: string) {
    try {
        await apiClient.delete(`/testimonials/deletetestimonials/${id}`);
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        throw error;
    }
}

export interface TestimonialData {
    name: string;
    imageUrl?: string;
    feedback: string;
}

export async function updateTestimonial(id: string, data: TestimonialData) {
    try {
        const response = await apiClient.put(`/testimonials/updatetestimonials/${id}`, data);
        return handleApiResponse(response);
    } catch (error) {
        console.error('Error updating testimonial:', error);
        throw error;
    }
}

export async function createTestimonial(data: TestimonialData) {
    try {
        const response = await apiClient.post('/testimonials/addtestimonials', data);
        return handleApiResponse(response);
    } catch (error) {
        console.error('Error creating testimonial:', error);
        throw error;
    }
}

// Alias exports for backward compatibility
export const updateTestimonialById = updateTestimonial;
export const deleteTestimonialById = deleteTestimonial;


