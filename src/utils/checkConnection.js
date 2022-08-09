async function makeSureConnectionOk(sequlize) {
    try {
        await sequlize.authenticate();
        console.log("connection ok");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = { makeSureConnectionOk };
