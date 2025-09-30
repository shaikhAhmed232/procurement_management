const { validationResult } = require("express-validator");
const { BadRequestError } = require("../lib/errors");

module.exports = (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorBody = errors.array().reduce((acc, e) => {
                acc[e.path] = e.msg;
                return acc;
            }, {});
            const error = new BadRequestError("Invalid Body", errorBody);
            throw error;
        }
        next();
    } catch (error) {
        next(error);
    }
}