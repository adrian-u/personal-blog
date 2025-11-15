import crypto from 'crypto';
import { db } from "../config/db.js";
import { AuthorizationError, DbError, NotFoundError } from '../errors/custom-errors.js';
import logger from '../utils/logger.js';
import { createJWT, generateRefreshToken } from '../services/oauth.service.js';
import { getUserDetailsById } from '../services/user.service.js';
import { REFRESH_TOKEN_EXPIRATION_MS } from '../config/tokens.js';

const LOG_CONTEXT = "Refresh Token Repository";

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

export async function refreshTokens(rToken, traceId) {
    const LOCAL_LOG_CONTEXT = "Refresh Tokens"
    const client = await db.connect();
    await client.query("BEGIN");

    const hashed = crypto.createHash("sha256").update(rToken).digest("hex");

    const { rows: [dbRToken] } = await db.query(`
        SELECT user_id, expires_at FROM refresh_tokens WHERE token_hash = $1;    
    `, [hashed]);

    if (!dbRToken) {
        logger("error", traceId, `${LOCAL_LOG_CONTEXT}-${LOG_CONTEXT}`, `refresh token not found on database`);
        throw new NotFoundError("Refresh Token not found");
    }

    if (dbRToken.expires_at < new Date(Date.now())) {
        logger("error", traceId, `${LOCAL_LOG_CONTEXT}-${LOG_CONTEXT}`, `refresh token expired`);
        throw new AuthorizationError("Refresh token expired");
    }

    const newRefresh = generateRefreshToken();

    try {
        await client.query(`DELETE FROM refresh_tokens WHERE token_hash=$1`, [hashed]);

        await client.query(
            `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
            [
                dbRToken.user_id,
                crypto.createHash("sha256").update(newRefresh).digest("hex"),
                new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_MS)
            ]
        );

        const user = await getUserDetailsById(dbRToken.user_id);
        const newAccessToken = createJWT(user);

        await client.query("COMMIT");

        return { newRefresh, newAccessToken };
    } catch (error) {
        await client.query("ROLLBACK");
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Transaction failed: [${error.stack}]`);
        throw new DbError("Failed to refresh tokens");
    } finally {
        client.release();
    }
}