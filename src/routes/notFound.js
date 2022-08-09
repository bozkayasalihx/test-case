const httpStatus = require("http-status");

function notFound(req, res) {
    return res.status(httpStatus.BAD_REQUEST).json({
        message: "that route not found",
    });
}

module.exports = { notFound };
