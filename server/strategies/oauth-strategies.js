import { Buffer } from 'node:buffer';

export const OAUTH_PROVIDERS = {
    google: {
        async exchangeCodeForToken(code, redirect_uri) {
            const res = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    code,
                    client_id: process.env.GOOGLE_CLIENT_ID,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET,
                    redirect_uri,
                    grant_type: 'authorization_code',
                }),
            });

            if (!res.ok) throw new Error('Google token exchange failed');
            return await res.json();
        },

        async getUserInfo(tokens) {
            const payload = tokens.id_token.split('.')[1];
            const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString());
            return {
                email: decoded.email,
                name: decoded.name,
                picture: decoded.picture,
            };
        }
    },

    github: {
        async exchangeCodeForToken(code, redirect_uri) {
            const res = await fetch('https://github.com/login/oauth/access_token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    code,
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    redirect_uri,
                }),
            });

            if (!res.ok) throw new Error('GitHub token exchange failed');
            return await res.json();
        },

        async getUserInfo(tokens) {
            const userRes = await fetch('https://api.github.com/user', {
                headers: { Authorization: `Bearer ${tokens.access_token}` }
            });
            const emailRes = await fetch('https://api.github.com/user/emails', {
                headers: { Authorization: `Bearer ${tokens.access_token}` }
            });

            const user = await userRes.json();
            const emails = await emailRes.json();
            const primaryEmail = emails.find(e => e.primary && e.verified)?.email || emails[0].email;

            return {
                email: primaryEmail,
                name: user.name || user.login,
                picture: user.avatar_url
            };
        }
    },

};