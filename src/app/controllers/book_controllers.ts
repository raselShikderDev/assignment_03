import express, { Request, Response } from "express"
import { bookModel } from "../models/book_Model";
import { TSort } from "../types/book_types";
const bookRouter = express.Router()


// Problem - 01
bookRouter.post("/", async (req: Request, res: Response) => {
  try {
    const book = req.body;
    if (!book || Object.keys(book).length === 0) {
      res.status(400).json({
        success: true,
        message: "Book not found",
        data: book,
      });
    }
    const newBook = new bookModel(book);

    const savedBook = await newBook.save();

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: savedBook,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Validation failed",
      success: false,
      error,
    });
  }
});


// Problem - 02
bookRouter.get("/", async (req: Request, res: Response) => {
  try {
    let { filter, sortBy = "createdAt", sort, limit = "10" } = req.query;
    if (filter) filter = filter.toString().toUpperCase();
    console.log(`[DEBUG - filter: ${filter}]`);

    if (sortBy) sortBy = sortBy.toString();
    const sortedValue: TSort = sort === "desc" ? "desc" : "asc";

    const refinelimit = parseInt(limit.toString());

    const userQuery: Record<string, any> = {};
    if(filter) userQuery.genre = filter.toUpperCase();

    const sortOptions: Record<string, -1 | 1> = {
      [sortBy]: sortedValue === "desc" ? -1 : 1,
    };

    const searchResult = await bookModel
      .find(userQuery)
      .sort(sortOptions)
      .limit(refinelimit);

    res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      data: searchResult,
    });
  } catch (error) {
    res.status(400).json({
      message: "Validation failed",
      success: false,
      error,
    });
  }
});


// Problem 3 Get Book by ID
bookRouter.get("/:bookId", async (req: Request, res: Response) =>{
  try {
    const bookId = req.params.bookId
    if(!bookId) {
      res.status(404).json({
      success: false,
      message: `Book Id not provided`,
    });
    }

  console.log(bookId)
  const searchResult = await bookModel.findById(bookId)
   if (!searchResult || Object.keys(searchResult).length === 0) {
      res.status(404).json({
        success: false,
        message: `Book with Id ${bookId} not found`,
      });
    }
  res.status(200).json({
      success: true,
      message: "Book fetched successfully",
      data: searchResult,
    });
  } catch (error) {
    res.status(400).json({
      message: "Book not found",
      success: false,
      error,
    });
  }
})


// Problem - 4 Update Book by ID
bookRouter.patch(":bookId", async (req: Request, res: Response) =>{
  try {
    const bookId = req.params.bookId
    if(!bookId) {
      res.status(404).json({
      success: false,
      message: `Book Id not provided`,
    });
    }
    
    const updateBook = req.body
    if(Object.keys(updateBook).length === 0 || !updateBook) {
      res.status(400).json({
      success: false,
      message: `Updated information is not found`,
    });
    }
  const searchResult = await bookModel.findByIdAndUpdate(bookId, updateBook, {new:true})
    if (!searchResult  || Object.keys(searchResult).length === 0) {
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
  } catch (error) {
    res.status(400).json({
      message: "Updating book is faild",
      success: false,
      error,
    });
  }
})


// Problem - 5 Delete Book by ID
bookRouter.delete("/:bookId", async (req: Request, res: Response) =>{
  try {
    const bookId = req.params.bookId
    if(!bookId) {
      res.status(404).json({
      success: false,
      message: `Book Id not provided`,
    });
    }
    const deletedBook = await bookModel.findByIdAndDelete(bookId)    

    if (!deletedBook || Object.keys(deletedBook).length === 0) {
      res.status(404).json({
        success: false,
        message: `Book with Id ${bookId} not found`,
      });
    }
        console.log(`Deleted book: ${deletedBook}`);

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: deletedBook,
    });
  } catch (error) {
     res.status(400).json({
      message: "Deleting book is faild",
      success: false,
      error,
    });
  }
})



export default bookRouter