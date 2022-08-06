const { Sequelize } = require("sequelize");

const sequlize = new Sequelize({
    database: "test",
    username: "google",
    password: "google",
    dialect: "mysql",
});

const main = async () => {
    const test = await sequlize.authenticate();
    console.log("test", test);
};

main().catch(err => console.log("err", err));
