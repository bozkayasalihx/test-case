const sequlize = require("./db");

const main = async () => {
    await sequlize.authenticate();
};

main().catch(err => console.log("err", err));
