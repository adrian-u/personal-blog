import { getJWT } from "../auth/auth.js";
import logger from "../utils/logger.js";

const LOG_CONTEXT = "Article APIs";

export async function createArticle(article) {

    const LOCAL_LOG_CONTEXT = "Create";

    try {

        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Calling backend url: [${import.meta.env.VITE_API_URL}/article]`);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/article`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getJWT()}`
            },
            body: JSON.stringify(article),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || `Request failed with ${res.status}`);
        }

        const data = await res.json();
        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Response from the call: [${JSON.stringify(data, null, 4)}]`);
        return data;
    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }

}

export async function getArticlesWithoutMarkdown() {

    const LOCAL_LOG_CONTEXT = "Without Markdown";

    try {

        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Calling backend url: [${import.meta.env.VITE_API_URL}/article]`);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/article`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getJWT()}`
            }
        });

        return await res.json();
    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}

export async function getWipArticle(id) {
    const LOCAL_LOG_CONTEXT = "Get Wip";

    try {
        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Calling backend url: [${import.meta.env.VITE_API_URL}/article/wip/${id}]`);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/article/wip/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getJWT()}`
            }
        });

        return await res.json();
    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}

export async function updateArticle(id, article) {
    const LOCAL_LOG_CONTEXT = "Update WIP Article";

    try {
        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Calling backend url: [${import.meta.env.VITE_API_URL}/article/wip/${id}] with the following data: [${JSON.stringify(article, null, 4)}]`);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/article/wip/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getJWT()}`
            },
            body: JSON.stringify(article),
        });

        return await res.json();
    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}

export async function deleteWipArticle(id) {
    const LOCAL_LOG_CONTEXT = "Delete WIP Article";

    try {
        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Calling backend url: [${import.meta.env.VITE_API_URL}/article/wip/${id}]`);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/article/wip/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getJWT()}`
            }
        });

        return await res.json();
    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}