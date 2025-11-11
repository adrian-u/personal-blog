import { db } from "../config/db.js";

const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        email VARCHAR(200) NOT NULL,
        name  VARCHAR(200) NOT NULL,
        avatarUrl TEXT,
        role VARCHAR(20) NOT NULL CHECK (role in ('creator', 'user')),
        provider VARCHAR(20) NOT NULL CHECK (provider in ('google', 'github')),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (email, provider)
    );
`;

const createArticleTable = `
    CREATE TABLE IF NOT EXISTS articles (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        icon VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL CHECK (category IN ('finance', 'projects')),
        description TEXT NOT NULL,
        markdown TEXT NOT NULL,
        published BOOLEAN NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
`;

const createCommentTable = `
    CREATE TABLE IF NOT EXISTS comments (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        article_id BIGINT REFERENCES articles(id) ON DELETE CASCADE,
        user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
        parent_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
`;

const createUserCommentLikesTable = `
    CREATE TABLE IF NOT EXISTS user_comment_likes (
        user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        comment_id BIGINT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, comment_id)
    );
`;

const createUserArticleLikesTable = `
    CREATE TABLE IF NOT EXISTS user_article_likes (
        user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, article_id)
    );
`;

const createIndexes = `
    CREATE UNIQUE INDEX IF NOT EXISTS user_email_provider_idx ON users(email, provider);
    CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);
    CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
    CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
    CREATE INDEX IF NOT EXISTS idx_articles_category_published_created_at ON articles (category, published, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_user_comment_likes_comment_id ON user_comment_likes (comment_id);
`;

async function init() {
    try {
        console.log("Creating tables")
        await db.query(createUserTable);
        await db.query(createArticleTable);
        await db.query(createCommentTable);
        await db.query(createUserArticleLikesTable);
        await db.query(createUserCommentLikesTable);
        await db.query(createIndexes);
        console.log("Tables created successfully");
    } catch (error) {
        console.error("Error initializing database:", error);
    } finally {
        await db.end();
    }
}

init();