import { createServer } from "node:http";
import { handleCors } from './middlewares/cors.js';
import { findRoute } from "./routes/router.manager.js";

// Importing routes to enable registration through the router.manager
import './routes/about.route.js';
import './routes/user.route.js';
import './routes/oauth.route.js';

const host = "0.0.0.0";
const port = 8080;

const server = createServer(async (req, res) => {

    if (handleCors(req, res)) return;

    const match = findRoute(req);

    if (match) {
        return await match.handler(req, res, match.params);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});