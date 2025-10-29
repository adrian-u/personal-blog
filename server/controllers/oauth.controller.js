import { OAUTH_PROVIDERS } from '../strategies/oauth-strategies.js';
import { saveUser } from '../services/user.service.js';
import { createJWT } from '../services/oauth.service.js';
import { InvalidProvider, SavingError } from '../errors/custom-errors.js';
import logger from '../utils/logger.js';

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
    const jwt = createJWT(createdUser);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ token: jwt }));

}
