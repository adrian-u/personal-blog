import { registerRoute } from './router.manager.js';
import { getUserDetails, deleteUser, getUserAvatar } from '../controllers/user.controller.js'
import { withErrorHandling } from '../middlewares/error-handler.js';
import { withAuthentication } from '../middlewares/oauth.js';

registerRoute("GET", "/api/v1/user/:id",
    withErrorHandling(
        withAuthentication(getUserDetails))
);

registerRoute("DELETE", "/api/v1/user/:id",
    withErrorHandling(
        withAuthentication(deleteUser))
);

registerRoute("GET", "/api/v1/user/avatars/:fileName",
    withErrorHandling(getUserAvatar)
);