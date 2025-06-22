import express, { Request, Response } from "express";
import { bookModel } from "../models/book_Model";
import { borrowModel } from "../models/borrow_model";
const borrowRouter = express.Router();
import { z } from "zod";

const borrowZodSchema = z.object({
  book: z.string().length(24, "Invalid book ID"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  dueDate: z.coerce.date(),
});

borrowRouter.post("/", async (req: Request, res: Response) => {
  try {
    const body = await borrowZodSchema.parseAsync(req.body);
    if (!body || Object.keys(body).length === 0) {
      res.status(404).json({
        success: false,
        message: `Nessecery information of borrowing book is not provided`,
      });
    }

    const availableBook = await bookModel.bookAvailablity(req.body);
    if (!availableBook) {
      res.status(404).json({
        success: false,
        message: "Book not found or not enough copies available",
      });
    }

    const BorrowRecord = new borrowModel(availableBook);
    const createBorrowRecord = await BorrowRecord.save();
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
  } catch (error) {
    res.status(400).json({
      message: "Request of borrowing book is faild",
      success: false,
      error,
    });
  }
});


borrowRouter.get("/", async (req: Request, res: Response) => {
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
  } catch (error) {
    res.status(400).json({
      message: "Request for summary of borrowed books is faild",
      success: false,
      error,
    });
  }
});

export default borrowRouter;
