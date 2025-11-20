import anonymous from '../../assets/images/anonymous.png';

export function userAvatar(user) {
    const userAvatar = document.getElementById('profile');

    const link = document.createElement("a");
    link.href = "/profile";
    link.dataset.nav = "spa";
    link.className = "navbar-buttons";

    const img = document.createElement("img");
    img.id = "user-avatar-img";
    img.className = "navbar-icons user-avatar png";
    img.alt = "avatar icon";

    img.src = user.avatarUrl ?? anonymous;

    const span = document.createElement("span");
    span.className = "navbar-text";
    span.textContent = "Profile";

    link.append(img, span);
    userAvatar.appendChild(link);
}