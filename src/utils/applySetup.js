function applySetup(sequlize) {
    const { user, bookmark } = sequlize.models;

    user.hasMany(bookmark, {
        foreignKey: {
            name: "user_id",
            allowNull: false,
        },
    });
    bookmark.belongsTo(user);
}

module.exports = { applySetup };
