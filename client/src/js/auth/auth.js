import { navigateTo } from '../router/router.js';
import { OAUTH_PROVIDERS } from './providers.js';

export function authWithProvider(providerKey) {
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
    console.error('No provider state found');
    await _handleLoginError();
    return;
  }

  const provider = OAUTH_PROVIDERS[providerKey];
  if (!provider) {
    console.error(`Invalid provider: ${providerKey}`);
    await _handleLoginError();
    return;
  }

  if (!code) {
    console.error('No authorization code found');
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
  } catch (err) {
    console.error('OAuth callback failed:', err);
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
    return payload;
  } catch {
    console.error('Invalid JWT');
    return null;
  }
}

export function logout() {
  localStorage.removeItem('jwt');
  window.location.href = '/';
}

async function _handleLoginError() {
  sessionStorage.setItem('toastMessage', 'Login failed. Please try again.');
  await _initOnRedirects();
}

async function _initOnRedirects() {
  navigateTo('/');
}