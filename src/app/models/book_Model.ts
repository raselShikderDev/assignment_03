import mongoose, { Model, Schema } from "mongoose";
import {
  IBookAvailablityCheak,
  IBookInterface,
} from "../interfaces/book_Interface";

const bookSchema = new mongoose.Schema<IBookInterface>(
  {
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
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

bookSchema.static("bookAvailablity", async function bookAvailablity(reqBook) {
  const { book, quantity, dueDate} = reqBook;
  const userRequestBook = await this.findById(book);
  if (!userRequestBook) return;
  console.log("[DEBUG] - From static before operation: ", userRequestBook);
  if (userRequestBook.copies === 0 || userRequestBook.copies < quantity) return;
  userRequestBook.copies = userRequestBook.copies - quantity;
  if (userRequestBook.copies === 0) userRequestBook.available = false;
   await userRequestBook.save();
  console.log("[DEBUG] - From static after operation: ", userRequestBook);
  return { book, quantity, dueDate};
});

// bookSchema.statics.checkAvailability = async function (book: string, quantity: number) {
//   const book = await this.findById(book);
//   if (!book) return null;
//   if (book.copies < quantity) return null; // Not enough copies
//   return book;
// };

export const bookModel = mongoose.model<IBookInterface, IBookAvailablityCheak>(
  "Books",
  bookSchema
);
