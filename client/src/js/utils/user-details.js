import anonymous from '../../assets/images/anonymous.png';

export function userAvatar(user) {
    const userAvatar = document.getElementById('profile');
    userAvatar.innerHTML = `
        <img id="user-avatar-img" src="${user.avatarurl ?? anonymous}" alt="avatar" class="user-avatar"/>
        <a class="navbar-text" href="/profile">Profile</a>
    `;
}