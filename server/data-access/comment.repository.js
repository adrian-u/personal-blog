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

            const fetchQuery = `SELECT c.id, c.user_id, c.article_id, c.content, c.created_at, u.name, u.avatarurl, u.role, COUNT(child.id) AS child_count
                        FROM comments AS c JOIN users AS u ON c.user_id = u.id LEFT JOIN comments as child ON child.parent_id = c.id WHERE c.id = $1
                        GROUP BY c.id, c.article_id, c.user_id, c.content, c.created_at, u.name, u.role, u.avatarurl;`;
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

            const fetchQuery = `SELECT c.id, c.user_id, c.article_id, c.content, c.created_at, u.name, u.avatarurl, u.role, COUNT(child.id) AS child_count
                        FROM comments AS c JOIN users AS u ON c.user_id = u.id LEFT JOIN comments as child ON child.parent_id = c.id WHERE c.id = $1
                        GROUP BY c.id, c.article_id, c.user_id, c.content, c.created_at, u.name, u.role, u.avatarurl;`;
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

    const query = `SELECT c.id, c.article_id, c.user_id, c.content, c.created_at, u.name, u.avatarurl, u.role,
                COUNT(*) OVER() AS total_count, COUNT(child.id) AS child_count, COUNT(likes.comment_id) AS total_likes
                FROM comments as c JOIN users as u ON c.user_id = u.id LEFT JOIN comments as child ON child.parent_id = c.id
                LEFT JOIN user_comment_likes as likes ON likes.comment_id = c.id
                WHERE c.article_id = $1 AND c.parent_id IS NULL
                GROUP BY c.id, c.article_id, c.user_id, c.content, c.created_at, u.name, u.role, u.avatarurl
                ORDER BY c.created_at DESC LIMIT $2 OFFSET $3`;

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

    const query = `SELECT c.id, c.article_id, c.user_id, c.parent_id, c.content, c.created_at, u.name, u.avatarurl, u.role,
                COUNT(*) OVER() AS total_count, COUNT(child.id) AS child_count, COUNT(likes.comment_id) AS total_likes
                FROM comments as c JOIN users as u ON c.user_id = u.id LEFT JOIN comments as child ON child.parent_id = c.id
                LEFT JOIN user_comment_likes as likes ON likes.comment_id = c.id
                WHERE c.parent_id = $1
                GROUP BY c.id, c.article_id, c.user_id, c.content, c.created_at, u.name, u.role, u.avatarurl
                ORDER BY c.created_at DESC LIMIT $2 OFFSET $3`;

    try {
        const result = await db.query(query, [parentId, limit, offset]);
        if (result.rowCount === 0) {
            return { totalCount: 0, comments: [] };
        }

        return { totalCount: result.rows[0].total_count, comments: result.rows };
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `DB query failed to get parent replies for parent: [${parentId}]. Error: [${error}]`);
        throw new DbError(`Failed to fetch replies for parent comment with id: [${parentId}]`);
    }
}

export async function edit(id, content, traceId) {
    const LOCAL_LOG_CONTEXT = "Edit Comment";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Editing comment with: [${id}]`);

    const query = `UPDATE comments SET content = $1 WHERE id = $2 RETURNING content`;

    try {
        const res = await db.query(query, [content, id]);
        return res.rows[0];
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `DB query failed to edit comment with id: [${id}]. Error: [${error}]`);
        throw new DbError(`Failed to edit comment with id: [${id}]`);
    }
}

export async function commentAddLike(commentId, user, traceId) {
    const LOCAL_LOG_CONTEXT = "Add Like";

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Adding like to the comment with id: [${commentId}]`);

    const deleteQuery = `INSERT INTO user_comment_likes (comment_id, user_id) VALUES ($1, $2) ON CONFLICT (user_id, comment_id) DO NOTHING RETURNING *;`;

    const likesQuery = `SELECT COUNT(*) as likes FROM user_comment_likes WHERE comment_id = $1`;

    try {
        await db.query(deleteQuery, [commentId, user.id]);
        const res = await db.query(likesQuery, [commentId]);
        return res.rows[0];
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `DB query failed to add like to the comment with id: [${commentId}]. Error: [${error}]`);
        throw new DbError(`Failed to add like to the comment with id: [${commentId}]`);
    }
}

export async function deleteLike(commentId, user, traceId) {
    const LOCAL_LOG_CONTEXT = "Delete Like"

    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Deleting like to the comment with id: [${commentId}]`);

    const deleteQuery = `DELETE FROM user_comment_likes WHERE user_id = $1 AND comment_id = $2;`;
    const likesQuery = `SELECT COUNT(*) as likes FROM user_comment_likes WHERE comment_id = $1`;

    try {
        await db.query(deleteQuery, [user.id, commentId]);
        const res = await db.query(likesQuery, [commentId]);
        return res.rows[0];
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `DB query failed to remove like to the comment with id: [${commentId}]. Error: [${error}]`);
        throw new DbError(`Failed to remove like to the comment with id: [${commentId}]`);
    }
}