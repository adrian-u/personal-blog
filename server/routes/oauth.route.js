import { handleGoogleToken } from '../controllers/oauth.controller.js';

export async function oauthRoute(req, res) {
    if (req.method === 'POST' && req.url === '/api/v1/oauth/google/token') {
      return await handleGoogleToken(req, res);
    }
  }