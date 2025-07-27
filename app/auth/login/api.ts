export async function getMemberships() {
    const response = await fetch('NEXT_PUBLIC_base_url/membership/getMembership');
    const Memberships = await response.json();
    return Memberships.data;
}