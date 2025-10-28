import { UserRole } from "./enums.js";

export class Comment {
    constructor({ id, userId, articleId, content, parentId,
        createdAt, updatedAt, replies = [], like = 0, author, isReply }) {

        this.id = id;
        this.userId = userId;
        this.articleId = articleId;
        this.content = content;
        this.parentId = parentId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.replies = replies;
        this.like = like;
        this.author = author;
        this.isReply = isReply;
    }

    toWriteParent() {
        return {
            articleId: this.articleId,
            userId: this.userId,
            content: this.content,
        }
    }

    toWriteReply() {
        return {
            articleId: this.articleId,
            userId: this.userId,
            content: this.content,
            parentId: this.parentId,
        }
    }

    toRead() {
        return {
            id: this.id,
            userId: this.userId,
            articleId: this.articleId,
            content: this.content,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            replies: this.replies,
            like: this.like,
            author: new CommentAuthor(this.author).toRead(),
        }
    }

    static fromDBRow(row) {
        return new Comment({
            id: row.id,
            userId: row.user_id,
            articleId: row.article_id,
            content: row.content,
            createdAt: row.created_at,
            replies: row.child_count,
            like: row.total_likes,
            author: CommentAuthor.fromDBRow(row),
        });
    }
}

export class CommentAuthor {
    constructor({ name, avatar, role }) {
        this.name = name;
        this.avatar = avatar;
        this.role = role;
    }

    toRead() {
        return {
            name: this.name,
            avatar: this.avatar,
            role: this.role ? UserRole.fromSymbol(this.role) : undefined
        }
    }

    static fromDBRow(row) {
        return new CommentAuthor({
            name: row.name,
            avatar: row.avatarurl,
            role: row.role ? UserRole.valueOf(row.role) : undefined,
        });
    }
}