import dotenv from "dotenv";

dotenv.config();

export function handleCors(req, res) {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return true;
    }

    return false;
}