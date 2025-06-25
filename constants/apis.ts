import { buildApiUrl, getApiHeaders, apiClient, handleApiResponse } from '@/lib/api-config';

export async function getCompanies() {
    const response = await fetch(buildApiUrl('logo/getlogo'));
    const companies = await response.json();
    return companies.data;
}

export async function getCompanyById(id: string) {
    const response = await fetch(buildApiUrl(`logo/getlogoById/${id}`));
    const company = await response.json();
    return company.data;
}

export async function deleteCompanyById(id: string) {
    const response = await fetch(buildApiUrl(`logo/deletelogo/${id}`), {
        method: 'DELETE',
        headers: getApiHeaders(),
    });
    const company = await response.json();
    return company.data;
}

export async function updateCompanyById(id: string, data: any) {
    const response = await fetch(buildApiUrl(`logo/updatelogo/${id}`), {
        method: 'PUT',
        headers: getApiHeaders(),
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to update company: ${response.statusText}`);
    }
    
    const company = await response.json();
    return company.data;
}

export async function addCompany(data: any) {
    try {
        const response = await apiClient.post('/logo/addlogo', data);
        return handleApiResponse(response);
    } catch (error) {
        console.error('Error adding company:', error);
        throw error;
    }
}


