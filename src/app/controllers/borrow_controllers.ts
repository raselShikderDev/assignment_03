import express, { NextFunction, Request, Response } from "express";
import { bookModel } from "../models/book_Model";
import { borrowModel } from "../models/borrow_model";
const borrowRouter = express.Router();
import { borrowZodSchema } from "../zodSchema/borrowZodSchema";




borrowRouter.post("/", async (req: Request, res: Response, next:NextFunction) => {
  try {
    const body = await borrowZodSchema.parseAsync(req.body);

    const availableBook = await bookModel.bookAvailablity(body);
    if (!availableBook) {
      res.status(404).json({
        success: false,
        message: "Book not found or not enough copies available",
      });
      return
    }

    const BorrowRecord = new borrowModel(availableBook);
    const createBorrowRecord = await BorrowRecord.save();

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: createBorrowRecord,
    });
  } catch (error) {
    next(error)
  }
});

borrowRouter.get("/", async (req: Request, res: Response, next:NextFunction) => {
  try {
    const bookInfoBorrow = await borrowModel.aggregate([
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

    const summeryInOrder = bookInfoBorrow.map((item) => ({
      book: item.book,
      totalQuantity: item.totalQuantity,
    }));

    res.status(200).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: summeryInOrder,
    });
  } catch (error) {
    next(error)
  }
});

export default borrowRouter;
