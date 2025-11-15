import { navigateTo } from '../router/router.js';
import logger from '../utils/logger.js';
import { OAUTH_PROVIDERS } from './providers.js';

export async function authWithProvider(providerKey) {
    const provider = OAUTH_PROVIDERS[providerKey];
    if (!provider) throw new Error(`Unknown provider: ${providerKey}`);

    const authUrl = `${provider.authUrl}` +
        `?response_type=code` +
        `&client_id=${provider.clientId}` +
        `&redirect_uri=${encodeURIComponent(provider.redirectUri)}` +
        `&scope=${encodeURIComponent(provider.scope)}` +
        `&state=${providerKey}`;

    window.location.href = authUrl;
}

export async function handleOAuthCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const providerKey = params.get('state');

    if (!providerKey) {
        logger("error", "OAuth Callback", "No provider state found");
        await _handleLoginError();
        return;
    }

    const provider = OAUTH_PROVIDERS[providerKey];
    if (!provider) {
        logger("error", "OAuth Callback", `Invalid provider: ${providerKey}`);
        await _handleLoginError();
        return;
    }

    if (!code) {
        logger("error", "OAuth Callback", "No authorization code found");
        await _handleLoginError();
        return;
    }

    try {
        const response = await fetch(provider.tokenEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                provider: providerKey,
                code,
                redirect_uri: provider.redirectUri
            })
        });

        if (!response.ok) {
            throw new Error(`Token exchange failed: ${response.status}`);
        }

        const { token } = await response.json();
        localStorage.setItem('jwt', token);
        await _initOnRedirects();
    } catch (error) {
        logger("error", "OAuth Callback", `OAuth callback failed: [${error}]`);
        await _handleLoginError();
    }
}

export function getJWT() {
    return localStorage.getItem('jwt');
}

export function getUserFromJWT() {
    const jwt = getJWT();
    if (!jwt) return null;

    try {
        const payload = JSON.parse(atob(jwt.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);

        if (payload.exp < now) {
            return null;
        }

        return payload;
    } catch {
        logger("error", "Get User From JWT", "Invalid JWT");
        return null;
    }
}

export async function refreshAccessToken() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/oauth/refresh`, {
        method: "POST",
        credentials: "include"
    });

    if (!res.ok) return null;

    const { token } = await res.json();
    localStorage.setItem("jwt", token);
    return token;
}

export async function logout() {
    await fetch(`${import.meta.env.VITE_API_URL}/oauth/logout`, {
        method: "DELETE",
        credentials: "include"
    });
    localStorage.removeItem('jwt');
    window.location.href = '/';
}

export async function tryInitialRefresh() {
    try {
        await refreshAccessToken();
    } catch (e) {
    }
}

async function _handleLoginError() {
    sessionStorage.setItem('toastMessage', 'Login failed. Please try again.');
    await _initOnRedirects();
}

async function _initOnRedirects() {
    navigateTo('/');
}