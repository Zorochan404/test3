export type AdvisorInput = {
  name: string;
  src?: string;
  role: string;
  description: string;
};

export async function getadvisors() {
    const response = await fetch('https://backend-rakj.onrender.com/api/v1/advisor/getadvisors');
    const advisors = await response.json();
    return advisors.data;
}

export async function getadvisorById(id: string) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/advisor/getadvisorsbyid/${id}`);
    const advisor = await response.json();
    return advisor.data;
}

export async function deleteadvisorById(id: string) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/advisor/deleteadvisor/${id}`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const advisor = await response.json();
    return advisor.data;
}


export async function updateadvisorById(id: string, data: AdvisorInput) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/advisor/updateadvisor/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to update advisor: ${response.statusText}`);
    }
    
    const advisor = await response.json();
    return advisor.data;
}

export async function addadvisor(data: AdvisorInput) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/advisor/addadvisor`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to add advisor: ${response.statusText}`);
    }
    
    const advisor = await response.json();
    return advisor.data;
}
