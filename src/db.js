const { Sequelize } = require("sequelize");

const sequlize = new Sequelize({
    database: "test",
    username: "test",
    password: "test",
    dialect: "mysql",
});

module.exports = sequlize;
