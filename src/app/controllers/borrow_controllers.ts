import express, { Request, Response } from "express";
import { bookModel } from "../models/book_Model";
import { borrowModel } from "../models/borrow_model";
const borrowRouter = express.Router();




// Problem 6. Borrow a Book
borrowRouter.post("/", async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
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
        message: "Creating borrow record is faild",
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



// problem - 7 Borrowed Books Summary (Using Aggregation)
// GET /api/borrow

// Purpose:

// Return a summary of borrowed books, including:

// Total borrowed quantity per book (totalQuantity)
// Book details: title and isbn
// Details:

// Use MongoDB aggregation pipeline to:

// Group borrow records by book
// Sum total quantity borrowed per book
// Return book info and total borrowed quantity


borrowRouter.get("/", async (req: Request, res: Response) =>{

})



export default borrowRouter;
