import { registerRoute } from "./router.manager.js";
import {
    createArticle, getArticlesCreator, getWipArticle, updateArticle,
    deleteArticle, getArticles, getArticleForReading,
    addArticleToFavorites, removeArticleFromFavorites, getFavoriteArticles
} from "../controllers/article.controller.js";
import { withAuthentication, withAuthorization } from "../middlewares/oauth.js";
import { withErrorHandling } from "../middlewares/error-handler.js";

registerRoute("POST", "/api/v1/article",
    withErrorHandling(
        withAuthentication(
            withAuthorization(createArticle)))
);

registerRoute("GET", "/api/v1/article/wip",
    withErrorHandling(
        withAuthentication(
            withAuthorization(getArticlesCreator)))
);

registerRoute("GET", "/api/v1/article/wip/:id",
    withErrorHandling(
        withAuthentication(
            withAuthorization(getWipArticle)))
);

registerRoute("PATCH", "/api/v1/article/wip/:id",
    withErrorHandling(
        withAuthentication(
            withAuthorization(updateArticle)))
);

registerRoute("DELETE", "/api/v1/article/wip/:id",
    withErrorHandling(
        withAuthentication(
            withAuthorization(deleteArticle)))
);

registerRoute("GET", "/api/v1/article/category/:category",
    withErrorHandling(getArticles)
);

registerRoute("GET", "/api/v1/article/:id",
    withErrorHandling(getArticleForReading)
);

registerRoute("POST", "/api/v1/article/:id/favorite",
    withErrorHandling(
        withAuthentication(addArticleToFavorites))
);

registerRoute("DELETE", "/api/v1/article/:id/favorite",
    withErrorHandling(
        withAuthentication(removeArticleFromFavorites))
);

registerRoute("GET", "/api/v1/articles/favorites",
    withErrorHandling(
        withAuthentication(getFavoriteArticles))
);