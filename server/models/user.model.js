export class User {
    constructor({ id, email, name, avatarUrl, role, provider,
        createdAt, updatedAt, likedComments = [] }) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.avatarUrl = avatarUrl;
        this.role = role ?? undefined;
        this.provider = provider;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.likedComments = likedComments;
    }

    toWrite() {
        return {
            email: this.email,
            name: this.name,
            avatarUrl: this.avatarUrl,
            role: this.role,
            provider: this.provider,
        };
    }

    toRead() {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
            avatarUrl: this.avatarUrl,
            role: this.role,
            createdAt: this.createdAt,
            likedComments: this.likedComments,
        };
    }

    static fromDBRow(row) {
        return new User({
            id: row.id,
            email: row.email,
            name: row.name,
            avatarUrl: row.avatarUrl,
            role: row.role,
            createdAt: row.created_at,
            likedComments: row.liked_comments,
        });
    }
}