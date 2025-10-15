import { db } from "../config/db.js";
import { DbError } from "../errors/custom-errors.js";
import logger from "../utils/logger.js";

const LOG_CONTEXT = "Article Repository";

export async function save(article, traceId) {

    const LOCAL_LOG_CONTEXT = "Save";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, "Saving the article on the database");

    const query = `
      INSERT INTO articles (title, icon, category, description, markdown, published)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    logger("debug", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Insert Query: [${query}]`);

    try {
        const createdArticle = await db.query(query, [
            article.title,
            article.icon,
            article.category,
            article.description,
            article.markdown,
            false
        ]);
        return createdArticle.rows[0];
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `DB query failed to save the article: [${error}]`);
        throw new DbError("Failed to save the article");
    }
}

export async function getArticlesWithoutMarkdown() {

    const query = `SELECT id, title, icon, category, description, published, created_at FROM articles`;

    try {
        const articles = await db.query(query);
        return articles.rows;
    } catch (error) {
        console.error(`DB query failed to fetch articles without markdown: [${error}]`);
        throw new DbError("Failed to fetch article without markdown content");
    }
}

export async function getWipArticle(id, traceId) {
    const LOCAL_LOG_CONTEXT = "Get Wip";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Fetching wip article with id: [${id}] from the database`);

    const query = `SELECT id, title, icon, category, description, markdown FROM articles WHERE articles.id = $1`;

    try {
        const article = await db.query(query, [id]);
        return article.rows[0];
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `DB query failed to fetch the article with id: [${id}]. Error: [${error}]`);
        throw new DbError(`Failed to fetch the wip article with id: [${id}]`);
    }
}