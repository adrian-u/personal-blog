import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';
import dotenv from "dotenv";

dotenv.config();

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
        sub: payload.email,
        role: payload.role,
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