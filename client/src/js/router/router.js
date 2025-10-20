import { initNavbar, initLoginModal, setActiveNav, initConfirmationModal } from '../layout/init-layout.js';
import { handleErrorToastFromSession } from '../utils/toast.js';

const HTMLFilesCache = {};

const routes = {
    '/': './src/views/home.html',
    '/oauth2/auth': null,
    '/about': './src/views/about.html',
    '/projects': './src/views/projects.html',
    '/create': './src/views/create.html',
    '/profile': './src/views/profile.html',
};

export async function setupRouting() {
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
    const file = routes[path] || routes['/'];

    container.innerHTML = await _fetchHTML(file);

    await initNavbar();
    setActiveNav(path)

    if (path === '/oauth2/auth') {
        const { default: buildLoadingPage } = await import('../pages/loading/loading-spinner.js');
        await buildLoadingPage();
        return;
    }

    if (path === '/about') {
        const { default: buildPage } = await import('../pages/about/build-page.js');
        buildPage();
    }

    if (path === '/projects') {
        const { default: buildProjectsPage } = await import('../pages/projects/build-projects-page.js');
        buildProjectsPage();
    }

    if (path === '/create') {
        const { default: buildCreatePage } = await import('../pages/create/build-create-page.js');
        buildCreatePage();
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
    window.dispatchEvent(new PopStateEvent('popstate'));
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