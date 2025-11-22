import { registerRoute } from "./router.manager.js";
import {
    createComment, loadParentComments, deleteComment,
    loadParentReplies, editComment, addLikeComment, removeLikeComment
} from "../controllers/comment.controller.js";
import { withErrorHandling } from "../middlewares/error-handler.js";
import { withAuthentication } from "../middlewares/oauth.js";
import { withRateLimit } from "../middlewares/rate-limit.js";

registerRoute("POST", "/api/v1/comment",
    withErrorHandling(
        withRateLimit(
            withAuthentication(createComment)))
);

registerRoute("GET", "/api/v1/comment/parent/:articleId",
    withErrorHandling(loadParentComments)
);

registerRoute("DELETE", "/api/v1/comment/:id",
    withErrorHandling(
        withAuthentication(deleteComment))
);

registerRoute("GET", "/api/v1/comment/parent/:parentId/replies",
    withErrorHandling(loadParentReplies)
);

registerRoute("PATCH", "/api/v1/comment/:id",
    withErrorHandling(
        withRateLimit(
            withAuthentication(editComment)))
);

registerRoute("POST", "/api/v1/comment/like/:id",
    withErrorHandling(
        withRateLimit(
            withAuthentication(addLikeComment)))
);

registerRoute("DELETE", "/api/v1/comment/like/:id",
    withErrorHandling(
        withAuthentication(removeLikeComment))
);
