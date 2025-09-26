const { BadRequestError } = require("../lib/errors");

const tryCatch = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res);
        } catch (error) {
            if (error.name === "CastError" && error.kind === "ObjectId") {
                next(new BadRequestError(`Invalid object id provided`));
                return;
            }
            next(error);
        }   
    }
}

module.exports = tryCatch;