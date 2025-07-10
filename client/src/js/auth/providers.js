export const OAUTH_PROVIDERS = {
    google: {
        name: 'Google',
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        scope: 'openid profile email',
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
        tokenEndpoint: `${import.meta.env.VITE_API_URL}/oauth/token`
    },
    github: {
        name: 'GitHub',
        authUrl: 'https://github.com/login/oauth/authorize',
        scope: 'read:user user:email',
        clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
        redirectUri: import.meta.env.VITE_GITHUB_REDIRECT_URI,
        tokenEndpoint: `${import.meta.env.VITE_API_URL}/oauth/token`
    },
};