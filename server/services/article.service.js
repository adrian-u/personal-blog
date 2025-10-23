import {
    save, getArticlesWithoutMarkdown, getWipArticle,
    updateArticle, deleteWip, fetchArticlesByCategory, getReadArticleById
} from "../data-access/article.repository.js";
import { isEmpty } from "../utils/general.js";
import logger from "../utils/logger.js";
import { ValidationError } from "../errors/custom-errors.js";

const LOG_CONTEXT = "Article Service";

export async function saveArticle(article, traceId) {

    const LOCAL_LOG_CONTEXT = "Save";
    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, "Sending request to the repository layer");
    try {
        const savedArticle = await save(article, traceId);
        return savedArticle;
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error saving the article: [${error.message}]`);
        throw error;
    }

}

export async function getArticlesWip() {
    const articles = getArticlesWithoutMarkdown();
    return articles;
}

export async function getWipArt(id, traceId) {
    const LOCAL_LOG_CONTEXT = "Get Wip";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, "Sending request to the repository layer");
    try {
        const article = await getWipArticle(id, traceId);
        return article;
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error fetching the wip article with id: [${id}]. Error: [${error.message}]`);
        throw error;
    }
}

export async function updateWipArticle(article, id, traceId) {
    const LOCAL_LOG_CONTEXT = "Update WIP Article";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Handling request with id: [${id}] and body: ${JSON.stringify(article, null, 4)}`);

    if (isEmpty(article)) return;

    const articleUpdatesMap = new Map();
    article.forEach(item => {
        if (item.op === "update") {
            articleUpdatesMap.set(item.field, item.value);
        }
    });
    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Sending request to the repository layer for article id: [${id}]`);

    try {
        const updatedArticle = await updateArticle(articleUpdatesMap, id, traceId);
        return updatedArticle;
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error updating the wip article with id: [${id}]. Error: [${error.message}]`);
        throw error;
    }
}

export async function deleteWipArticle(id, traceId) {
    const LOCAL_LOG_CONTEXT = "Delete WIP Article";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Deleting article with id: ${id}`);

    try {
        await deleteWip(id, traceId);
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error deleting wip article with id: [${id}]. Error: [${error.message}]`);
        throw error;
    }
}

export async function getArticlesByCategory(category, traceId, limit, offset) {
    const LOCAL_LOG_CONTEXT = "Get Articles by Category";
    const VALID_CATEGORIES = ["Projects", "Finance"];

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Getting articles for category: ${category}`);

    if (isEmpty(category) || !VALID_CATEGORIES.includes(category)) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `This is not a valid category: [${category}]`);
        throw new ValidationError(`The category: [${category}] is not a valid category`);
    }

    try {
        return await fetchArticlesByCategory(category, traceId, limit, offset);
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error fetching articles for category: [${category}]. Error: [${error.message}]`);
        throw error;
    }
}

export async function getReadArticle(id, traceId) {
    const LOCAL_LOG_CONTEXT = "Get Read Article";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Getting article with id: ${id}`);

    try {
        return await getReadArticleById(id, traceId);
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error fetching article with id: [${id}]. Error: [${error.message}]`);
        throw error;
    }
}