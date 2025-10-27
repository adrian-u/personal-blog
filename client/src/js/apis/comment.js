import { getJWT } from "../auth/auth.js";
import logger from "../utils/logger.js";

const LOG_CONTEXT = "Comment APIs";

export async function createComment(comment, userId, articleId) {
    const LOCAL_LOG_CONTEXT = "Create";

    const url = `${import.meta.env.VITE_API_URL}/comment`;

    try {
        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Calling backend url: [${url}]`);

        const createdComment = await fetch(`${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getJWT()}`
            },
            body: JSON.stringify({ articleId, userId, content: comment.content, isReply: comment.isReply, parentId: comment.parentId }),
        });

        if (!createdComment.ok) {
            const errorData = await createdComment.json();
            throw new Error(errorData.error || `Request failed with ${res.status}`);
        }

        return await createdComment.json();
    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}

export async function fetchParentComments(articleId, limit = 10, offset = 0) {

    const LOCAL_LOG_CONTEXT = "Load Parent Comments";

    const url = `${import.meta.env.VITE_API_URL}/comment/parent/${articleId}?limit=${limit}&offset=${offset}`;

    try {
        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Calling backend url: [${url}]`);

        const parentComments = await fetch(`${url}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!parentComments.ok) {
            const errorData = await parentComments.json();
            throw new Error(errorData.error || `Request failed with ${res.status}`);
        }

        return await parentComments.json();
    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}

export async function deleteComment(commentId) {
    const LOCAL_LOG_CONTEXT = "Delete Comment";

    const url = `${import.meta.env.VITE_API_URL}/comment/${commentId}`;

    try {
        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Calling backend url: [${url}]`);

        await fetch(`${url}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getJWT()}`
            }
        });
    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}

export async function fetchReplies(parentId, limit = 10, offset = 0) {
    const LOCAL_LOG_CONTEXT = "Fetch Replies";

    const url = `${import.meta.env.VITE_API_URL}/comment/parent/${parentId}/replies?limit=${limit}&offset=${offset}`;

    try {
        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Calling backend url: [${url}]`);
        const replies = await fetch(`${url}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!replies.ok) {
            const errorData = await replies.json();
            throw new Error(errorData.error || `Request failed with ${res.status}`);
        }

        return await replies.json();
    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}

export async function editComment(id, content) {
    const LOCAL_LOG_CONTEXT = "Edit Comment";

    const url = `${import.meta.env.VITE_API_URL}/comment/${id}`;

    try {
        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Calling backend url: [${url}]`);

        const res = await fetch(`${url}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getJWT()}`
            },
            body: JSON.stringify({ content }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || `Request failed with ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}