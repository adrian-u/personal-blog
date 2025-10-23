import {
    saveArticle, getArticlesWip, getWipArt, updateWipArticle,
    deleteWipArticle, getArticlesByCategory, getReadArticle
} from "../services/article.service.js";
import logger from "../utils/logger.js";
import { checkIfArticleBodyIsValid } from "../utils/article-utils.js";

const LOG_CONTEXT = "Article Controller";

export async function createArticle(req, res) {
    const LOCAL_LOG_CONTEXT = "Creation";

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start creation of the article`);

    try {
        checkIfArticleBodyIsValid(req.body, req.traceId);
        const article = await saveArticle(req.body, req.traceId);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            id: article.id,
            title: article.title,
            icon: article.icon,
            category: article.category,
            description: article.description,
            markdown: article.markdown,
            published: article.published,
            created_at: article.created_at,
        }));
    } catch (err) {
        logger("error", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `${err.name}: ${err.message}`);
        res.writeHead(err.statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ name: err.name, error: err.message }));
    }

}

export async function getArticlesCreator(res) {

    try {
        const articles = await getArticlesWip();

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(articles));
    } catch (error) {
        console.error(`Error fetching articles without markdown content: [${error}]`);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Error fetching articles without markdown content" }))
    }
}

export async function getWipArticle(res, req, id) {
    const LOCAL_LOG_CONTEXT = "Get WIP Article";

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start fetch article by id: [${id}]`);

    try {
        const article = await getWipArt(id, req.traceId);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(article));
    } catch (err) {
        logger("error", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `${err.name}: ${err.message}`);
        res.writeHead(err.statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ name: err.name, error: err.message }));
    }

}

export async function updateArticle(req, res, id) {
    const LOCAL_LOG_CONTEXT = "Update WIP Article";

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start update article with id: [${id}]`);

    try {
        const article = await updateWipArticle(req.body, id, req.traceId);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(article));
    } catch (error) {
        logger("error", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `${error.name}: ${error.message}`);
        res.writeHead(error.statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ name: error.name, error: error.message }));
    }
}

export async function deleteArticle(req, res, id) {
    const LOCAL_LOG_CONTEXT = "Delete WIP Article";

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start delete article with id: [${id}]`);

    try {
        await deleteWipArticle(id, req.traceId);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Article deleted" }));
    } catch (error) {
        logger("error", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `${error.name}: ${error.message}`);
        res.writeHead(error.statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ name: error.name, error: error.message }));
    }
}

export async function getArticles(req, res, category, limit, offset) {
    const LOCAL_LOG_CONTEXT = "Get Articles by Category";

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start fetching articles for category: [${category}]`);

    try {
        const articles = await getArticlesByCategory(category, req.traceId, limit, offset);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(articles));
    } catch (error) {
        logger("error", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `${error.name}: ${error.message}`);
        res.writeHead(error.statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ name: error.name, error: error.message }));
    }
}

export async function getArticleForReading(req, res, id) {
    const LOCAL_LOG_CONTEXT = "Get Article for Reading";

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start fetching article with id: [${id}]`);

    try {
        const article = await getReadArticle(id, req.traceId);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(article));
    } catch (error) {
        logger("error", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `${error.name}: ${error.message}`);
        res.writeHead(error.statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ name: error.name, error: error.message }))
    }
}