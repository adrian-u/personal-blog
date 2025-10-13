export class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "Not found error";
        this.statusCode = 404;
    }
}

export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "Validation error";
        this.statusCode = 400;
    }
}

export class DbError extends Error {
    constructor(message) {
        super(message);
        this.name = "Database error";
        this.statusCode = 500;
    }
}

export class SavingError extends Error {
    constructor(message) {
        super(message);
        this.name = "Saving error";
        this.statusCode = 500;
    }
}

export class ArticleValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "Article Validation Error";
        this.statusCode = 400;
    }
}