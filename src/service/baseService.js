const { constants } = require("../utils/constants");
const axios = require("axios").default;

class BaseService {
    baseurl = constants.BOOK_API_ENDPOINT;

    get baseInstance() {
        return axios.create({ baseURL: this.baseurl });
    }
}

module.exports = { BaseService };
