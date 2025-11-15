import { getCurrentUser, isCreator } from '../context/user-context.js';
import { initNavbar, initLoginModal, setActiveNav, initConfirmationModal } from '../layout/init-layout.js';
import logger from '../utils/logger.js';
import { handleErrorToastFromSession, showToast } from '../utils/toast.js';

const HTMLFilesCache = {};

const routes = {
    '/': '/views/home.html',
    '/oauth2/auth': null,
    '/about': '/views/about.html',
    '/projects': '/views/projects.html',
    '/finance': '/views/finance.html',
    '/create': '/views/create.html',
    '/profile': '/views/profile.html',
};

const protectedRoutes = {
    '/create': 'creator',
    '/profile': 'authenticated'
};

export async function setupRouting() {
    await initNavbar();
    await initLoginModal();
    await initConfirmationModal();
    window.onpopstate = () => renderRoute(location.pathname);

    document.addEventListener('click', e => {
        const link = e.target.closest('a');
        if (link && link.dataset.nav === 'spa') {
            e.preventDefault();
            history.pushState({}, '', link.href);
            renderRoute(location.pathname);
        }
    });
    await renderRoute(location.pathname);

}

export async function renderRoute(path = location.pathname) {
    const container = document.getElementById('view-container');

    const requiredAccess = protectedRoutes[path];
    const user = await getCurrentUser();
    const isLoggedIn = !!user;
    if (requiredAccess) {
        if (requiredAccess === 'authenticated' && !isLoggedIn) {
            showToast('Please log in to view your profile.', 'warning');
            history.replaceState({}, '', '/');
            return renderRoute('/');
        }

        if (requiredAccess === 'creator' && (!isLoggedIn || user.role !== 'creator')) {
            showToast('Only creators can access this page.', 'error');
            history.replaceState({}, '', '/');
            return renderRoute('/');
        }
    }

    const file = routes[path] || routes['/'];
    container.innerHTML = await _fetchHTML(file);
    setActiveNav(path)

    if (path === '/oauth2/auth') {
        const spinner = document.getElementById('spinner-overlay');
        if (spinner) spinner.classList.remove('hidden');

        try {
            const { handleOAuthCallback } = await import('../auth/auth.js');
            await handleOAuthCallback();
        } catch (error) {
            logger("error", "Render route oauth", `OAuth callback error. [${error}]`)
            showToast("Failed to login", "error");
        } finally {
            if (spinner) spinner.classList.add('hidden');
            window.location.replace('/');
        }

        return;
    }

    if (path === '/') {
        const { default: homeInit } = await import('../pages/home/home-init.js');
        await homeInit();

    }

    if (path === '/about') {
        const { default: buildPage } = await import('../pages/about/build-page.js');
        await buildPage();
    }

    if (path === '/projects') {
        const { default: buildProjectsPage } = await import('../pages/projects/build-projects-page.js');
        await buildProjectsPage();
    }

    if (path === '/finance') {
        const { default: buildFinancePage } = await import('../pages/finance/build-finance-page.js');
        await buildFinancePage();
    }

    if (path === '/create') {
        const { default: buildCreatePage } = await import('../pages/create/build-create-page.js');
        await buildCreatePage();
    }

    if (path === '/profile') {
        const { default: buildProfile } = await import('../pages/profile/build-profile.js');
        await buildProfile();
    }

    requestAnimationFrame(() => {
        handleErrorToastFromSession();
    });
}

export function navigateTo(path) {
    history.pushState({}, '', path);
    renderRoute(path);
}

async function _fetchHTML(file) {
    try {
        if (HTMLFilesCache[file]) {
            return HTMLFilesCache[file];
        } else {
            const res = await fetch(file);
            if (!res.ok) {
                throw new Error(`Failed to load ${file}: ${res.status}`);
            }

            const html = await res.text();
            HTMLFilesCache[file] = html;
            return html;
        }

    } catch (error) {
        console.error('Error loading route:', error);
        return '<p>Error loading page</p>';
    }
}