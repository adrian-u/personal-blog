import { fetchWithAuth } from "../apis/fetch-wrapper.js";
import logger from "../utils/logger.js";

const LOG_CONTEXT = "Article APIs";

export async function createArticle(article) {
    const LOCAL_LOG_CONTEXT = "Create";

    try {
        const url = `${import.meta.env.VITE_API_URL}/article`;

        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Calling: [${url}]`);

        const res = await fetchWithAuth(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(article)
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `Request failed with ${res.status}`);
        }

        const data = await res.json();
        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, JSON.stringify(data, null, 4));
        return data;

    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}

export async function getArticlesWithoutMarkdown() {
    const LOCAL_LOG_CONTEXT = "Without Markdown";
    const url = `${import.meta.env.VITE_API_URL}/article/wip`;

    try {
        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Calling: [${url}]`);

        const res = await fetchWithAuth(url);

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `Request failed with ${res.status}`);
        }

        return await res.json();

    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}

export async function getWipArticle(id) {
    const LOCAL_LOG_CONTEXT = "Get Wip";
    const url = `${import.meta.env.VITE_API_URL}/article/wip/${id}`;

    try {
        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Calling: [${url}]`);

        const res = await fetchWithAuth(url);

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `Request failed with ${res.status}`);
        }

        return await res.json();

    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}

export async function updateArticle(id, article) {
    const LOCAL_LOG_CONTEXT = "Update WIP";
    const url = `${import.meta.env.VITE_API_URL}/article/wip/${id}`;

    try {
        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Calling: [${url}]`);

        const res = await fetchWithAuth(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(article)
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `Request failed with ${res.status}`);
        }

        return await res.json();

    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}

export async function deleteWipArticle(id) {
    const LOCAL_LOG_CONTEXT = "Delete WIP";
    const url = `${import.meta.env.VITE_API_URL}/article/wip/${id}`;

    try {
        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Calling: [${url}]`);

        const res = await fetchWithAuth(url, { method: "DELETE" });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `Request failed with ${res.status}`);
        }

        return await res.json();

    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}

export async function getArticlesByCategory(category, limit = 10, offset = 0) {
    const LOCAL_LOG_CONTEXT = "Get Articles by Category";
    const url = `${import.meta.env.VITE_API_URL}/article/category/${category}?limit=${limit}&offset=${offset}`;

    try {
        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Calling: [${url}]`);

        const res = await fetch(url);

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `Request failed with ${res.status}`);
        }

        return await res.json();

    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}

export async function getArticleForReading(id) {
    const LOCAL_LOG_CONTEXT = "Get Article For Reading";
    const url = `${import.meta.env.VITE_API_URL}/article/${id}`;

    try {
        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Calling: [${url}]`);

        const res = await fetch(url);

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `Request failed with ${res.status}`);
        }

        return await res.json();

    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}


export async function addArticleToFavorites(id) {
    const LOCAL_LOG_CONTEXT = "Add Favorite";
    const url = `${import.meta.env.VITE_API_URL}/article/${id}/favorite`;

    try {
        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Calling: [${url}]`);

        const res = await fetchWithAuth(url, { method: "POST" });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `Request failed with ${res.status}`);
        }

    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}


export async function removeArticleFromFavorites(id) {
    const LOCAL_LOG_CONTEXT = "Remove Favorite";
    const url = `${import.meta.env.VITE_API_URL}/article/${id}/favorite`;

    try {
        logger("debug", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Calling: [${url}]`);

        const res = await fetchWithAuth(url, { method: "DELETE" });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `Request failed with ${res.status}`);
        }

    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}

export async function fetchFavoriteArticles(limit = 10, offset = 0) {
    const LOCAL_LOG_CONTEXT = "Fetch Favorites";
    const url = `${import.meta.env.VITE_API_URL}/articles/favorites/?limit=${limit}&offset=${offset}`;

    try {
        const res = await fetchWithAuth(url);

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `Request failed with ${res.status}`);
        }

        return await res.json();

    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}


export async function fetchLatestArticles() {
    const LOCAL_LOG_CONTEXT = "Fetch Latest";
    const url = `${import.meta.env.VITE_API_URL}/articles/latest`;

    try {
        const res = await fetch(url);

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `Request failed with ${res.status}`);
        }

        return await res.json();

    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}

export async function publishArticle(id) {
    const LOCAL_LOG_CONTEXT = "Publish";
    const url = `${import.meta.env.VITE_API_URL}/article/publish/${id}`;

    try {
        const res = await fetchWithAuth(url, { method: "PATCH" });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `Request failed with ${res.status}`);
        }

    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}
