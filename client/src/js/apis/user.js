import { getJWT, getUserFromJWT, logout } from '../auth/auth.js';
import logger from '../utils/logger.js';
import { showToast } from '../utils/toast.js';

export async function getUserData() {

    const user = getUserFromJWT();
    if (!user) return null;

    const email = user.sub;

    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/user/${email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getJWT()}`
            },
        });

        if (res.status === 401) {
            logger("warn", "Get User From JWT", "Session expired. Logging out.");
            showToast("Authentication expired. Please login back", "error");
            logout();
            return null;
        }

        if (!res.ok) {
            logger("error", "Fetching user data", "Failed to fetch the user data");
            const errorData = await res.json();
            throw new Error(errorData.error || `Request failed with ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        logger("error", "Fetching user data", `Failed to fetch user data. Error: [${error}]`);
        throw error;
    }
}