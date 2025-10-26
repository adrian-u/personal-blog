import {
    save, fetchParentComments, cancel, fetchCommentById,
    fetchReplies
} from "../data-access/comment.repository.js";
import { AuthorizationError } from "../errors/custom-errors.js";
import { isEmpty } from "../utils/general.js";
import logger from "../utils/logger.js";

const LOG_CONTEXT = "Comment Service";

export async function saveComment(comment, traceId) {
    const LOCAL_LOG_CONTEXT = "Save";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, "Sending request to the repository layer");

    try {
        const savedComment = await save(comment, traceId);
        return {
            id: savedComment.id,
            userId: savedComment.user_id,
            articleId: savedComment.article_id,
            content: savedComment.content,
            createdAt: savedComment.created_at,
            author: {
                name: savedComment.name,
                avatar: savedComment.avatarurl,
                role: savedComment.role,
            }
        }
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error saving the comment: [${error.message}]`);
        throw error;
    }
}

export async function getParentComments(articleId, traceId, limit, offset) {
    const LOCAL_LOG_CONTEXT = "Get Parent Comments";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Sending request to the repository layer for articleId: [${articleId}]`);

    try {
        const res = await fetchParentComments(articleId, traceId, limit, offset);
        if (isEmpty(res.comments)) {
            return { totalCount: 0, comments: [] };
        }

        const parentComments = res.comments.map(parentComment => {
            return {
                id: parentComment.id,
                userId: parentComment.user_id,
                articleId: parentComment.article_id,
                content: parentComment.content,
                createdAt: parentComment.created_at,
                author: {
                    name: parentComment.name,
                    avatar: parentComment.avatarurl,
                    role: parentComment.role,
                }
            }
        });

        return { totalCount: res.totalCount, comments: parentComments };
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error fetching parent comments for articleId: [${articleId}]. Error: [${error.message}]`);
        throw error;
    }
}

export async function deleteCommentByOwnerOrAdmin(commentId, user, traceId) {
    const LOCAL_LOG_CONTEXT = "Delete Comment by Owner od Admin";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Sending delete request to the repository layer for commentId: [${commentId}]
         requested by userId: ${user.id}`);

    try {

        const comment = await fetchCommentById(commentId, traceId);
        if (!comment) throw new NotFoundError("Comment not found");
        const isOwner = comment.user_id === user.id;
        const isCreatorRole = user.role === "creator";

        if (!isOwner && !isCreatorRole) {
            throw new AuthorizationError("You are not allowed to delete this comment");
        }

        await cancel(commentId, traceId);
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error deleting comment with id: [${commentId}]. Error: [${error.message}]`);
        throw error;
    }
}

export async function getRepliesByParentComment(parentId, limit, offset, traceId) {
    const LOCAL_LOG_CONTEXT = "Get Replies by Parent";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Get replies to parent comment: [${parentId}]`);

    try {
        const res = await fetchReplies(parentId, limit, offset, traceId);

        if (isEmpty(res.comments)) {
            return { totalCount: 0, comments: [] };
        }

        const replies = res.comments.map(comment => {
            return {
                id: comment.id,
                userId: comment.user_id,
                articleId: comment.article_id,
                parentId: comment.parent_id,
                content: comment.content,
                createdAt: comment.created_at,
                author: {
                    name: comment.name,
                    avatar: comment.avatarurl,
                    role: comment.role,
                }
            }
        });

        return { totalCount: res.totalCount, comments: replies };

    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error fetching replies for parentId: [${parentId}]. Error: [${error.message}]`);
        throw error;
    }
}