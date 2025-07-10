import htmlImporter from '../utils/html-importer.js';
import { openLoginModal } from '../utils/login-modal.js';
import { authGoogle } from '../auth/auth.js';
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

    document.getElementById('btn-close-modal')?.addEventListener('click', () => {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 300);
    });

    document.getElementById('btn-google')?.addEventListener('click', () => {
      authGoogle();
      modal.classList.add('hidden');
    });

    document.getElementById('btn-apple')?.addEventListener('click', () => {
      alert("Apple Signup not implemented yet");
      modal.classList.add('hidden');
    });

    document.getElementById('btn-github')?.addEventListener('click', () => {
      alert("GitHub Signup not implemented yet");
      modal.classList.add('hidden');
    })
  });
}