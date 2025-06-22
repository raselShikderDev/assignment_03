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
const express_1 = __importDefault(require("express"));
const book_Model_1 = require("../models/book_Model");
const borrow_model_1 = require("../models/borrow_model");
const borrowRouter = express_1.default.Router();
const zod_1 = require("zod");
const borrowZodSchema = zod_1.z.object({
    book: zod_1.z.string().length(24, "Invalid book ID"),
    quantity: zod_1.z.number().int().min(1, "Quantity must be at least 1"),
    dueDate: zod_1.z.coerce.date(),
});
borrowRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield borrowZodSchema.parseAsync(req.body);
        if (!body || Object.keys(body).length === 0) {
            res.status(404).json({
                success: false,
                message: `Nessecery information of borrowing book is not provided`,
            });
        }
        const availableBook = yield book_Model_1.bookModel.bookAvailablity(req.body);
        if (!availableBook) {
            res.status(404).json({
                success: false,
                message: "Book not found or not enough copies available",
            });
        }
        const BorrowRecord = new borrow_model_1.borrowModel(availableBook);
        const createBorrowRecord = yield BorrowRecord.save();
        if (!createBorrowRecord) {
            res.status(404).json({
                success: false,
                message: "Book borrowing is faild",
            });
        }
        res.status(200).json({
            success: true,
            message: "Book borrowed successfully",
            data: createBorrowRecord,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Request of borrowing book is faild",
            success: false,
            error,
        });
    }
}));
borrowRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookInfoBorrow = yield borrow_model_1.borrowModel.aggregate([
            {
                $lookup: {
                    from: "books",
                    localField: "book",
                    foreignField: "_id",
                    as: "bookDetails",
                },
            },
            { $unwind: "$bookDetails" },
            {
                $group: {
                    _id: "$bookDetails.title",
                    totalQuantity: { $sum: "$quantity" },
                    isbn: { $first: "$bookDetails.isbn" },
                },
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$_id",
                        isbn: "$isbn",
                    },
                    totalQuantity: 1,
                },
            },
        ]);
        if (!bookInfoBorrow) {
            res.status(404).json({
                success: false,
                message: "summary of borrowed books is not found",
            });
        }
        const summeryInOrder = bookInfoBorrow.map((item) => ({
            book: item.book,
            totalQuantity: item.totalQuantity,
        }));
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: summeryInOrder,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Request for summary of borrowed books is faild",
            success: false,
            error,
        });
    }
}));
exports.default = borrowRouter;
