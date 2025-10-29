import { Buffer } from 'node:buffer';

export const OAUTH_PROVIDERS = {
    google: {
        async exchangeCodeForToken(code, redirect_uri) {
            const res = await fetch(process.env.GOOGLE_TOKEN_URL, {
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

        async getUserInfo(token) {
            const payload = token.id_token.split('.')[1];
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
            const res = await fetch(process.env.GITHUB_TOKEN_URL, {
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

        async getUserInfo(token) {
            const userRes = await fetch(process.env.GITHUB_USER_DETAILS_URL, {
                headers: { Authorization: `Bearer ${token.access_token}` }
            });
            const emailRes = await fetch(process.env.GITHUB_USER_EMAIL_URL, {
                headers: { Authorization: `Bearer ${token.access_token}` }
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