import { buildApiUrl, getApiHeaders } from '@/lib/api-config';

export async function getTestimonials() {
    const response = await fetch(buildApiUrl('testimonials/gettestimonials'));
    const Testimonials = await response.json();
    return Testimonials.data;
}

export async function getTestimonialById(id: string) {
    const response = await fetch(buildApiUrl(`testimonials/gettestimonialsbyid/${id}`));
    const Testimonial = await response.json();
    return Testimonial.data;
}

export async function deleteTestimonialById(id: string) {
    const response = await fetch(buildApiUrl(`testimonials/deletetestimonials/${id}`), {
        method: 'DELETE',
        headers: getApiHeaders(),
    });
    const Testimonial = await response.json();
    return Testimonial.data;
}

export interface TestimonialData {
    name: string;
    imageUrl?: string;
    feedback: string;
}

export async function updateTestimonialById(id: string, data: TestimonialData) {
    const response = await fetch(buildApiUrl(`testimonials/updatetestimonials/${id}`), {
        method: 'PUT',
        headers: getApiHeaders(),
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to update Testimonial: ${response.statusText}`);
    }
    
    const Testimonial = await response.json();
    return Testimonial.data;
}

export async function addTestimonial(data: TestimonialData) {
    const response = await fetch(buildApiUrl('testimonials/addtestimonials'), {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to update Testimonial: ${response.statusText}`);
    }
    
    const Testimonial = await response.json();
    return Testimonial.data;
}


