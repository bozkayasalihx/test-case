const { DataTypes } = require("sequelize");

module.exports = sequlize => {
    const bookmarks = sequlize.define("bookmark", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        book_id: {
            type: DataTypes.STRING,
            unique: true
        },
    });

    return bookmarks;
};
