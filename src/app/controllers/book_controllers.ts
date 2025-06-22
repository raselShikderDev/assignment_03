import express, { Request, Response } from "express";
import { bookModel } from "../models/book_Model";
import { TSort } from "../types/book_types";
import { z } from "zod";
const bookRouter = express.Router();

const bookZod = z.object({
  title: z.string(),
  author: z.string(),
  genre: z.enum([
    "FICTION",
    "NON_FICTION",
    "SCIENCE",
    "HISTORY",
    "BIOGRAPHY",
    "FANTASY",
  ]),
  isbn: z.string(),
  description: z.string().optional(),
  copies: z.number().min(0),
  available: z.boolean(),
});

const bookUpdateZodSchema = bookZod.partial();

export const queryZodSchema = z.object({
  filter: z.string().optional(),
  sortBy: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
});

const paramsZodSchema = z.object({
  bookId: z.string().length(24),
});

bookRouter.post("/", async (req: Request, res: Response) => {
  try {
    const book = await bookZod.parseAsync(req.body);
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

bookRouter.get("/", async (req: Request, res: Response) => {
  try {
    const parsedQuery = await queryZodSchema.parseAsync(req.query);
    let { filter, sortBy = "createdAt", sort, limit = "10" } = parsedQuery;
    if (filter) filter = filter.toString().toUpperCase();

    if (sortBy) sortBy = sortBy.toString();
    const sortedValue: TSort = sort === "desc" ? "desc" : "asc";

    const refinelimit = parseInt(limit.toString());

    const userQuery: Record<string, any> = {};
    if (filter) userQuery.genre = filter.toUpperCase();

    const sortOptions: Record<string, -1 | 1> = {
      [sortBy]: sortedValue === "desc" ? -1 : 1,
    };

    const searchResult = await bookModel
      .find(userQuery)
      .sort(sortOptions)
      .limit(refinelimit);

    // const result = await bookZod.parseAsync(searchResult)

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: searchResult,
    });
  } catch (error) {
    res.status(400).json({
      message: "Books retrieving is faild",
      success: false,
      error,
    });
  }
});

bookRouter.get("/:bookId", async (req: Request, res: Response) => {
  try {
    const { bookId } = await paramsZodSchema.parseAsync({
      bookId: req.params.bookId,
    });
    if (!bookId) {
      res.status(404).json({
        success: false,
        message: `Book Id not provided`,
      });
    }

    console.log(bookId);
    const searchResult = await bookModel.findById(bookId);
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
  } catch (error) {
    res.status(400).json({
      message: "Books retrieving is faild",
      success: false,
      error,
    });
  }
});

bookRouter.patch("/:bookId", async (req: Request, res: Response) => {
  try {
    const { bookId } = await paramsZodSchema.parseAsync({
      bookId: req.params.bookId,
    });
    if (!bookId) {
      res.status(404).json({
        success: false,
        message: `Book Id not provided`,
      });
    }

    const updateBook = await bookUpdateZodSchema.parseAsync(req.body);
    if (Object.keys(updateBook).length === 0 || !updateBook) {
      res.status(400).json({
        success: false,
        message: `Updated information is not found`,
      });
    }
    const searchResult = await bookModel.findByIdAndUpdate(bookId, updateBook, {
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
  } catch (error) {
    res.status(400).json({
      message: "Updating book is faild",
      success: false,
      error,
    });
  }
});

bookRouter.delete("/:bookId", async (req: Request, res: Response) => {
  try {
    const { bookId } = await paramsZodSchema.parseAsync({
      bookId: req.params.bookId,
    });
    if (!bookId) {
      res.status(404).json({
        success: false,
        message: `Book Id not provided`,
      });
    }
    const deletedBook = await bookModel.findByIdAndDelete(bookId);

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
  } catch (error) {
    res.status(400).json({
      message: "Deleting book is faild",
      success: false,
      error,
    });
  }
});

export default bookRouter;
