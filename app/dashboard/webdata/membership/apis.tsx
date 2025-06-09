export type MembershipInput = {
  name: string;
  src?: string;
};

export async function getMemberships() {
    const response = await fetch('https://backend-rakj.onrender.com/api/v1/membership/getMembership');
    const Memberships = await response.json();
    return Memberships.data;
}

export async function getMembershipById(id: string) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/membership/getMembershipById/${id}`);
    const Membership = await response.json();
    return Membership.data;
}

export async function deleteMembershipById(id: string) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/membership/deleteMembership/${id}`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const Membership = await response.json();
    return Membership.data;
}


export async function updateMembershipById(id: string, data: MembershipInput) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/membership/updateMembership/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to update Membership: ${response.statusText}`);
    }
    
    const Membership = await response.json();
    return Membership.data;
}

export async function addMembership(data: MembershipInput) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/membership/addMembership`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to update Membership: ${response.statusText}`);
    }
    
    const Membership = await response.json();
    return Membership.data;
}
