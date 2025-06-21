import { createServer } from "node:http";
import { aboutRoute } from "./routes/about.route.js";

const host = "127.0.0.1";
const port = 8080;

const routes = {
    "GET": {
        "/api/v1/about": aboutRoute
    }
}

const server = createServer((req, res) => {
    
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