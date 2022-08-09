const { BaseService } = require("./baseService");

class BookService extends BaseService {
    getAllBooks(queryObj) {
        return this.baseInstance.get("/volumes", { params: { ...queryObj} });
    }

    getSingleBook(bookId) {
        return this.baseInstance.get(`/volumes/${bookId}`)
    }
}

const bookService = new BookService();

module.exports = { bookService };
