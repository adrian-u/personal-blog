import { save, getArticlesWithoutMarkdown } from "../data-access/article.repository.js";
import logger from "../utils/logger.js";

const LOG_CONTEXT = "Article Service";

export async function saveArticle(article, traceId) {

    const LOCAL_LOG_CONTEXT = "Save";
    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, "Sending request to the repository layer");
    try {
        await save(article, traceId);
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error saving the article: [${error.message}]`);
        throw error;
    }

}

export async function getArticles() {
    const articles = getArticlesWithoutMarkdown();
    return articles;
}