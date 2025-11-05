import { getUserData } from '../apis/user.js';

let currentUser = null;

export async function getCurrentUser() {

    if (currentUser) return currentUser;
    currentUser = await getUserData();
    return currentUser;
}

export function isCreator() {
    return currentUser?.role === 'creator';
}