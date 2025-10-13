import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';

export function createJWT(payload) {
    const header = {
        alg: 'HS256',
        typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);

    const fullPayload = {
        sub: payload.email,
        role: payload.role,
        iat: now,
        exp: now + 60 * 60 * 24 * 30,
    };


    const encode = obj =>
        Buffer.from(JSON.stringify(obj)).toString('base64url');

    const encodedHeader = encode(header);
    const encodedPayload = encode(fullPayload);

    const signature = crypto
        .createHmac('sha256', process.env.JWT_SECRET)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64url');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyJWT(req, res) {

    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Missing or invalid Authorization header" }));
        return null;
    }

    const token = authHeader.split(" ")[1];
    const parts = token.split('.');

    if (parts.length !== 3) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Malformed token" }));
        return null;
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.JWT_SECRET)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64url');

    if (signature !== expectedSignature) {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid token signature" }));
        return null;
    }

    const payloadJSON = Buffer.from(encodedPayload, 'base64url').toString();
    const payload = JSON.parse(payloadJSON);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Token expired" }));
        return null;
    }

    req.user = payload;

    return payload;
}

export function authorizeRole(req, res, requiredRole) {
    if (!req.user) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return false;
    }
    if (req.user.role !== requiredRole) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Forbidden: insufficient permissions' }));
        return false;
    }

    return true;
}