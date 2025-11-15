import { getUserFromJWT } from '../auth/auth.js';
import { fetchWithAuth } from './fetch-wrapper.js';

export async function getUserData() {

    const user = getUserFromJWT();
    if (!user) return null;

    const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/user/${user.id}`,
        { method: "GET" }
    );

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to load user data");
    }

    return await res.json();
}

export async function deleteUser() {
    const user = getUserFromJWT();
    if (!user) return null;

    const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/user/${user.id}`,
        { method: "DELETE" }
    );

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete user");
    }

    return true;
}