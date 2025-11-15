import { fetchWithAuth } from "../apis/fetch-wrapper.js";
import logger from "../utils/logger.js";

const LOG_CONTEXT = "Comment APIs";

export async function createComment(comment, userId, articleId) {
    const LOCAL_LOG_CONTEXT = "Create";
    const url = `${import.meta.env.VITE_API_URL}/comment`;

    try {
        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Calling backend url: [${url}]`);

        const res = await fetchWithAuth(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                articleId,
                userId,
                content: comment.content,
                isReply: comment.isReply,
                parentId: comment.parentId
            })
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `Request failed with ${res.status}`);
        }

        return await res.json();

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

        const res = await fetch(url);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `Request failed with ${res.status}`);
        }

        return await res.json();

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

        await fetchWithAuth(url, {
            method: "DELETE"
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

        const res = await fetch(url);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `Request failed with ${res.status}`);
        }

        return await res.json();

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

        const res = await fetchWithAuth(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content })
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `Request failed with ${res.status}`);
        }

        return await res.json();

    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}

export async function addLikeToComment(id) {
    const LOCAL_LOG_CONTEXT = "Add Like";
    const url = `${import.meta.env.VITE_API_URL}/comment/like/${id}`;

    try {
        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Calling backend url: [${url}]`);

        const res = await fetchWithAuth(url, {
            method: "POST"
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `Request failed with ${res.status}`);
        }

        return await res.json();

    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}

export async function removeCommentLike(id) {
    const LOCAL_LOG_CONTEXT = "Remove Like";
    const url = `${import.meta.env.VITE_API_URL}/comment/like/${id}`;

    try {
        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Calling backend url: [${url}]`);

        const res = await fetchWithAuth(url, {
            method: "DELETE"
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `Request failed with ${res.status}`);
        }

        return await res.json();

    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}
