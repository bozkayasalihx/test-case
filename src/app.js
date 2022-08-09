require("./utils/envLoader");
const express = require("express");

const sequlize = require("./db");
const { authenticator } = require("./middlewares/authenticator");
const { makeSureConnectionOk } = require("./utils/checkConnection");
const { __prod__ } = require("./utils/dev");
const loginRouter = require("./routes/user");
const bookListRouter = require("./routes/book");
const { notFound } = require("./routes/notFound");

const main = async () => {
    await makeSureConnectionOk(sequlize);
    !__prod__ && (await sequlize.sync());

    const app = express();

    // middlewares;
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use("/", loginRouter);

    app.use(authenticator);
    app.use("/books", bookListRouter);

    app.use("*", notFound);

    app.listen(process.env.SERVER_PORT, () => {
        console.log("listening on port " + process.env.SERVER_PORT);
    });
};

main().catch(err => console.log("err", err));
