import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';
import dotenv from "dotenv";

dotenv.config();

export async function exchangeCodeForToken(code, redirect_uri) {
    const client_id = process.env.GOOGLE_CLIENT_ID;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;

    const res = await fetch(`https://oauth2.googleapis.com/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            code,
            client_id,
            client_secret,
            redirect_uri,
            grant_type: 'authorization_code'
        })
    });

    if (!res.ok) {
        throw new Error('Failed to exchange code for token');
    }

    return await res.json();
}

export async function decodeJwt(jwt) {
    const payload = jwt.split('.')[1];
    return await JSON.parse(Buffer.from(payload, 'base64url').toString());
}

export async function createJWT(payload) {
    const header = {
        alg: 'HS256',
        typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);

    const fullPayload = {
        ...payload,
        iat: now,
        exp: now + 60 * 60 * 24 * 30,
    };


    const encode = obj =>
        Buffer.from(JSON.stringify(obj)).toString('base64url');

    const encodedHeader = encode(header);
    const encodedPayload = encode({ fullPayload });

    const signature = crypto
        .createHmac('sha256', process.env.JWT_SECRET)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64url');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}