import { OAUTH_PROVIDERS } from '../strategies/oauth-strategies.js';
import { saveUser } from '../services/user.service.js';
import { createJWT, generateRefreshToken } from '../services/oauth.service.js';
import { InvalidProvider } from '../errors/custom-errors.js';
import logger from '../utils/logger.js';
import { storeRefreshToken, deleteRefreshToken, refreshTokens } from '../data-access/tokens.repository.js';
import { REFRESH_TOKEN_EXPIRATION_MS } from '../config/tokens.js';

const LOG_CONTEXT = "Handle OAuth Token";

export async function handleOAuthToken(req, res) {

    const { code, redirect_uri, provider } = req.body;

    logger("info", req.traceId, LOG_CONTEXT, `Start exchange for JWT with provider: [${provider}]`);

    const strategy = OAUTH_PROVIDERS[provider];
    if (!strategy) {
        logger("error", req.traceId, LOG_CONTEXT, `The provider: [${provider}] is not supported`);
        throw new InvalidProvider(`The provider: [${provider}] is not supported`);
    }

    const token = await strategy.exchangeCodeForToken(code, redirect_uri);
    const userData = await strategy.getUserInfo(token);

    const createdUser = await saveUser(userData, provider, req.traceId);
    const refreshToken = generateRefreshToken();
    await storeRefreshToken(createdUser.id, refreshToken, new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_MS), req.traceId);
    const jwt = createJWT(createdUser);

    res.writeHead(200,
        {
            "Content-Type": "application/json",
            "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${Math.floor(REFRESH_TOKEN_EXPIRATION_MS / 1000)}`
        });
    res.end(JSON.stringify({ token: jwt }));

}

export async function handleLogout(req, res) {
    const LOCAL_LOG_CONTEXT = "Logout";

    logger("info", req.traceId, `${LOCAL_LOG_CONTEXT}-${LOG_CONTEXT}`, "Start Logout flow");

    const token = req.cookies.refreshToken;
    if (token) await deleteRefreshToken(token, req.traceId);

    res.writeHead(200, {
        "Set-Cookie": `refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0}`
    });
    res.end();
}

export async function refreshAccessToken(req, res) {
    const LOCAL_LOG_CONTEXT = "Refresh Token";
    logger("info", req.traceId, `${LOCAL_LOG_CONTEXT}-${LOG_CONTEXT}`, "Start refresh token flow");

    const token = req.cookies.refreshToken;
    if (!token) {
        logger("error", req.traceId, `${LOCAL_LOG_CONTEXT}-${LOG_CONTEXT}`, "Refresh token missing");
        res.writeHead(401, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ name: "Auth Error", message: "Unauthorized" }));
    }

    try {
        const { newRefresh, newAccessToken } = await refreshTokens(token, req.traceId);
        res.writeHead(200,
            {
                "Content-Type": "application/json",
                "Set-Cookie": `refreshToken=${newRefresh}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${REFRESH_TOKEN_EXPIRATION_MS / 1000}`
            });
        res.end(JSON.stringify({ token: newAccessToken }));
    } catch (error) {
        logger("error", req.traceId, `${LOCAL_LOG_CONTEXT}-${LOG_CONTEXT}`, `Failed to refresh tokens. Error: [${error}]`);
        throw error;
    }
}
