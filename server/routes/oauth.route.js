import { handleGoogleToken } from '../controllers/oauth.controller.js';
import { registerRoute } from './router.manager.js';

registerRoute('POST', '/api/v1/oauth/google/token', handleGoogleToken)