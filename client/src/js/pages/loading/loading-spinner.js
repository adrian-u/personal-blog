import { handleGoogleCallback } from '../../auth/auth.js';

export default async function buildLoadingPage() {
    const container = document.getElementById('view-container');

    container.innerHTML = `
      <div class="login-spinner-container">
        <div class="spinner"></div>
        <p>Logging in, please wait...</p>
      </div>
    `;

    await handleGoogleCallback();
}