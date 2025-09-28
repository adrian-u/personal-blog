let _currentUser = null;

export function setUser(user) {
    _currentUser = user;
}

export function getUser() {
    return _currentUser;
}

export function isLoggedIn() {
    return !!_currentUser;
}

export function isCreator() {
    return _currentUser?.role === 'creator';
}