import { getUserData } from '../apis/user.js';

let _currentUser = null;

export async function getCurrentUser() {

    if (_currentUser) return _currentUser;
    _currentUser = await getUserData();
    return _currentUser;
}

export function isLoggedIn() {
    return !!_currentUser;
}

export function isCreator() {
    return _currentUser?.role === 'creator';
}