const httpStatus = require("http-status");
const { constants } = require("../utils/constants");
const { JsonWebTokenError, TokenExpiredError } = require("jsonwebtoken");

function errorMsgHandler(error) {
    const errors = [];
    for (let i = 0; i < error?.errors.length; i++) {
        errors.push(error.errors[i]?.message);
    }

    return errors;
}

function makeSureAsyncError(handler) {
    return async function (req, res, next) {
        try {
            await handler(req, res);
        } catch (error) {
            next(error);
            console.log('err',error);
            if (error?.original?.code === constants.ER_DUP_ENTRY) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: "already taken",
                    data: errorMsgHandler(error),
                });
            }

            if (error?.code === constants.ERR_BAD_RESPONSE) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: "that book doesnt exist",
                    data: error.message,
                });
            }

            if (error instanceof TokenExpiredError) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: "token expired",
                });
            }
            if (error instanceof JsonWebTokenError) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: "invalid token",
                });
            }
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "invalid request",
            });
        }
    };
}

module.exports = { makeSureAsyncError };
