require("dotenv").config();
const { Router } = require("express");
const httpStatus = require("http-status");
const sequlize = require("../db");
const { makeSureAsyncError } = require("../middlewares/handleError");

const jwt = require("jsonwebtoken");

const router = Router();

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "invdalid credentials",
        });
    }

    const user = await sequlize.models.user.findOne({ where: { email } });
    if (!user) {
        return res.status(httpStatus.NOT_FOUND).json({
            message: "user does not exit", // burasi onemli cunku csrf attacklardan korunmak icin bulmadimiz halde dogruymus gibi return ediyorum
        });
    }

    const jwtHash = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_DURATION,
    });

    return res.status(httpStatus.OK).json({
        message: "ok",
        data: jwtHash,
    });
}

async function register(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "invalid credentials",
        });
    }

    await sequlize.models.user.create({ email, password });

    return res.status(httpStatus.OK).json({
        message: "ok",
    });
}
router.post("/login", makeSureAsyncError(login));
router.post("/register", makeSureAsyncError(register));

module.exports = router;
