import { db } from '../config/db.js';
import { DbError, NotFoundError } from '../errors/custom-errors.js';

export async function saveUser(user) {
    const { email, role, name, avatar } = user;
    const query = `
        INSERT INTO users (email, name, avatarUrl, role)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email)
        DO UPDATE SET
            name = EXCLUDED.name,
            avatarUrl = EXCLUDED.avatarUrl,
            role = EXCLUDED.role,
            updated_at = NOW();`;
    try {
        await db.query(query, [email, name, avatar, role]);
    } catch (error) {
        console.error(`DB query failed to save user data: [${error}]`);
        throw new DbError("Failed to save user data to database");
    }
}

export async function getUserDetailsByEmail(email) {
    const query = `
        SELECT email, name, avatarUrl, role, created_at
        FROM users
        WHERE users.email = $1;`;
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