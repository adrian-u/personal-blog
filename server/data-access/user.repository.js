import { db } from '../config/db.js';
import { DbError, NotFoundError } from '../errors/custom-errors.js';

export async function saveUser(user) {
    const { email, role, name, avatar, provider } = user;
    const query = `
        INSERT INTO users (email, name, avatarUrl, role, provider)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email)
        DO UPDATE SET
            name = EXCLUDED.name,
            avatarUrl = EXCLUDED.avatarUrl,
            role = EXCLUDED.role,
            updated_at = NOW() RETURNING *;`;
    try {
        const res = await db.query(query, [email, name, avatar, role, provider]);
        return res.rows[0];
    } catch (error) {
        console.error(`DB query failed to save user data: [${error}]`);
        throw new DbError("Failed to save user data to database");
    }
}

export async function getUserDetailsByEmail(email) {
    const query = ` SELECT u.id, u.email, u.name, u.avatarUrl, u.role, u.created_at,
                    COALESCE(json_agg(l.comment_id) FILTER (WHERE l.comment_id IS NOT NULL), '[]') AS liked_comments FROM users AS u
                    LEFT JOIN user_comment_likes AS l ON l.user_id = u.id
                    WHERE u.email = $1
                    GROUP BY u.id, u.email, u.name, u.avatarUrl, u.role, u.created_at;`

    try {
        const result = await db.query(query, [email]);
        const user = result.rows[0];

        if (!user) {
            throw new NotFoundError(`User not found with email: ${email}`);
        }

        return user;

    } catch (error) {
        if (!(error instanceof NotFoundError)) {
            console.error(`DB query failed to get user details for email: [${email}]. Error: [${error}]`);
            throw new DbError("Failed to get user details");
        }
        throw error;
    }
}