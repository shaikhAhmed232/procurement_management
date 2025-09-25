const {statusCode} = require("./constants");

class BaseError extends Error {
    constructor (message, status = statusCode.INTERNAL_SERVER_ERROR) {
        super(message);
        this.status = status
        Error.captureStackTrace(this);
    }
}

class NotFoundError extends BaseError {
    constructor(message) {
        super(message, statusCode.NOT_FOUND);
    }
}

class BadRequestError extends BaseError {
    constructor(message, data = null) {
        super(message, statusCode.BAD_REQUEST);
        this.data = data;
    } 
}

class UnAuthorizedError extends BaseError {
    constructor(message) {
        super(message, statusCode.UN_AUTHORIZED)
    }
}

class ForbiddenError extends BaseError {
    constructor(message) {
        super(message, statusCode.FORBIDDEN)
    }
}

module.exports = {
    BaseError,
    NotFoundError,
    BadRequestError,
    UnAuthorizedError,
    ForbiddenError
}