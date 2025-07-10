import anonymous from '../../assets/images/anonymous.png';
import { logout } from '../auth/auth.js';

export function userAvatar(user) {
    const userAvatar = document.getElementById('logged-user');
    userAvatar.innerHTML = `
        <img id="user-avatar-img" src="${user.avatarurl ?? anonymous}" alt="avatar" class="user-avatar"/>
    `;

    document.getElementById('user-avatar-img').addEventListener('click', (e) => {
        e.stopPropagation();
        openUserInfo(user);
    });
}

function openUserInfo(user) {
    const userInfo = document.getElementById('user-info-box');

    if (userInfo) {
        closeUserInfo();
        return;
    }

    const box = document.createElement('div');
    box.id = 'user-info-box';
    box.className = 'user-info-box';

    box.innerHTML = `
        <div class="user-header">
            <img src="${user.avatarurl ?? anonymous}" alt="User Avatar" class="user-avatar-large">
            <div class="user-name">${user.name}</span></div>
            <div class="user-role">${user.role}</div>
        </div>
        
        <div class="user-details">
            <div class="detail-item">
                <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
                <div class="detail-content">
                    <div class="detail-label">EMAIL</div>
                    <div class="detail-value">${user.email}</div>
                </div>
            </div>
            
            <div class="detail-item">
                <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
                <div class="detail-content">
                    <div class="detail-label">ROLE</div>
                    <div class="detail-value">${user.role}</div>
                </div>
            </div>
            
            <div class="detail-item">
                <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <div class="detail-content">
                    <div class="detail-label">MEMBER SINCE</div>
                    <div class="detail-value">${new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}</div>
                </div>
            </div>
        </div>
        
        <div class="user-actions">
            <button class="btn btn-logout" id="logout-btn">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Sign Out
            </button>
        </div>
    `;

    const avatar = document.getElementById('user-avatar-img');
    avatar.parentElement.style.position = 'relative';
    avatar.parentElement.appendChild(box);

    const overlay = document.createElement('div');
    overlay.className = 'user-dropdown-overlay';
    overlay.id = 'user-dropdown-overlay';
    document.body.appendChild(overlay);

    setTimeout(() => {
        box.classList.add('show');
        overlay.classList.add('show');
    }, 10);

    document.getElementById('logout-btn').addEventListener('click', () => {
        logout()
    });

    overlay.addEventListener('click', closeUserInfo);

    document.addEventListener('keydown', handleEscapeKey);
}

function closeUserInfo() {
    const box = document.getElementById('user-info-box');
    const overlay = document.getElementById('user-dropdown-overlay');

    if (box) {
        box.classList.remove('show');
        if (overlay) overlay.classList.remove('show');

        setTimeout(() => {
            box.remove();
            if (overlay) overlay.remove();
            document.removeEventListener('keydown', handleEscapeKey);
        }, 300);
    }
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeUserInfo();
    }
}