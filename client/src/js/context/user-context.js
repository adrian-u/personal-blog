import { getUserData } from '../apis/user.js';
import { logout, refreshAccessToken } from '../auth/auth.js';

let currentUser = null;

export async function getCurrentUser() {

    if (currentUser) return currentUser;

    try {
        currentUser = await getUserData();
        return currentUser;
    } catch (error) {
        const newJWT = await refreshAccessToken();
        if (newJWT) {
            currentUser = await getUserData();
            return currentUser;
        } else {
            await logout();
            return null;
        }
    }
}

export function isLoggedIn() {
    return !!currentUser;
}

export function isCreator() {
    return currentUser?.role === 'creator';
}