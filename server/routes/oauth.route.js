import { handleOAuthToken } from '../controllers/oauth.controller.js';
import { withErrorHandling } from '../middlewares/error-handler.js';
import { registerRoute } from './router.manager.js';

registerRoute('POST', '/api/v1/oauth/token',
    withErrorHandling(handleOAuthToken)
);