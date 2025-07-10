import { navigateTo } from '../router/router.js';

export function authGoogle() {
  const scope = "openid profile email";
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth` +
    `?response_type=code` +
    `&client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(import.meta.env.VITE_GOOGLE_REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(scope)}`;

  window.location.href = authUrl;
}

export async function handleGoogleCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (!code) {
    console.error('No authorization code found');
    await _handleLoginError();
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/oauth/google/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI
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