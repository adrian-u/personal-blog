import anonymous from '../../assets/images/anonymous.png';

export function userAvatar(user) {
    const userAvatar = document.getElementById('profile');
    userAvatar.innerHTML = `
        <a href="/profile" data-nav="spa" class="navbar-buttons">
            <img id="user-avatar-img" src="${user.avatarUrl ?? anonymous}" alt="avatar icon" class="navbar-icons user-avatar png"/>
            <span class="navbar-text">Profile</span>
        </a>
    `;
}