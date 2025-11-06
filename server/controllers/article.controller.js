import {
    saveArticle, getArticlesWip, getWipArt, updateWipArticle,
    deleteWipArticle, getArticlesByCategory, getReadArticle,
    addFavoriteArticle, removeFavoriteArticle, retrieveFavoriteArticles,
    retrieveLatestArticles
} from "../services/article.service.js";
import logger from "../utils/logger.js";
import { checkIfArticleBodyIsValid } from "../utils/article-utils.js";
import { Article } from "../models/article.model.js";

const LOG_CONTEXT = "Article Controller";

export async function createArticle(req, res) {
    const LOCAL_LOG_CONTEXT = "Creation";

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, "Start creation of the article");

    checkIfArticleBodyIsValid(req.body, req.traceId);

    const saved = await saveArticle(new Article(req.body).toWrite(), req.traceId);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(saved.toReadFull()));
}

export async function getArticlesCreator(req, res) {

    const LOCAL_LOG_CONTEXT = "Get Articles Creator";

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, "Start fetching articles creator");

    const articles = await getArticlesWip(req.traceId);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(articles.map(article => article.toReadWip())));
}

export async function getWipArticle(req, res, params) {
    const LOCAL_LOG_CONTEXT = "Get WIP Article";

    const { id } = params;

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start fetch article by id: [${id}]`);

    const article = await getWipArt(id, req.traceId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(article.toReadFull()));

}

export async function updateArticle(req, res, params) {
    const LOCAL_LOG_CONTEXT = "Update WIP Article";

    const { id } = params;

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start update article with id: [${id}]`);

    const article = await updateWipArticle(req.body, id, req.traceId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(article.toReadFull()));

}

export async function deleteArticle(req, res, params) {
    const LOCAL_LOG_CONTEXT = "Delete WIP Article";

    const { id } = params;

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start delete article with id: [${id}]`);

    await deleteWipArticle(id, req.traceId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Article deleted" }));

}

export async function getArticles(req, res, params) {
    const LOCAL_LOG_CONTEXT = "Get Articles by Category";

    const { category } = params;

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const url = new URL(req.url, `${protocol}://${req.headers.host}`);
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const offset = parseInt(url.searchParams.get("offset")) || 0;

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start fetching articles for category: [${category}]`);

    const articles = await getArticlesByCategory(category, req.traceId, limit, offset);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(articles));

}

export async function getArticleForReading(req, res, params) {
    const LOCAL_LOG_CONTEXT = "Get Article for Reading";
    const { id } = params;

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start fetching article with id: [${id}]`);

    const article = await getReadArticle(id, req.traceId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(article.toReadFull()));

}

export async function addArticleToFavorites(req, res, params) {
    const LOCAL_LOG_CONTEXT = "Add Article to Favorites";
    const { id } = params;

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start adding article with id: [${id}] to favorites`);

    await addFavoriteArticle(id, req.user, req.traceId);
    res.writeHead(201);
    res.end();
}

export async function removeArticleFromFavorites(req, res, params) {
    const LOCAL_LOG_CONTEXT = "Remove Article from Favorites";
    const { id } = params;

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start removing article with id: [${id}] from favorites`);

    await removeFavoriteArticle(id, req.user, req.traceId);
    res.writeHead(204);
    res.end();
}

export async function getFavoriteArticles(req, res) {
    const LOCAL_LOG_CONTEXT = "Get Favorite Articles";

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const url = new URL(req.url, `${protocol}://${req.headers.host}`);
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const offset = parseInt(url.searchParams.get("offset")) || 0;

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, "Start get favorite articles");

    const articles = await retrieveFavoriteArticles(req.user, req.traceId, limit, offset);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(articles));
}

export async function getLatestArticles(req, res) {
    const LOCAL_LOG_CONTEXT = "Get Latest Articles";

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, "Start get latest articles");
    const articles = await retrieveLatestArticles(req.traceId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(articles));
}