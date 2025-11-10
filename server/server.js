import { createServer } from "node:http";
import crypto from "crypto";
import { handleCors } from './middlewares/cors.js';
import { findRoute } from "./routes/router.manager.js";
import bodyParser from "./middlewares/body-parser.js";

// Importing routes to enable registration through the router.manager
import './routes/user.route.js';
import './routes/oauth.route.js';
import './routes/article.route.js';
import './routes/comment.route.js';

const host = process.env.HOST;
const port = process.env.PORT;

const server = createServer(async (req, res) => {

    req.traceId = crypto.randomUUID();

    if (handleCors(req, res)) return;

    if (["POST", "PATCH", "PUT"].includes(req.method)) {
        await bodyParser(req, res);
    }

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