import htmlImporter from '../utils/html-importer.js';
import { closeModal, openLoginModal, handleEscape } from '../utils/modals.js';
import { authWithProvider } from '../auth/auth.js';
import { userAvatar } from '../utils/user-details.js';
import { isCreator, getCurrentUser } from '../context/user-context.js';
import { extraSiteInfo } from '../utils/extra-site-info.js';

export async function initNavbar() {
  await htmlImporter('navbar-container', './src/components/navbar.html', async () => {
    await _createInfoModal();
    const loginBtn = document.getElementById('login-btn');
    const createPage = document.getElementById('create-page');
    const profileNavbar = document.getElementById('profile');
    const user = await getCurrentUser();

    /* const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('nav-menu');
     toggle.addEventListener('click', () => {
       menu.classList.toggle('show');
     });
 */
    if (!loginBtn || !profileNavbar) return;

    if (user) {
      loginBtn.style.display = 'none';
      profileNavbar.style.display = 'flex';
      createPage.style.display = 'flex';
      userAvatar(user);
      isCreator() ? createPage.style.display = 'flex' : createPage.style.display = 'none';
    } else {
      loginBtn.style.display = 'flex';
      profileNavbar.style.display = 'none';
    }

    loginBtn.addEventListener('click', openLoginModal);

    extraSiteInfo();
  });
}

export async function initLoginModal() {
  await htmlImporter('body', './src/components/login-modal.html', () => {
    const modal = document.getElementById('login-modal');
    if (!modal) return;

    modal.addEventListener('click', (e) => {
      if (e.target.closest('#btn-close-modal')) {
        closeModal(modal);
        return;
      }
      if (e.target.closest('[data-provider]')) {
        const provider = e.target.closest('[data-provider]').dataset.provider;
        authWithProvider(provider);
        closeModal(modal);
      }
    });

    document.removeEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleEscape);
  });
}

export function setActiveNav(path) {
  const navItems = document.querySelectorAll('.nav-links .navbar-buttons');

  navItems.forEach(item => {
    const link = item.querySelector('a.navbar-text');
    if (!link) return;

    const href = link.getAttribute('href');

    const isActive = path === href || path.startsWith(href + '/');

    if (isActive) {
      item.classList.add('active');
      link.classList.add('active');
    } else {
      item.classList.remove('active');
      link.classList.remove('active');
    }
  });
}

export async function initConfirmationModal() {
  await htmlImporter("body", "./src/components/confirmation-modal.html");
}

async function _createInfoModal() {
  await htmlImporter("body", "./src/components/info-modal.html");
}
