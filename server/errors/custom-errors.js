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

export class BodyRequestValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "Request Validation Error";
        this.statusCode = 400;
    }
}

export class AuthorizationError extends Error {
    constructor(message) {
        super(message);
        this.name = "Authorization Error";
        this.statusCode = 403;
    }
}

export class BadInput extends Error {
    constructor(message) {
        super(message);
        this.name = "Invalid Input";
        this.statusCode = 400;
    }
}

export class InvalidProvider extends Error {
    constructor(message) {
        super(message);
        this.name = "Invalid Provider";
        this.statusCode = 400;
    }
}