import { initFooter, initNavbar, initLoginModal } from '../layout/init-layout.js';
import { handleErrorToastFromSession } from '../utils/toast.js';

const routes = {
    '/': './src/views/home.html',
    '/oauth2/auth': null,
    '/about': './src/views/about.html',
};

export async function setupRouting() {
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
    container.innerHTML = '';

    if (path === '/oauth2/auth') {
        const { default: buildLoadingPage } = await import('../pages/loading/loading-spinner.js');
        await buildLoadingPage();
        return;
    }

    const file = routes[path] || routes['/'];

    try {
        const res = await fetch(file);
        if (!res.ok) {
            throw new Error(`Failed to load ${file}: ${res.status}`);
        }

        const html = await res.text();
        container.innerHTML = html;

    } catch (error) {
        console.error('Error loading route:', error);
        container.innerHTML = '<p>Error loading page</p>';
    }

    await initNavbar();
    await initFooter();
    await initLoginModal();

    if (path === '/about') {
        const { default: buildPage } = await import('../pages/about/build-page.js');
        buildPage();
    }

    requestAnimationFrame(() => {
        handleErrorToastFromSession();
    });
}

export function navigateTo(path) {
    history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
}