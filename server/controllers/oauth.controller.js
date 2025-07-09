import User from '../models/user.model.js';
import { exchangeCodeForToken, decodeJwt, createJWT } from '../services/oauth.service.js';
import { saveUser } from '../services/user.service.js';
import { SavingError } from '../errors/custom-errors.js';
import dotenv from "dotenv";

dotenv.config();

export async function handleGoogleToken(req, res) {

    try {
        let body = '';
        for await (const chunk of req) body += chunk;
        const { code, redirect_uri } = JSON.parse(body);

        const token = await exchangeCodeForToken(code, redirect_uri);
        const googlePayload = await decodeJwt(await token.id_token);

        const user = new User(googlePayload.email,
            googlePayload.email === process.env.CREATOR_EMAIL ? 'creator' : 'user',
            googlePayload.name,
            googlePayload.picture);

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
