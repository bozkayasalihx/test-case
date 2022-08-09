require("./utils/envLoader");
const { Sequelize } = require("sequelize");
const { applySetup } = require("./utils/applySetup");

const sequlize = new Sequelize({
    database: process.env.DB,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: "mysql",
    logging: true,
});


const models = [require("./models/Bookmark"), require("./models/user")];

for (const model of models) {
    model(sequlize);
}

applySetup(sequlize);

module.exports = sequlize;
