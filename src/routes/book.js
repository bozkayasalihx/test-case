const { Router } = require("express");
const httpStatus = require("http-status");
const sequlize = require("../db");
const { makeSureAsyncError } = require("../middlewares/handleError");
const { bookService } = require("../service/bookService");
const redis = require("../service/redis");
const { slugify } = require("../utils/stringSlugify");

function dataTransformer(data) {
    //          "id": "LbnwCQAAQBAJ",
    //         "title": "Playing Harry Potter",
    //         "subtitle": "Essays and Interviews on Fandom and Performance",
    //         "authors": [
    //             "Lisa S. Brenner"
    //         ],
    //         "publisher": "McFarland",
    //         "publishedDate": "2015-06-11",
    //         "description":
    return data.items.map(item => {
        return {
            id: item.id,
            title: item.volumeInfo.title,
            subtitle: item.volumeInfo.subtitle,
            authors: item.volumeInfo.authors,
            publisher: item.volumeInfo.publisher,
            publishedDate: item.volumeInfo.publisherDate,
            description: item.volumeInfo.description,
        };
    });
}

const router = Router();

async function bookList(req, res) {
    const query = slugify(req.query);
    const { data } = await bookService.getAllBooks(query);

    return res.status(httpStatus.OK).json({
        message: "ok",
        data: dataTransformer(data),
    });
}

async function createBookmark(req, res) {
    const { book_id } = req.body;
    const user = req.user;

    const uniqueKey = `${user.id},${book_id}`;
    const bookId = await redis.get(uniqueKey);
    if (!bookId) {
        const { data } = await bookService.getSingleBook(book_id);
        await redis.set(uniqueKey, data.id, "EX", 60 * 30); // 30mins cache for storing book id
    }

    const bookmark = await sequlize.models.bookmark.create({
        book_id: book_id,
        user_id: user.id,
    });

    return res.status(httpStatus.OK).json({
        message: "ok",
        data: bookmark,
    });
}

async function getAllBookmarks(req, res) {
    const user = req.user;
    const maxResults = req.query?.maxResults;
    const startIndex = req.query?.startIndex;

    console.log("req.query", req.query);

    const allBookmarks = await sequlize.models.bookmark.findAndCountAll({
        limit: maxResults ? +maxResults : undefined,
        offset: startIndex ? +startIndex : undefined,
        where: {
            user_id: user.id,
        },
    });

    return res.status(httpStatus.OK).json({
        message: "ok",
        data: allBookmarks,
    });
}

async function removeBookmark(req, res) {
    const { book_id } = req.body;
    const user = req.user;
    await sequlize.models.bookmark.destroy({
        where: { book_id, user_id: user.id },
    });

    return res.status(httpStatus.OK).json({
        message: "ok",
    });
}

router.get("/book_list", makeSureAsyncError(bookList));
router.post("/create_bookmark", makeSureAsyncError(createBookmark));
router.get("/bookmark_list", makeSureAsyncError(getAllBookmarks));
router.delete("/remove_bookmark", makeSureAsyncError(removeBookmark));

module.exports = router;
