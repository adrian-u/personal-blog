import { registerRoute } from './router.manager.js';
import { getUserDetails } from '../controllers/user.controller.js'
import { withErrorHandling } from '../middlewares/error-handler.js';
import { withAuthentication } from '../middlewares/oauth.js';

registerRoute("GET", "/api/v1/user/:email",
    withErrorHandling(
        withAuthentication(getUserDetails))
);