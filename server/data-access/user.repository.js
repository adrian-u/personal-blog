import { db } from '../config/db.js';
import { DbError } from '../errors/custom-errors.js';

export async function saveUser(user) {
    const {email, role, name, avatar} = user;
    const query = `INSERT INTO users (email, name, avatarUrl, role) VALUES ($1, $2, $3, $4)`;
    try {
        await db.query(query, [email, name, avatar, role]);
    } catch (error) {
        console.error(`DB query failed to save user data: [${error}]`);
        throw new DbError("Failed to save user data to database");
    }
}