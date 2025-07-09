import { createServer } from "node:http";
import { aboutRoute } from "./routes/about.route.js";
import { oauthRoute } from './routes/oauth.route.js';
import { handleCors } from './middlewares/cors.js';

const host = "0.0.0.0";
const port = 8080;

const routes = {
    "GET": {
        "/api/v1/about": aboutRoute
    }
}

const server = createServer((req, res) => {
    
    if(handleCors(req, res)) return;

    if (req.url.startsWith('/api/v1/oauth/google/token')) return oauthRoute(req, res);

    const handler = routes[req.method]?.[req.url];

    if(handler) {
        return handler(req, res);
    }

    res.writeHead(404, {
        'Content-Type': 'application/json'});
    res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});