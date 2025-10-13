import { saveArticle, getArticles } from "../services/article.service.js";
import logger from "../utils/logger.js";
import { checkIfArticleBodyIsValid } from "../utils/article-utils.js";

const LOG_CONTEXT = "Article Controller";

export async function createArticle(req, res) {
    const LOCAL_LOG_CONTEXT = "Creation";

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start creation of the article`);

    try {
        checkIfArticleBodyIsValid(req.body, req.traceId);
        await saveArticle(req.body, req.traceId);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Article created" }));
    } catch (err) {
        logger("error", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `${err.name}: ${err.message}`);
        res.writeHead(err.statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ name: err.name, error: err.message }));
    }

}

export async function getArticlesCreator(res) {

    try {
        const articles = await getArticles();

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(articles));
    } catch (error) {
        console.error(`Error fetching articles without markdown content: [${error}]`);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Error fetching articles without markdown content" }))
    }
}