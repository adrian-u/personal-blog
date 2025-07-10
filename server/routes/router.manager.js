const routes = [];

export function registerRoute(method, path, handler) {
    routes.push({ method, path, handler });
}

export function findRoute(req) {
    const { method, url } = req;
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const pathname = new URL(url, `${protocol}://${req.headers.host}`).pathname;

    for (const route of routes) {
        if (route.method !== method) continue;

        const params = matchPath(pathname, route.path);
        if (params) {
            return { handler: route.handler, params };
        }
    }

    return null;
}

function matchPath(actualPath, routePath) {
    const actualParts = actualPath.split('/').filter(Boolean);
    const routeParts = routePath.split('/').filter(Boolean);

    if (actualParts.length !== routeParts.length) return null;

    const params = {};

    for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
            const key = routeParts[i].slice(1);
            params[key] = decodeURIComponent(actualParts[i]);
        } else if (routeParts[i] !== actualParts[i]) {
            return null;
        }
    }

    return params;
}