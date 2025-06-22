"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryZodSchema = void 0;
const express_1 = __importDefault(require("express"));
const book_Model_1 = require("../models/book_Model");
const zod_1 = require("zod");
const bookRouter = express_1.default.Router();
const bookZod = zod_1.z.object({
    title: zod_1.z.string(),
    author: zod_1.z.string(),
    genre: zod_1.z.enum([
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
    ]),
    isbn: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.number().min(0),
    available: zod_1.z.boolean(),
});
const bookUpdateZodSchema = bookZod.partial();
exports.queryZodSchema = zod_1.z.object({
    filter: zod_1.z.string().optional(),
    sortBy: zod_1.z.string().optional(),
    sort: zod_1.z.enum(["asc", "desc"]).optional(),
    limit: zod_1.z.string().regex(/^\d+$/).optional(),
});
const paramsZodSchema = zod_1.z.object({
    bookId: zod_1.z.string().length(24),
});
bookRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield bookZod.parseAsync(req.body);
        if (!book || Object.keys(book).length === 0) {
            res.status(400).json({
                success: true,
                message: "Book not found",
                data: book,
            });
        }
        const newBook = new book_Model_1.bookModel(book);
        const savedBook = yield newBook.save();
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: savedBook,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error,
        });
    }
}));
bookRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedQuery = yield exports.queryZodSchema.parseAsync(req.query);
        let { filter, sortBy = "createdAt", sort, limit = "10" } = parsedQuery;
        if (filter)
            filter = filter.toString().toUpperCase();
        if (sortBy)
            sortBy = sortBy.toString();
        const sortedValue = sort === "desc" ? "desc" : "asc";
        const refinelimit = parseInt(limit.toString());
        const userQuery = {};
        if (filter)
            userQuery.genre = filter.toUpperCase();
        const sortOptions = {
            [sortBy]: sortedValue === "desc" ? -1 : 1,
        };
        const searchResult = yield book_Model_1.bookModel
            .find(userQuery)
            .sort(sortOptions)
            .limit(refinelimit);
        // const result = await bookZod.parseAsync(searchResult)
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: searchResult,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Books retrieving is faild",
            success: false,
            error,
        });
    }
}));
bookRouter.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = yield paramsZodSchema.parseAsync({
            bookId: req.params.bookId,
        });
        if (!bookId) {
            res.status(404).json({
                success: false,
                message: `Book Id not provided`,
            });
        }
        console.log(bookId);
        const searchResult = yield book_Model_1.bookModel.findById(bookId);
        if (!searchResult || Object.keys(searchResult).length === 0) {
            res.status(404).json({
                success: false,
                message: `Book with Id ${bookId} not found`,
            });
        }
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: searchResult,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Books retrieving is faild",
            success: false,
            error,
        });
    }
}));
bookRouter.patch("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = yield paramsZodSchema.parseAsync({
            bookId: req.params.bookId,
        });
        if (!bookId) {
            res.status(404).json({
                success: false,
                message: `Book Id not provided`,
            });
        }
        const updateBook = yield bookUpdateZodSchema.parseAsync(req.body);
        if (Object.keys(updateBook).length === 0 || !updateBook) {
            res.status(400).json({
                success: false,
                message: `Updated information is not found`,
            });
        }
        const searchResult = yield book_Model_1.bookModel.findByIdAndUpdate(bookId, updateBook, {
            new: true,
        });
        if (!searchResult || Object.keys(searchResult).length === 0) {
            res.status(404).json({
                success: false,
                message: `Book with Id ${bookId} not found`,
            });
        }
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: searchResult,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Updating book is faild",
            success: false,
            error,
        });
    }
}));
bookRouter.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = yield paramsZodSchema.parseAsync({
            bookId: req.params.bookId,
        });
        if (!bookId) {
            res.status(404).json({
                success: false,
                message: `Book Id not provided`,
            });
        }
        const deletedBook = yield book_Model_1.bookModel.findByIdAndDelete(bookId);
        if (!deletedBook || Object.keys(deletedBook).length === 0) {
            res.status(404).json({
                success: false,
                message: `Book with Id ${bookId} not found`,
            });
        }
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: deletedBook,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Deleting book is faild",
            success: false,
            error,
        });
    }
}));
exports.default = bookRouter;
