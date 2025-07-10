import { getUserFromJWT } from '../auth/auth.js';

export async function getUserData() {

    const user = getUserFromJWT();
    if(!user) return null;
    
    const email = user.fullPayload.sub;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/user/${email}`);
    return await res.json();
}