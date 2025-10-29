export class Article {
    constructor({ id, title, icon, markdown, category, description, published = false, createdAt, updatedAt }) {

        this.id = id;
        this.title = title;
        this.icon = icon;
        this.markdown = markdown;
        this.category = category;
        this.description = description;
        this.published = published;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    toWrite() {
        return {
            title: this.title,
            icon: this.icon,
            markdown: this.markdown,
            category: this.category,
            description: this.description,
            published: this.published,
        };
    }

    toReadFull() {
        return {
            id: this.id,
            title: this.title,
            icon: this.icon,
            markdown: this.markdown,
            description: this.description,
            published: this.published,
            category: this.category,
            createdAt: this.createdAt,
        };
    }

    toReadWip() {
        return {
            id: this.id,
            title: this.title,
            icon: this.icon,
            description: this.description,
            published: this.published,
            category: this.category,
            createdAt: this.createdAt,
        }
    }

    static fromDBRow(row) {
        return new Article({
            id: row.id,
            title: row.title,
            icon: row.icon,
            category: row.category,
            description: row.description,
            published: row.published,
            markdown: row.markdown,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        });
    }
}