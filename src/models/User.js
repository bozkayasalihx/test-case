require("../utils/envLoader");
const { DataTypes } = require("sequelize");
const argon2 = require("argon2");

module.exports = sequelize => {
    const User = sequelize.define(
        "user",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            email: {
                allowNull: false,
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                allowNull: false,
                type: DataTypes.STRING,
                validate: {
                    is: /^.{3,}$/,
                },
            },
        },
        {
            tableName: "users",
            hooks: {
                beforeCreate: async (record, options) => {
                    record.dataValues.password = await argon2.hash(
                        record.dataValues.password
                    );
                },
            },
        }
    );

    return User;
};
