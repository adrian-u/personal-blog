import { DbError } from "../errors/custom-errors.js";
import { db } from "../config/db.js";
import logger from "../utils/logger.js";

const LOG_CONTEXT = "Comment Repository";

export async function save(comment, traceId) {
    const LOCAL_LOG_CONTEXT = "Save";
    const client = await db.connect();

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, "Saving the comment on the database (transactional)");

    if (comment.isReply) {
        try {
            logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Saving the reply comment to parentId: [${comment.parentId}]
                 and articleId: [${comment.articleId}] on the database `);
            const insertQuery = `INSERT INTO comments (article_id, user_id, content, parent_id) VALUES ($1, $2, $3, $4) RETURNING id;`

            const fetchQuery = `SELECT c.id, c.user_id, c.article_id, c.content, c.created_at, u.name, u.avatarurl, u.role,
                        FROM comments AS c JOIN users AS u ON c.user_id = u.id WHERE c.id = $1;`;
            await client.query("BEGIN");

            const inserted = await client.query(insertQuery, [
                comment.articleId,
                comment.userId,
                comment.content,
                comment.parentId,
            ]);

            const commentId = inserted.rows[0]?.id;

            if (!commentId) {
                throw new DbError("Insert did not return a valid comment ID");
            }

            const fullComment = await client.query(fetchQuery, [commentId]);

            await client.query("COMMIT");

            return fullComment.rows[0];
        } catch (error) {
            await client.query("ROLLBACK");
            logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Transaction failed: [${error.message}]`);
            throw new DbError("Failed to save the comment");
        } finally {
            client.release();
        }

    } else {
        try {
            logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Saving the comment to articleId: [${comment.articleId}]`);
            const insertQuery = `INSERT INTO comments (article_id, user_id, content) VALUES ($1, $2, $3) RETURNING id;`;

            const fetchQuery = `SELECT c.id, c.user_id, c.article_id, c.content, c.created_at, u.name, u.avatarurl, u.role,
                        FROM comments AS c JOIN users AS u ON c.user_id = u.id WHERE c.id = $1;`;
            await client.query("BEGIN");

            const inserted = await client.query(insertQuery, [
                comment.articleId,
                comment.userId,
                comment.content,
            ]);

            const commentId = inserted.rows[0]?.id;

            if (!commentId) {
                throw new DbError("Insert did not return a valid comment ID");
            }

            const fullComment = await client.query(fetchQuery, [commentId]);

            await client.query("COMMIT");

            return fullComment.rows[0];
        } catch (error) {
            await client.query("ROLLBACK");
            logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Transaction failed: [${error.message}]`);
            throw new DbError("Failed to save the comment");
        } finally {
            client.release();
        }
    }
}

export async function fetchParentComments(articleId, traceId, limit, offset) {
    const LOCAL_LOG_CONTEXT = "Fetch Parent Comments";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Fetching the parent comments for articleId: [${articleId}]`);

    const query = `SELECT c.id, c.article_id, c.user_id, c.content, c.created_at, u.name, u.avatarurl, u.role, COUNT(*) OVER() AS total_count
                FROM comments as c JOIN users as u ON c.user_id = u.id 
                WHERE c.article_id = $1 AND c.parent_id IS NULL ORDER BY c.created_at DESC LIMIT $2 OFFSET $3`;

    try {
        const parentComments = await db.query(query, [articleId, limit, offset]);
        if (parentComments.rowCount === 0) {
            return { totalCount: 0, comments: [] };
        }
        return { totalCount: parentComments.rows[0].total_count, comments: parentComments.rows };
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `DB query failed to get parent comments for articleId: [${id}]. Error: [${error}]`);
        throw new DbError(`Failed to fetch parent comments for articleId: [${articleId}]`);
    }
}

export async function fetchCommentById(commentId, traceId) {

    const LOCAL_LOG_CONTEXT = "Fetch Comment by Id";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Fetching the comment with id: [${commentId}]`);

    const query = `SELECT id, user_id FROM comments WHERE id = $1;`;
    try {
        const result = await db.query(query, [commentId]);
        return result.rows[0];
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error.message);
        throw new DbError(`Failed to fetch comment by id: [${commentId}]`);
    }
}

export async function cancel(commentId, traceId) {

    const LOCAL_LOG_CONTEXT = "Delete Comment by Id";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Deleting the comment with id: [${commentId}]`);

    const query = `DELETE FROM comments WHERE id = $1;`;
    try {
        const result = await db.query(query, [commentId]);
        if (result.rowCount === 0) {
            throw new NotFoundError("Comment not found");
        }
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error.message);
        throw new DbError("Failed to delete comment");
    }
}

export async function fetchReplies(parentId, limit, offset, traceId) {
    const LOCAL_LOG_CONTEXT = "Fetch Replies";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Fetching replies for parentId: [${parentId}]`);

    const query = `SELECT c.id, c.article_id, c.user_id, c.parent_id, c.content, c.created_at, u.name, u.avatarurl, u.role, COUNT(*) OVER() AS total_count
                FROM comments as c JOIN users as u ON c.user_id = u.id 
                WHERE c.parent_id = $1 ORDER BY c.created_at DESC LIMIT $2 OFFSET $3`;

    try {
        const result = await db.query(query, [parentId, limit, offset]);
        if (result.rowCount === 0) {
            return { totalCount: 0, comments: [] };
        }

        return { totalCount: result.rows[0].total_count, comments: result.rows };
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `DB query failed to get parent replies for parent: [${parentId}]. Error: [${error}]`);
        throw new DbError(`Failed to fetch replies for parent commetn with id: [${parentId}]`);
    }
}