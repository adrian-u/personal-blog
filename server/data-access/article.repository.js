import { db } from "../config/db.js";
import { DbError } from "../errors/custom-errors.js";
import { Article } from "../models/article.model.js";
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

    const values = [
        article.title,
        article.icon,
        article.category.toLowerCase(),
        article.description,
        article.markdown,
        article.published,
    ]

    logger("debug", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Insert Query: [${query}] with values: ${JSON.stringify(values)}`);

    try {
        const { rows: [row] } = await db.query(query, values);
        return Article.fromDBRow(row);
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `DB query failed to save the article: [${error}]`);
        throw new DbError("Failed to save the article");
    }
}

export async function getArticlesWithoutMarkdown(traceId) {

    const LOCAL_LOG_CONTEXT = "Fetch Articles Wip";

    const query = `SELECT id, title, icon, category, description, published, created_at FROM articles WHERE published = $1 ORDER BY created_at ASC`;

    try {
        const { rows } = await db.query(query, [false]);
        return rows.map(article => Article.fromDBRow(article));
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `DB query failed to fetch articles without markdown: [${error}]`);
        throw new DbError("Failed to fetch article without markdown content");
    }
}

export async function getWipArticle(id, traceId) {
    const LOCAL_LOG_CONTEXT = "Get Wip Article";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Fetching wip article with id: [${id}] from the database`);

    const query = `SELECT id, title, icon, category, description, markdown FROM articles WHERE articles.id = $1;`;

    try {
        const { rows: [row] } = await db.query(query, [id]);
        return Article.fromDBRow(row);
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

    logger("debug", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Builded query: [${query}] for wip article with id: [${id}] with values: ${JSON.stringify(values)}`);

    try {
        const { rows: [row] } = await db.query(query, [...values, id]);
        return Article.fromDBRow(row);
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

export async function fetchArticlesByCategory(category, traceId, limit = 10, offset = 0) {
    const LOCAL_LOG_CONTEXT = "Fetch Articles by Category";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`,
        `Fetching articles for category [${category}] with limit=${limit}, offset=${offset}`);

    const query = ` SELECT id, title, icon, description, created_at, category, COUNT(*) OVER() AS total_count FROM articles WHERE category = $1 AND published = $2
                    ORDER BY created_at DESC
                    LIMIT $3 OFFSET $4;`;

    try {
        const { rows } = await db.query(query, [category, true, limit, offset]);
        const totalCount = rows.length > 0 ? parseInt(rows[0].total_count, 10) : 0;
        return { totalCount, articles: rows.map(row => Article.fromDBRow(row)) };
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `DB query failed to fetch articles for category: [${category}]. Error: [${error}]`);
        throw new DbError(`Failed to fetch articles with category: [${category}]`);
    }
}

export async function getReadArticleById(id, traceId) {
    const LOCAL_LOG_CONTEXT = "Fetch Read Article";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Fetching article with id: [${id}]`);

    const query = `SELECT id, title, created_at, category, markdown FROM articles WHERE id = $1;`;

    try {
        const { rows: [row] } = await db.query(query, [id]);
        return Article.fromDBRow(row);
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `DB query failed to fetch the article with id: [${id}]. Error: [${error}]`);
        throw new DbError(`Failed to fetch the article with id: [${id}]`);
    }
}

export async function checkIfArticleExists(id, traceId) {
    const LOCAL_LOG_CONTEXT = "Check article exists";
    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Fetching the article with id: [${id}]`);

    const query = `SELECT id FROM articles WHERE id = $1;`;

    try {
        const { rows: [row] } = await db.query(query, [id]);
        return row;
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error.message);
        throw new DbError(`Failed to fetch article by id: [${id}]`);
    }
}

export async function createFavoriteArticle(id, user, traceId) {
    const LOCAL_LOG_CONTEXT = "Add Article to Favorites";
    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Adding article with id: [${id}] to favorites`);

    const query = `INSERT INTO user_article_likes (user_id, article_id) VALUES ($1, $2)`;

    try {
        await db.query(query, [user.id, id]);
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error.message);
        throw new DbError(`Failed to add the article with id: [${id}] to favorites`);
    }
}

export async function deleteFavoriteArticle(id, user, traceId) {
    const LOCAL_LOG_CONTEXT = "Remove Article from Favorites";
    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Removing article with id: [${id}] from favorites`);

    const query = `DELETE FROM user_article_likes WHERE user_id = $1 AND article_id = $2`;

    try {
        await db.query(query, [user.id, id]);
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error.message);
        throw new DbError(`Failed to remove the article with id: [${id}] from favorites`);
    }
}

export async function fetchFavoriteArticles(user, traceId, limit, offset) {
    const LOCAL_LOG_CONTEXT = "Fetch Favorite Articles";
    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start fetching favorite articles for user: [${user.id}]`);

    const query = `SELECT a.id, a.title, a.icon, a.description, a.created_at, COUNT(*) OVER() AS total_count
    FROM articles AS a JOIN user_article_likes AS al ON a.id = al.article_id
    WHERE al.user_id = $1 AND a.published = $2
    ORDER BY a.created_at DESC LIMIT $3 OFFSET $4`;

    try {
        const { rowCount, rows } = await db.query(query, [user.id, true, limit, offset]);
        if (rowCount === 0) {
            return { totalCount: 0, articles: [] }
        }
        return { totalCount: rows[0].total_count, articles: rows };
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error.message);
        throw new DbError(`Failed to fetch favorites articles for user: [${user.id}]`);

    }

}

export async function fetchLatestArticles(traceId) {
    const LOCAL_LOG_CONTEXT = "Fetch Latest Articles";
    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, "Start fetching latest articles");

    const query = `SELECT id, title, icon, description, created_at, category FROM articles WHERE published = $1
                ORDER BY created_at DESC
                LIMIT 3;`;

    try {
        const { rows } = await db.query(query, [true]);
        return { articles: rows };
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error.message);
        throw new DbError("Failed to fetch latest articles");
    }

}

export async function updatePublishStatus(id, traceId) {
    const LOCAL_LOG_CONTEXT = "Publish Article";
    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Update status to published fro article with id: [${id}]`);

    const readQuery = `SELECT id, published FROM articles WHERE id = $1`;
    const query = `UPDATE articles SET published = $1 WHERE id = $2`;

    try {

        const { rows: [row] } = await db.query(readQuery, [id]);

        if (row.published) {
            logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Article with id: [${id}] is public. Start making it private.`);
            await db.query(query, [false, id]);
        } else {
            logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Article with id: [${id}] is private. Start making it public.`);
            await db.query(query, [true, id]);
        }
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error.message);
        throw new DbError(`Failed to publish article with id: [${id}]`);
    }
}