import logger from "../utils/logger.js";
import {
    saveComment, getParentComments,
    deleteCommentByOwnerOrAdmin, getRepliesByParentComment, modifyComment,
    addLikeToTheComment, removeLike
} from "../services/comment.service.js";
import { checkIfCommentBodyIsValid } from "../utils/comment-utils.js";
import { BadInput } from "../errors/custom-errors.js";
import { isEmpty, isNumber } from "../utils/general.js";
import { Comment } from "../models/comment.model.js";

const LOG_CONTEXT = "Comment Controller"

export async function createComment(req, res) {

    const LOCAL_LOG_CONTEXT = "Creation";

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, "Start creation of the comment");

    checkIfCommentBodyIsValid(req.body, req.traceId);
    const createdArticle = await saveComment(req.body, req.traceId);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(new Comment(createdArticle).toRead()));

}

export async function loadParentComments(req, res, params) {
    const LOCAL_LOG_CONTEXT = "Load Parent Comments";

    const { articleId } = params;

    const protocol = req.headers['x-forwarded-proto'] || 'http';

    const url = new URL(req.url, `${protocol}://${req.headers.host}`);
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const offset = parseInt(url.searchParams.get("offset")) || 0;

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start loading of parent comments for article: [${articleId}]`);

    const parentArticles = await getParentComments(articleId, req.traceId, limit, offset);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(parentArticles));
}

export async function deleteComment(req, res, params) {
    const LOCAL_LOG_CONTEXT = "Delete Comment";

    const { id } = params;

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start deleting comment with id: [${id}]`);

    if (!isNumber(id)) {
        throw new BadInput(`The commentId: [${id}] is not valid`);
    }

    await deleteCommentByOwnerOrAdmin(id, req.user, req.traceId);
    res.writeHead(204);
    res.end();
}

export async function loadParentReplies(req, res, params) {
    const LOCAL_LOG_CONTEXT = "Load Parent Replies";

    const { parentId } = params;

    const protocol = req.headers['x-forwarded-proto'] || 'http';

    const url = new URL(req.url, `${protocol}://${req.headers.host}`);
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const offset = parseInt(url.searchParams.get("offset")) || 0;

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start loading replies for comment with id: [${parentId}]`);

    if (!isNumber(parentId)) {
        throw new BadInput(`The parentId: [${parentId}] is not valid`);
    }

    const replies = await getRepliesByParentComment(parentId, limit, offset, req.traceId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(replies))
}

export async function editComment(req, res, params) {
    const LOCAL_LOG_CONTEXT = "Edit Comment";

    const { id } = params;

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start editing comment with id: [${id}]`);

    if (!isNumber(id)) {
        throw new BadInput(`The id: [${id}] is not valid`);
    }

    if (isEmpty(req.body)) {
        throw new BadInput(`The comment can't be null`);
    }

    const edited = await modifyComment(id, req.user, req.body.content, req.traceId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(edited));

}

export async function addLikeComment(req, res, params) {

    const LOCAL_LOG_CONTEXT = "Add Like";

    const { id } = params;

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start adding like to comment with id: [${id}]`);

    const commentLikes = await addLikeToTheComment(id, req.user, req.traceId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(commentLikes));
}

export async function removeLikeComment(req, res, params) {
    const LOCAL_LOG_CONTEXT = "Remove Like";

    const { id } = params;

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start removing like from the comment with id: [${id}]`);

    const commentLikes = await removeLike(id, req.user, req.traceId)
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(commentLikes))

}