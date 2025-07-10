import { db } from "../config/db.js";
import { aboutData } from './about.mockup.js';

const createAboutTable = `
    CREATE TABLE IF NOT EXISTS about (
        id SERIAL PRIMARY KEY,
        title TEXT,
        location TEXT,
        developer JSONB,
        investor JSONB,
        timeline JSONB,
        skills JSONB,
        investments TEXT[],
        interests TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name  TEXT NOT NULL,
        avatarUrl TEXT,
        role TEXT NOT NULL CHECK (role in ('creator', 'user')),
        provider TEXT NOT NULL CHECK (provider in ('google', 'github', 'apple')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createUserIndex = `
    CREATE UNIQUE INDEX IF NOT EXISTS user_email_provider_idx
    ON users(email, provider);
`;

const insertDefaultAbout = `
    INSERT INTO about (title, location, developer, investor, timeline, skills, investments, interests)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id;
`;

async function init() {
    try {
        console.log("Creating tables")
        await db.query(createAboutTable);
        await db.query(createUserTable);
        await db.query(createUserIndex);
        console.log("Tables created successfully");

        console.log("Inserting default about data");
        await db.query(insertDefaultAbout, [
            aboutData.title,
            aboutData.location,
            aboutData.developer,
            aboutData.investor,
            JSON.stringify(aboutData.timeline),
            JSON.stringify(aboutData.skills),
            aboutData.investments,
            aboutData.interests
        ]);
        console.log("Default about data inserted successfully");
    } catch (error) {
        console.error("Error initializing database:", error);
    } finally {
        await db.end();
    }
}

init();