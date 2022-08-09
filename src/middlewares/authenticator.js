require("../utils/envLoader");
const httpStatus = require("http-status");
const { TokenExpiredError, verify, decode } = require("jsonwebtoken");
const sequlize = require("../db");

async function authenticator(req, res, next) {
    try {
        let token = req.headers?.authorization;
        if (!token) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "token required",
            });
        }

        token = token.replace("Bearer ", "");

        verify(token, process.env.JWT_SECRET_KEY);
        const { id } = decode(token);
        const user = await sequlize.models.user.findOne({ where: { id } });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "user not found",
            });
        }
        req.user = user;
        return next();
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "token expired",
            });
        }

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}

module.exports = { authenticator };
