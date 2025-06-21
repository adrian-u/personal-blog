export function setupRouting() {
    const routes = {
        '/': '/components/home.html',
        '/about': '/components/about.html',
    };

    const container = document.getElementById('view-container');

    async function render(path) {
        const file = routes[path] || routes['/'];
        const res = await fetch(file);
        const html = await res.text();
        container.innerHTML = html;

        if (path === '/about') {
            const { default: buildPage } = await import('../pages/about/build-page.js');
            buildPage();
        }
    }

    window.onpopstate = () => render(location.pathname);

    document.addEventListener('click', e => {
        const link = e.target.closest('a');
        if (link && link.dataset.nav === 'spa') {
            e.preventDefault();
            history.pushState({}, '', link.href);
            render(location.pathname);
        }
    });

    render(location.pathname);
}

export function navigateTo(path) {
    history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
}