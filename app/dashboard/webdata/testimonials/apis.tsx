export async function getTestimonials() {
    const response = await fetch('https://backend-rakj.onrender.com/api/v1/testimonials/gettestimonials');
    const Testimonials = await response.json();
    return Testimonials.data;
}

export async function getTestimonialById(id: string) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/testimonials/gettestimonialsbyid/${id}`);
    const Testimonial = await response.json();
    return Testimonial.data;
}

export async function deleteTestimonialById(id: string) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/testimonials/deletetestimonials/${id}`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
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
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/testimonials/updatetestimonials/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to update Testimonial: ${response.statusText}`);
    }
    
    const Testimonial = await response.json();
    return Testimonial.data;
}

export async function addTestimonial( data: TestimonialData) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/testimonials/addtestimonials`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to update Testimonial: ${response.statusText}`);
    }
    
    const Testimonial = await response.json();
    return Testimonial.data;
}


