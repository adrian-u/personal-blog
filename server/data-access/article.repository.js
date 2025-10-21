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

    const query = `SELECT id, title, icon, category, description, published, created_at FROM articles ORDER BY articles.created_at ASC`;

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

    const query = `SELECT id, title, icon, category, description, markdown FROM articles WHERE articles.id = $1;`;

    try {
        const article = await db.query(query, [id]);
        return article.rows[0];
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `DB query failed to fetch the article with id: [${id}]. Error: [${error}]`);
        throw new DbError(`Failed to fetch the wip article with id: [${id}]`);
    }
}

export async function updateArticle(article, id, traceId) {
    const LOCAL_LOG_CONTEXT = "Update Wip";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start update wip article with id: [${id}]`);

    const keys = Array.from(article.keys());
    const values = Array.from(article.values());

    const setClauses = keys.map((key, index) => `"${key}" = $${index + 1}`);

    const query = `UPDATE articles SET ${setClauses.join(", ")} WHERE id = $${keys.length + 1} RETURNING *;`;

    logger("debug", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Builded query: [${query}] for wip article with id: [${id}]`);

    try {
        const article = await db.query(query, [...values, id]);
        return article.rows[0];
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `DB query failed to update the article with id: [${id}]. Error: [${error}]`);
        throw new DbError(`Failed to update the wip article with id: [${id}]`);
    }
}

export async function deleteWip(id, traceId) {
    const LOCAL_LOG_CONTEXT = "Delete Wip";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Deleting wip article with id: [${id}]`);

    const query = `DELETE from articles WHERE id = $1;`;

    logger("debug", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Builded query: [${query}] for wip article with id: [${id}]`);

    try {
        await db.query(query, [id]);
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `DB query failed to delete the article with id: [${id}]. Error: [${error}]`);
        throw new DbError(`Failed to delete the wip article with id: [${id}]`);
    }
}