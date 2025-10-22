import { verifyJWT, authorizeRole } from "../services/oauth.service.js";
import { registerRoute } from "./router.manager.js";
import { createArticle, getArticlesCreator, getWipArticle, updateArticle, deleteArticle, getArticles } from "../controllers/article.controller.js";

registerRoute("POST", "/api/v1/article", async (req, res) => {

    _creatorOperations(req, res);

    await createArticle(req, res);
});

registerRoute("GET", "/api/v1/article/wip", async (req, res) => {

    _creatorOperations(req, res);

    await getArticlesCreator(res);
});

registerRoute("GET", "/api/v1/article/wip/:id", async (req, res, params) => {
    const { id } = params;

    _creatorOperations(req, res);

    await getWipArticle(res, req, id);
});

registerRoute("PATCH", "/api/v1/article/wip/:id", async (req, res, params) => {
    const { id } = params;

    _creatorOperations(req, res);

    await updateArticle(req, res, id);
});

registerRoute("DELETE", "/api/v1/article/wip/:id", async (req, res, params) => {
    const { id } = params;

    _creatorOperations(req, res);

    await deleteArticle(req, res, id);
})

registerRoute("GET", "/api/v1/article/:category", async (req, res, params) => {
    const { category } = params;

    const url = new URL(req.url, `http://${req.headers.host}`);
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const offset = parseInt(url.searchParams.get("offset")) || 0;

    await getArticles(req, res, category, limit, offset);
})

function _creatorOperations(req, res) {
    const user = verifyJWT(req, res);
    if (!user) return;

    if (!authorizeRole(req, res, "creator")) return;
}