import buildUserDataSection from './user-data-section.js';
import buildPreferredArticlesSection from './build-preferred-section.js';
import buildAccountActionsSection from './account-actions-section.js';
import { getCurrentUser } from '../../context/user-context.js';
import { extraSiteInfo } from './extra-site-info.js';
import htmlImporter from '../../utils/html-importer.js';

export default async function buildProfile() {

    const user = await getCurrentUser();

    await _createInfoModal();
    buildUserDataSection(user);
    buildAccountActionsSection();
    buildPreferredArticlesSection(user);
    extraSiteInfo();
}

async function _createInfoModal() {
    await htmlImporter("body", "./src/components/info-modal.html");
}