import htmlImporter from '../utils/html-importer.js';
import { openLoginModal } from '../utils/login-modal.js';
import { getUserFromJWT, logout, authGoogle } from '../auth/auth.js';

export async function initNavbar() {
  await htmlImporter('navbar-container', './src/components/navbar.html', () => {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const user = getUserFromJWT();

    if (!loginBtn || !logoutBtn) return;

    if (user) {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
    } else {
      loginBtn.style.display = 'inline-block';
      logoutBtn.style.display = 'none';
    }

    loginBtn.addEventListener('click', openLoginModal);
    logoutBtn.addEventListener('click', logout);
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