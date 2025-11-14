import { OAUTH_PROVIDERS } from '../strategies/oauth-strategies.js';
import { saveUser } from '../services/user.service.js';
import { createJWT, generateRefreshToken } from '../services/oauth.service.js';
import { InvalidProvider } from '../errors/custom-errors.js';
import logger from '../utils/logger.js';
import { storeRefreshToken, deleteRefreshToken } from '../data-access/tokens.repository.js';

const LOG_CONTEXT = "Handle OAuth Token";
const isProd = process.env.NODE_ENV === "prod";

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
    await storeRefreshToken(createdUser.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    const jwt = createJWT(createdUser);

    const cookie = [
        `refreshToken=${refreshToken}`,
        "HttpOnly",
        "Path=/",
        "SameSite=Lax",
        "Secure",
        `Max-Age=${7 * 24 * 60 * 60}`,
    ];
    res.writeHead(200,
        {
            "Content-Type": "application/json",
            "Set-Cookie": cookie.join("; "),
        });
    res.end(JSON.stringify({ token: jwt }));

}

export async function handleLogout(req, res) {
    const LOCAL_LOG_CONTEXT = "Logout";

    logger("info", req.traceId, `${LOCAL_LOG_CONTEXT}-${LOG_CONTEXT}`, "Start Logout flow");

    const deleteCookie = [
        `refreshToken=`,
        "HttpOnly",
        "Path=/",
        "SameSite=Lax",
        "Secure",
        "Max-Age=0",
    ];

    const token = req.cookies.refreshToken;
    if (token) await deleteRefreshToken(token);

    res.writeHead(200, {
        "Set-Cookie": deleteCookie.join("; ")
    });
    res.end();
}
