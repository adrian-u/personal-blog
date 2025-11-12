import anonymous from '../../../assets/images/anonymous.png';

export default function buildUserDataSection(user) {

    const userData = document.getElementById('user-data');

    userData.append(_buildAvatarBox(user.avatarUrl), _buildUserDetails(user));
}

function _buildAvatarBox(avatarUrl) {
    const avatarBox = document.createElement("div");
    avatarBox.classList.add("avatar-box");

    const img = document.createElement("img");
    img.src = avatarUrl ?? anonymous;
    img.alt = "user avatar";
    img.classList.add("cover");
    avatarBox.appendChild(img);

    return avatarBox;
}

function _buildUserDetails(user) {
    const div = document.createElement("div");

    const name = document.createElement("h1");
    name.classList.add("profile-name");
    name.textContent = user.name;

    const email = document.createElement("p");
    email.classList.add("user-email");
    email.textContent = user.email;

    div.append(name, email, _buildDateRole(user));

    return div;
}

function _buildDateRole(user) {
    const extra = document.createElement("div");
    extra.classList.add("extra-details");

    const date = document.createElement("p");
    date.textContent = `Member Since: ${new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}`;

    const badge = document.createElement("div");
    badge.classList.add("role-badge");
    badge.textContent = user.role;

    extra.append(date, badge);

    return extra;
}