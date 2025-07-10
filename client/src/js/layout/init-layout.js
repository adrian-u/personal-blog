import htmlImporter from '../utils/html-importer.js';
import { openLoginModal } from '../utils/login-modal.js';
import { authWithProvider } from '../auth/auth.js';
import { getUserData } from '../apis/user.js';
import { userAvatar } from '../utils/user-details.js';

export async function initNavbar() {
  await htmlImporter('navbar-container', './src/components/navbar.html', async () => {
    const loginBtn = document.getElementById('login-btn');
    const loggedUser = document.getElementById('logged-user');
    const user = await getUserData();

    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('nav-menu');

    toggle.addEventListener('click', () => {
      menu.classList.toggle('show');
    });

    if (!loginBtn || !loggedUser) return;

    if (user) {
      loginBtn.style.display = 'none';
      loggedUser.style.display = 'inline-block';
      userAvatar(user);
    } else {
      loginBtn.style.display = 'inline-block';
      loggedUser.style.display = 'none';
    }

    loginBtn.addEventListener('click', openLoginModal);
  });
}

export async function initFooter() {
  await htmlImporter('footer-container', './src/components/footer.html');
}

export async function initLoginModal() {
  await htmlImporter('body', './src/components/login-modal.html', () => {
    const modal = document.getElementById('login-modal');

    function closeModal() {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 300);
    }

    document.getElementById('btn-close-modal')?.addEventListener('click', closeModal);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });

    document.querySelectorAll('[data-provider]').forEach(btn => {
      btn.addEventListener('click', () => {
        const provider = btn.dataset.provider;
        authWithProvider(provider);
        closeModal();
      });
    });
  });
}