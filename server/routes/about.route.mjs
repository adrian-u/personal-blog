import { getAbout } from "../controllers/about.controller.mjs";

export function aboutRoute(req, res) {
    if (req.method === 'GET' && req.url === '/api/v1/about') {
        return getAbout(res);
    }
}