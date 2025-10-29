import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';
import { AuthorizationError } from '../errors/custom-errors.js';

export function createJWT(payload) {
    const header = {
        alg: 'HS256',
        typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);

    const fullPayload = {
        sub: payload.email,
        role: payload.role,
        id: payload.id,
        iat: now,
        exp: now + 60 * 60 * 24 * 1,
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

export function verifyJWT(req) {

    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Missing or invalid Authorization header");
    }

    const token = authHeader.split(" ")[1];
    const parts = token.split('.');

    if (parts.length !== 3) {
        throw new Error("Malformed token");
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.JWT_SECRET)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64url');

    if (signature !== expectedSignature) {
        throw new AuthorizationError("Invalid token signature");
    }

    const payloadJSON = Buffer.from(encodedPayload, 'base64url').toString();
    const payload = JSON.parse(payloadJSON);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
        throw new AuthorizationError("Token expired");
    }

    return payload;
}

export function authorizeRole(req, requiredRole) {
    if (!req.user) {
        return false;
    }
    if (req.user.role !== requiredRole) {
        return false;
    }

    return true;
}