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
        provider TEXT NOT NULL CHECK (provider in ('google', 'github')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createArticleTable = `
    CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        icon TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        markdown TEXT NOT NULL,
        published BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createCommentTable = `
    CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
    );
`;

const createUserCommentLikesTable = `
    CREATE TABLE IF NOT EXISTS user_comment_likes (
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        comment_id INTEGER NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, comment_id)
    );
`;

const createUserArticleLikesTable = `
    CREATE TABLE IF NOT EXISTS user_article_likes (
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, article_id)
    );
`;

const createIndexes = `
    CREATE UNIQUE INDEX IF NOT EXISTS user_email_provider_idx
    ON users(email, provider);
    CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);
    CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
    CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
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
        await db.query(createIndexes);
        await db.query(createArticleTable);
        await db.query(createCommentTable);
        await db.query(createUserCommentLikesTable);
        await db.query(createUserArticleLikesTable);
        console.log("Tables created successfully");

        console.log("Checking if about data already exists...");
        const result = await db.query(`SELECT COUNT(*) FROM about`);
        const count = parseInt(result.rows[0].count);

        if (count === 0) {
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
        } else {
            console.log("Default about data already present, skipping insert.");
        }
    } catch (error) {
        console.error("Error initializing database:", error);
    } finally {
        await db.end();
    }
}

init();