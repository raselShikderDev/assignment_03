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
exports.bookModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bookSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        value: [
            "FICTION",
            "NON_FICTION",
            "SCIENCE",
            "HISTORY",
            "BIOGRAPHY",
            "FANTASY",
        ],
        required: true,
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
    },
    description: String,
    copies: {
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: "{VALUE} is not a interger number",
        },
        min: [0, "Copies must be a positive number"],
    },
    available: {
        type: Boolean,
        default: false,
    },
}, {
    versionKey: false,
    timestamps: true,
});
bookSchema.static("bookAvailablity", function bookAvailablity(reqBook) {
    return __awaiter(this, void 0, void 0, function* () {
        const { book, quantity, dueDate } = reqBook;
        const userRequestBook = yield this.findById(book);
        if (!userRequestBook)
            return;
        console.log("[DEBUG] - From static before operation: ", userRequestBook);
        if (userRequestBook.copies === 0 || userRequestBook.copies < quantity)
            return;
        userRequestBook.copies = userRequestBook.copies - quantity;
        if (userRequestBook.copies === 0)
            userRequestBook.available = false;
        yield userRequestBook.save();
        console.log("[DEBUG] - From static after operation: ", userRequestBook);
        return { book, quantity, dueDate };
    });
});
// bookSchema.statics.checkAvailability = async function (book: string, quantity: number) {
//   const book = await this.findById(book);
//   if (!book) return null;
//   if (book.copies < quantity) return null; // Not enough copies
//   return book;
// };
exports.bookModel = mongoose_1.default.model("Books", bookSchema);
