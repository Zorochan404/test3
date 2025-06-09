export async function getCompanies() {
    const response = await fetch('https://backend-rakj.onrender.com/api/v1/logo/getlogo');
    const companies = await response.json();
    return companies.data;
}

export async function getCompanyById(id: string) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/logo/getlogoById/${id}`);
    const company = await response.json();
    return company.data;
}

export async function deleteCompanyById(id: string) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/logo/deletelogo/${id}`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const company = await response.json();
    return company.data;
}


export async function updateCompanyById(id: string, data: any) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/logo/updatelogo/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to update company: ${response.statusText}`);
    }
    
    const company = await response.json();
    return company.data;
}

export async function addCompany( data: any) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/logo/addlogo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to update company: ${response.statusText}`);
    }
    
    const company = await response.json();
    return company.data;
}


