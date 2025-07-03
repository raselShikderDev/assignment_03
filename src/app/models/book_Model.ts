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
      min: [0, "Copies must be a non-negative number"],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

bookSchema.pre('save', function(next) {
  if (this.isModified('copies') || this.isNew) { 
    this.available = this.copies > 0;
  }
  next();
});

bookSchema.static("bookAvailablity", async function bookAvailablity(reqBook) {
  const { book, quantity, dueDate} = reqBook;
  const userRequestBook = await this.findOneAndUpdate(
    {
      _id:book,
      copies:{
        $gte:quantity
      }
    },
    {
      $inc:{copies:-quantity},
      $set:{
        available:{
          $cond:{
            if: {$eq:["$copies", quantity]},
            then:false,
            else:true,
          }
        }
      }
    },
    {new:true}
  );
  
  if (!userRequestBook) return null;

  return { book, quantity, dueDate};
});

export const bookModel = mongoose.model<IBookInterface, IBookAvailablityCheak>(
  "Books",
  bookSchema
);
