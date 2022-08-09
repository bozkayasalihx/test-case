function slugify(textObj) {
    const slugobj = {};
    for (let [key, value] of Object.entries(textObj)) {
        const newValue = value.replace(/\s+/g, finded => `+${finded.trim()}`);
        slugobj[key] = newValue;
    }

    return slugobj;
}

module.exports = { slugify };
