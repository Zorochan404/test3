export type ContactSubmission = {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  submittedAt?: string;
  status?: 'new' | 'read' | 'replied';
}

// Contact Submissions API
export async function getContactSubmissions() {
    const response = await fetch('https://backend-rakj.onrender.com/api/v1/contact/getcontacts');
    
    if (!response.ok) {
        throw new Error(`Failed to fetch contact submissions: ${response.status} ${response.statusText}`);
    }
    
    const contacts = await response.json();
    return contacts.data;
}

export async function getContactSubmissionById(id: string) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/contact/getcontactbyid/${id}`);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch contact submission: ${response.status} ${response.statusText}`);
    }
    
    const contact = await response.json();
    return contact.data;
}

export async function addContactSubmission(data: ContactSubmission) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/contact/addcontact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add contact submission: ${response.status} ${response.statusText}. ${errorText}`);
    }
    
    const contact = await response.json();
    return contact.data;
}

export async function updateContactSubmission(id: string, data: Partial<ContactSubmission>) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/contact/updatecontact/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update contact submission: ${response.status} ${response.statusText}. ${errorText}`);
    }
    
    const contact = await response.json();
    return contact.data;
}

export async function deleteContactSubmission(id: string) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/contact/deletecontact/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete contact submission: ${response.status} ${response.statusText}. ${errorText}`);
    }
    
    const contact = await response.json();
    return contact.data;
}

// Mark contact as read
export async function markContactAsRead(id: string) {
    return updateContactSubmission(id, { status: 'read' });
}

// Mark contact as replied
export async function markContactAsReplied(id: string) {
    return updateContactSubmission(id, { status: 'replied' });
}
