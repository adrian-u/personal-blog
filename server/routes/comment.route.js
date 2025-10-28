import { registerRoute } from "./router.manager.js";
import { verifyJWT } from "../services/oauth.service.js";
import {
    createComment, loadParentComments, deleteComment,
    loadParentReplies, editComment, addLikeComment, removeLikeComment
} from "../controllers/comment.controller.js";

registerRoute("POST", "/api/v1/comment", async (req, res) => {

    if (!_isLoggedUser(req, res)) return;

    await createComment(req, res);
});

registerRoute("GET", "/api/v1/comment/parent/:articleId", async (req, res, params) => {
    const { articleId } = params;

    const protocol = req.headers['x-forwarded-proto'] || 'http';

    const url = new URL(req.url, `${protocol}://${req.headers.host}`);
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const offset = parseInt(url.searchParams.get("offset")) || 0;

    await loadParentComments(req, res, articleId, limit, offset);
});

registerRoute("DELETE", "/api/v1/comment/:id", async (req, res, params) => {
    const { id } = params;

    const user = _isLoggedUser(req, res);

    if (!user) return;

    await deleteComment(req, res, id, user);
});

registerRoute("GET", "/api/v1/comment/parent/:parentId/replies", async (req, res, params) => {
    const { parentId } = params;

    const protocol = req.headers['x-forwarded-proto'] || 'http';

    const url = new URL(req.url, `${protocol}://${req.headers.host}`);
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const offset = parseInt(url.searchParams.get("offset")) || 0;

    await loadParentReplies(req, res, parentId, limit, offset);

});

registerRoute("PATCH", "/api/v1/comment/:id", async (req, res, params) => {
    const { id } = params;

    const user = _isLoggedUser(req, res);

    if (!user) return;

    await editComment(req, res, id, user);
});

registerRoute("POST", "/api/v1/comment/like/:id", async (req, res, params) => {

    const { id } = params;

    const user = _isLoggedUser(req, res);

    if (!user) return;

    await addLikeComment(req, res, id, user);
});

registerRoute("DELETE", "/api/v1/comment/like/:id", async (req, res, params) => {

    const { id } = params;

    const user = _isLoggedUser(req, res);

    if (!user) return;

    await removeLikeComment(req, res, id, user);

});

function _isLoggedUser(req, res) {
    try {
        return verifyJWT(req);
    } catch (error) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            name: "Unauthorized Error",
            error: error.message
        }));
        return null;
    }
}