export type SessionLoginInput = {
  name: string;
  phoneNumber: string;
  email: string;
  city: string;
  course: string;
};

export async function getSessionLogins() {
    const response = await fetch('https://backend-rakj.onrender.com/api/v1/session/getsessionlogins');
    const sessionLogins = await response.json();
    return sessionLogins.data;
}

export async function getSessionLoginById(id: string) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/session/getsessionloginbyid/${id}`);
    const sessionLogin = await response.json();
    return sessionLogin.data;
}

export async function deleteSessionLoginById(id: string) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/session/deletesessionlogin/${id}`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const sessionLogin = await response.json();
    return sessionLogin.data;
}

export async function updateSessionLoginById(id: string, data: SessionLoginInput) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/session/updatesessionlogin/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to update session login: ${response.statusText}`);
    }
    
    const sessionLogin = await response.json();
    return sessionLogin.data;
}

export async function addSessionLogin(data: SessionLoginInput) {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/session/addsessionlogin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to add session login: ${response.statusText}`);
    }
    
    const sessionLogin = await response.json();
    return sessionLogin.data;
}
