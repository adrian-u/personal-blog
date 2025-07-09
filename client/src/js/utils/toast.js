export function handleErrorToastFromSession() {
    const message = sessionStorage.getItem('toastMessage');
    if (message) {
        setTimeout(() => {
            showToast(message, 'error');
            sessionStorage.removeItem('toastMessage');
        }, 100);
    }
}

export function showToast(message, type = 'default', duration = 5000) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;

    toast.className = 'toast';
    toast.classList.add(`toast-${type}`);
    toast.classList.add('toast-show');

    setTimeout(() => {
        toast.classList.remove('toast-show');
    }, duration);
}