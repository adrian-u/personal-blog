import { verifyJWT, authorizeRole } from "../services/oauth.service.js";
import { registerRoute } from "./router.manager.js";
import { createArticle, getArticlesCreator } from "../controllers/article.controller.js";

registerRoute("POST", "/api/v1/article", async(req, res) => {

    const user = verifyJWT(req, res);
    if (!user) return;

    if(!authorizeRole(req, res, "creator")) return;
    
    await createArticle(req, res);
});

registerRoute("GET", "/api/v1/article", async(req, res) => {

    const user = verifyJWT(req, res);
    if (!user) return;

    if(!authorizeRole(req, res, "creator")) return;

    await getArticlesCreator(res);
})