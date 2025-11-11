import buildUserDataSection from './user-data-section.js';
import buildPreferredArticlesSection from './build-preferred-section.js';
import buildAccountActionsSection from './account-actions-section.js';
import { getCurrentUser } from '../../context/user-context.js';

export default async function buildProfile() {

    const user = await getCurrentUser();
    buildUserDataSection(user);
    buildAccountActionsSection();
    buildPreferredArticlesSection();
}