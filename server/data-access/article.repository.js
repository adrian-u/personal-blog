import { db } from "../config/db.js";
import { DbError } from "../errors/custom-errors.js";
import logger from "../utils/logger.js";

const LOG_CONTEXT = "Articple Repository";

export async function save(article, traceId) {

    const LOCAL_LOG_CONTEXT = "Save";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, "Saving the article on the database");

    const query = `INSERT INTO articles (title, icon, category, description, markdown, published)
        VALUES($1, $2, $3, $4, $5, $6);
    `;

    logger("debug", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Insert Query: [${query}]`);

    try {
        await db.query(query, [
            article.title,
            article.icon,
            article.category,
            article.description,
            article.markdown,
            false
        ]);
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