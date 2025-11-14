import {
    save, getArticlesWithoutMarkdown, getWipArticle,
    updateArticle, deleteWip, fetchArticlesByCategory, getReadArticleById,
    createFavoriteArticle, checkIfArticleExists, deleteFavoriteArticle,
    fetchFavoriteArticles, fetchLatestArticles, updatePublishStatus
} from "../data-access/article.repository.js";
import { isEmpty } from "../utils/general.js";
import logger from "../utils/logger.js";
import { ValidationError } from "../errors/custom-errors.js";
import { Article } from "../models/article.model.js";
import deleteUnusedImages from "./clean-minio.service.js";

const LOG_CONTEXT = "Article Service";

export async function saveArticle(article, traceId) {

    const LOCAL_LOG_CONTEXT = "Save";
    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, "Sending request to the repository layer");
    try {
        return await save(article, traceId);
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error saving the article: [${error}]`);
        throw error;
    }
}

export async function getArticlesWip(traceId) {

    const LOCAL_LOG_CONTEXT = "Get Wip Articles";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, "Sending request to the repository layer");

    try {
        return await getArticlesWithoutMarkdown(traceId);
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error saving the article: [${error}]`);
        throw error;
    }
}

export async function getWipArt(id, traceId) {
    const LOCAL_LOG_CONTEXT = "Get Wip";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, "Sending request to the repository layer");
    try {
        return await getWipArticle(id, traceId);
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error fetching the wip article with id: [${id}]. Error: [${error}]`);
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
            if (item.field === "category") {
                item.value = item.value.toLowerCase();
            }
            articleUpdatesMap.set(item.field, item.value);
        }
    });

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Sending request to the repository layer for article id: [${id}]`);

    try {
        return await updateArticle(articleUpdatesMap, id, traceId);
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error updating the wip article with id: [${id}]. Error: [${error}]`);
        throw error;
    }
}

export async function deleteWipArticle(id, traceId) {
    const LOCAL_LOG_CONTEXT = "Delete WIP Article";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Deleting article with id: ${id}`);

    try {
        await deleteWip(id, traceId);
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error deleting wip article with id: [${id}]. Error: [${error}]`);
        throw error;
    }
}

export async function getArticlesByCategory(category, traceId, limit, offset) {
    const LOCAL_LOG_CONTEXT = "Get Articles by Category";
    const VALID_CATEGORIES = ["projects", "finance"];

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Getting articles for category: ${category}`);

    if (isEmpty(category) || !VALID_CATEGORIES.includes(category.toLowerCase())) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `This is not a valid category: [${category}]`);
        throw new ValidationError(`The category: [${category}] is not a valid category`);
    }

    try {
        return await fetchArticlesByCategory(category.toLowerCase(), traceId, limit, offset);
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error fetching articles for category: [${category}]. Error: [${error}]`);
        throw error;
    }
}

export async function getReadArticle(id, traceId) {
    const LOCAL_LOG_CONTEXT = "Get Read Article";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Getting article with id: ${id}`);

    try {
        return await getReadArticleById(id, traceId);
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error fetching article with id: [${id}]. Error: [${error}]`);
        throw error;
    }
}

export async function addFavoriteArticle(id, user, traceId) {
    const LOCAL_LOG_CONTEXT = "Add Article to Favorites";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Sending request to the repository layer for article id: [${id}]`);

    try {
        const article = await checkIfArticleExists(id, traceId);
        if (!article) throw new NotFoundError("Article not found");

        await createFavoriteArticle(id, user, traceId);
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error adding article with id: [${id}] to favorites. Error: [${error}]`);
        throw error;
    }
}

export async function removeFavoriteArticle(id, user, traceId) {
    const LOCAL_LOG_CONTEXT = "Remove Article from Favorites";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Sending request to the repository layer for article id: [${id}]`);

    try {
        const article = await checkIfArticleExists(id, traceId);
        if (!article) throw new NotFoundError("Article not found");

        await deleteFavoriteArticle(id, user, traceId);
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error removing article with id: [${id}] from favorites. Error: [${error}]`);
        throw error;
    }
}

export async function retrieveFavoriteArticles(user, traceId, limit, offset) {
    const LOCAL_LOG_CONTEXT = "Retrieve Favorite Articles";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, "Sending request to the repository layer");

    try {
        const { totalCount, articles } = await fetchFavoriteArticles(user, traceId, limit, offset);
        return { totalCount, articles: articles.map(article => Article.fromDBRow(article)) }
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error retrieve favorites. Error: [${error}]`);
        throw error;
    }
}

export async function retrieveLatestArticles(traceId) {
    const LOCAL_LOG_CONTEXT = "Retrieve Latest Articles";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, "Sending request to the repository layer");

    try {
        const { articles } = await fetchLatestArticles(traceId);
        return articles.map(article => Article.fromDBRow(article))
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error retrieve latest articles. Error: [${error}]`);
        throw error;
    }
}

export async function publish(id, traceId) {
    const LOCAL_LOG_CONTEXT = "Publish article";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Sending request to the repository layer to publish article with id: [${id}]`);

    try {
        await updatePublishStatus(id, traceId);
        await deleteUnusedImages(traceId);
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error publishing article with id: [${id}]. Error: [${error}]`);
        throw error;
    }

}