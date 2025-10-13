import { getJWT } from "../auth/auth.js";
import logger from "../utils/logger.js";

export async function createArticle(article) {

    try {
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
        return data;
    } catch (error) {
        logger("error", "Create Article", error);
        throw error;
    }

}

export async function getArticlesWithoutMarkdown() {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/article`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getJWT()}`
            }
        });

        return await res.json();
    } catch (error) {
        logger("error", "Fetch Articles Without Markdown", error);
        throw error;
    }
}