import { getAbout } from "../controllers/about.controller.js";

export async function aboutRoute(req, res) {
    if (req.method === 'GET' && req.url === '/api/v1/about') {
        return await getAbout(res);
    }
}