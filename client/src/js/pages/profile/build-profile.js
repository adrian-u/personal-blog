import buildUserDataSection from './user-data-section.js';
import buildPreferredArticlesSection from './build-preferred-section.js';
import buildAccountActionsSection from './account-actions-section.js';

export default async function buildProfile() {
    
    const userData = document.getElementById('user-data');
    const preferredArticles = document.getElementById('preferred-articles');

    userData.innerHTML = await buildUserDataSection();
    preferredArticles.innerHTML = buildPreferredArticlesSection();
    buildAccountActionsSection();
}