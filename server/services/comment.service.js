import {
    save, fetchParentComments, cancel, fetchCommentById,
    fetchReplies, edit, commentAddLike, deleteLike
} from "../data-access/comment.repository.js";
import { AuthorizationError } from "../errors/custom-errors.js";
import { isEmpty } from "../utils/general.js";
import logger from "../utils/logger.js";
import { Comment } from "../models/comment.model.js";

const LOG_CONTEXT = "Comment Service";

export async function saveComment(comment, traceId) {
    const LOCAL_LOG_CONTEXT = "Save";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, "Sending request to the repository layer");

    try {
        const result = await save(comment.isReply
            ? new Comment(comment).toWriteReply()
            : new Comment(comment).toWriteParent(), traceId);
        return Comment.fromDBRow(result)
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
            return Comment.fromDBRow(parentComment).toRead();
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

        const replies = res.comments.map(parentComment => {
            return Comment.fromDBRow(parentComment).toRead();
        });

        return { totalCount: res.totalCount, comments: replies };

    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error fetching replies for parentId: [${parentId}]. Error: [${error.message}]`);
        throw error;
    }
}

export async function modifyComment(id, user, content, traceId) {
    const LOCAL_LOG_CONTEXT = "Edit Comment";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Edit comment with id: [${id}]`);

    try {
        const comment = await fetchCommentById(id, traceId);
        if (!comment) throw new NotFoundError("Comment not found");
        const isOwner = comment.user_id === user.id;

        if (!isOwner) {
            throw new AuthorizationError("You are not allowed to edit this comment");
        }

        return await edit(id, content, traceId);

    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error edit comment with id: [${id}]. Error: [${error.message}]`);
        throw error;
    }
}

export async function addLikeToTheComment(commentId, user, traceId) {
    const LOCAL_LOG_CONTEXT = "Add Like";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Adding like to comment with id: [${commentId}]`);

    try {
        const comment = await fetchCommentById(commentId, traceId);
        if (!comment) throw new NotFoundError("Comment not found");

        return await commentAddLike(commentId, user, traceId);
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error adding like to the comment with id: [${commentId}]. Error: [${error.message}]`);
        throw error;
    }
}

export async function removeLike(commentId, user, traceId) {
    const LOCAL_LOG_CONTEXT = "Remove Like";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Deleting like to comment with id: [${commentId}]`);

    try {
        const comment = await fetchCommentById(commentId, traceId);
        if (!comment) throw new NotFoundError("Comment not found");

        return await deleteLike(commentId, user, traceId);
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error deleting like to the comment with id: [${commentId}]. Error: [${error.message}]`);
        throw error;
    }
}