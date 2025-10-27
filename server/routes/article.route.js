import { verifyJWT, authorizeRole } from "../services/oauth.service.js";
import { registerRoute } from "./router.manager.js";
import {
    createArticle, getArticlesCreator, getWipArticle, updateArticle,
    deleteArticle, getArticles, getArticleForReading
} from "../controllers/article.controller.js";

registerRoute("POST", "/api/v1/article", async (req, res) => {

    if (!_creatorOperations(req, res)) return;

    await createArticle(req, res);
});

registerRoute("GET", "/api/v1/article/wip", async (req, res) => {

    if (!_creatorOperations(req, res)) return;

    await getArticlesCreator(req, res);
});

registerRoute("GET", "/api/v1/article/wip/:id", async (req, res, params) => {
    const { id } = params;

    if (!_creatorOperations(req, res)) return;

    await getWipArticle(req, res, id);
});

registerRoute("PATCH", "/api/v1/article/wip/:id", async (req, res, params) => {
    const { id } = params;

    if (!_creatorOperations(req, res)) return;

    await updateArticle(req, res, id);
});

registerRoute("DELETE", "/api/v1/article/wip/:id", async (req, res, params) => {
    const { id } = params;

    if (!_creatorOperations(req, res)) return;

    await deleteArticle(req, res, id);
})

registerRoute("GET", "/api/v1/article/category/:category", async (req, res, params) => {
    const { category } = params;

    const protocol = req.headers['x-forwarded-proto'] || 'http';

    const url = new URL(req.url, `${protocol}://${req.headers.host}`);
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const offset = parseInt(url.searchParams.get("offset")) || 0;

    await getArticles(req, res, category, limit, offset);
})

registerRoute("GET", "/api/v1/article/:id", async (req, res, params) => {
    const { id } = params;

    await getArticleForReading(req, res, id);
});

function _creatorOperations(req, res) {
    try {
        verifyJWT(req);
        if (!authorizeRole(req, "creator")) {
            throw new Error("Forbidden: insufficient permissions");
        }
        return true;
    } catch (error) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ name: "Authorization issues", error: error.message }));
        return false;
    }
}