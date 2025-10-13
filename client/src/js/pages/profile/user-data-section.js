import anonymous from '../../../assets/images/anonymous.png';
import { getCurrentUser } from '../../context/user-context.js';

export default async function buildUserDataSection() {
    const user = await getCurrentUser();

    return `
        <div class="avatar-box"> 
            <img src=${/*user.avatarurl ?? */anonymous} alt="user avatar url" class="cover"/>
        </div>
        <h1 class="profile-name">
            ${user.name} 
        </h1>
        <p class="user-name">
            ${user.email}
        </p>
        <div class="extra-details">
            <p>
            Member Since ${new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}
            </p>
            <div class="detail-role role-badge">${user.role}</div>
        </div>
        <div class="empty-row"></div>
    `;
}