import logger from "../utils/logger.js";
import {
    saveComment, getParentComments,
    deleteCommentByOwnerOrAdmin, getRepliesByParentComment
} from "../services/comment.service.js";
import { checkIfCommentBodyIsValid } from "../utils/comment-utils.js";
import { BadInput } from "../errors/custom-errors.js";
import { isNumber } from "../utils/general.js";

const LOG_CONTEXT = "Comment Controller"

export async function createComment(req, res) {

    const LOCAL_LOG_CONTEXT = "Creation";

    try {
        checkIfCommentBodyIsValid(req.body, req.traceId);
        const createdArticle = await saveComment(req.body, req.traceId);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(createdArticle));
    } catch (error) {
        logger("error", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error saving comment: [${error}]`)
        const status = error.statusCode || 500;
        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            name: error.name || "InternalServerError",
            error: error.message
        }));
    }

}

export async function loadParentComments(req, res, articleId, limit, offset) {
    const LOCAL_LOG_CONTEXT = "Load Parent Comments";

    try {
        const parentArticles = await getParentComments(articleId, req.traceId, limit, offset);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(parentArticles));
    } catch (error) {
        logger("error", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error fetching comments for articleId: [${articleId}]. Error [${error}]`)
        const status = error.statusCode || 500;
        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            name: error.name || "InternalServerError",
            error: error.message
        }));
    }
}

export async function deleteComment(req, res, commentId, user) {
    const LOCAL_LOG_CONTEXT = "Delete Comment";

    try {

        if (!isNumber(commentId)) {
            throw new BadInput(`The commentId: [${commentId}] is not valid`);
        }

        await deleteCommentByOwnerOrAdmin(commentId, user, req.traceId);
        res.writeHead(204);
        res.end();
    } catch (error) {
        logger("error", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error deleting comment with id: [${commentId}]. Error [${error}]`)
        const status = error.statusCode || 500;
        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            name: error.name || "InternalServerError",
            error: error.message
        }));
    }
}

export async function loadParentReplies(req, res, parentId, limit, offset) {
    const LOCAL_LOG_CONTEXT = "Load Parent Replies";

    try {
        if (!isNumber(parentId)) {
            throw new BadInput(`The parentId: [${parentId}] is not valid`);
        }

        const replies = await getRepliesByParentComment(parentId, limit, offset, req.traceId);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(replies))
    } catch (error) {
        logger("error", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error fetching replies for parent comment with id: [${parentId}]. Error [${error}]`)
        const status = error.statusCode || 500;
        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            name: error.name || "InternalServerError",
            error: error.message
        }));
    }
}