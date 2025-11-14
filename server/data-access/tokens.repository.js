import crypto from 'crypto';
import { db } from "../config/db.js";

export async function storeRefreshToken(userId, rtoken, expiresAt) {
    const hashed = crypto.createHash("sha256").update(rtoken).digest("hex");

    await db.query(
        `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3);`,
        [userId, hashed, expiresAt]);
}

export async function deleteRefreshToken(token) {
    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    await db.query(`DELETE FROM refresh_tokens WHERE token_hash=$1`, [hashed]);
}