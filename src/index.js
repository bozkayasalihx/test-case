const dotenv = require('dotenv');
const sequlize = require("./db");


dotenv.config();

const main = async () => {
    await sequlize.authenticate();
};

main().catch(err => console.log("err", err));
