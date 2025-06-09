export async function getMemberships() {
    const response = await fetch('https://backend-rakj.onrender.com/api/v1/membership/getMembership');
    const Memberships = await response.json();
    return Memberships.data;
}