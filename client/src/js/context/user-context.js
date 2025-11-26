import { getUserData } from '../apis/user.js';
import { logout, refreshAccessToken, isUserLoggedIn } from '../auth/auth.js';

let currentUser = null;

export async function getCurrentUser() {

    if (currentUser) return currentUser;

    try {
        currentUser = await getUserData();
        return currentUser;
    } catch (error) {
        if (isUserLoggedIn()) {
            const newJWT = await refreshAccessToken();
            if (newJWT) {
                currentUser = await getUserData();
                return currentUser;
            }
        }
        await logout();
        return null;
    }
}

export function isLoggedIn() {
    return !!currentUser;
}

export function isCreator() {
    return currentUser?.role === 'creator';
}