import { verifyJWT, authorizeRole } from "../services/oauth.service.js";
import { registerRoute } from "./router.manager.js";
import { createArticle, getArticlesCreator, getWipArticle, updateArticle } from "../controllers/article.controller.js";

registerRoute("POST", "/api/v1/article", async (req, res) => {

    _creatorOperations(req, res);

    await createArticle(req, res);
});

registerRoute("GET", "/api/v1/article", async (req, res) => {

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
})

function _creatorOperations(req, res) {
    const user = verifyJWT(req, res);
    if (!user) return;

    if (!authorizeRole(req, res, "creator")) return;
}