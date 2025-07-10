import { OAUTH_PROVIDERS } from '../strategies/oauth-strategies.js';
import { saveUser } from '../services/user.service.js';
import { createJWT } from '../services/oauth.service.js';
import { SavingError } from '../errors/custom-errors.js';
import dotenv from "dotenv";

dotenv.config();

export async function handleOAuthToken(req, res) {

    try {
        let body = '';
        for await (const chunk of req) body += chunk;
        const { code, redirect_uri, provider } = JSON.parse(body);

        const strategy = OAUTH_PROVIDERS[provider];
        if (!strategy) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: 'Unsupported provider' }));
        }

        const tokens = await strategy.exchangeCodeForToken(code, redirect_uri);
        const userData = await strategy.getUserInfo(tokens);

        const user = {
            email: userData.email,
            role: userData.email === process.env.CREATOR_EMAIL ? 'creator' : 'user',
            name: userData.name,
            avatar: userData.picture,
            provider: provider
        };

        await saveUser(user);
        const jwt = await createJWT(user);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ token: jwt }));
    } catch (error) {
        console.error(error);
        res.writeHead(error instanceof SavingError ? 500 : 400);
        res.end(JSON.stringify({ error: error.message }));
    }
}
