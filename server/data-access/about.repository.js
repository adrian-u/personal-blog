import { db } from "../config/db.js";
import { DbError } from "../errors/custom-errors.js";

export async function getAboutFromDb() {

    try {
        const res = await db.query('SELECT * FROM about');
        return res.rows[0];
    } catch (err) {
        console.error(`DB query failed to fetch about data: [${err}]`);
        throw new DbError("Failed to fetch about data from database");
    }
}