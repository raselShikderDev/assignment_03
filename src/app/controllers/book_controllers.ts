import express, { NextFunction, Request, Response } from "express";
import { bookModel } from "../models/book_Model";
import { TSort } from "../types/book_types";
import { bookUpdateZodSchema, bookZod, filterQueryZodSchema, paramsZodSchema } from "../zodSchema/bokZodSchema";
const bookRouter = express.Router();


bookRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await bookZod.parseAsync(req.body);

      const newBook = new bookModel(book);

      const savedBook = await newBook.save();

      res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: savedBook,
      });
    } catch (error: any) {
      next(error);
    }
  }
);

bookRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedQuery = await filterQueryZodSchema.parseAsync(req.query);
    let { filter, sortBy, sort, limit } = parsedQuery;

    const actualSortBy = sortBy || "createdAt";
    const sortedValue: TSort = sort === "desc" ? "desc" : "asc";

    const refinelimit = parseInt(limit);

    const userQuery: Record<string, any> = {};
    if (filter) userQuery.genre = filter;

    const sortOptions: Record<string, -1 | 1> = {
      [actualSortBy]: sortedValue === "desc" ? -1 : 1,
    };

    const searchResult = await bookModel
      .find(userQuery)
      .sort(sortOptions)
      .limit(refinelimit);

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: searchResult,
    });
  } catch (error) {
    next(error);
  }
});

bookRouter.get(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookId } = await paramsZodSchema.parseAsync({
        bookId: req.params.bookId,
      });

      const searchResult = await bookModel.findById(bookId);
      if (!searchResult) {
        res.status(404).json({
          success: false,
          message: `Book with Id ${bookId} not found`,
          error: {
            name: "ResourceNotFoundError",
            message: "The specified book could not be found.",
          },
        });
      }
      res.status(200).json({
        success: true,
        message: "Books retrieved successfully",
        data: searchResult,
      });
    } catch (error) {
      next(error);
    }
  }
);

bookRouter.patch(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookId } = await paramsZodSchema.parseAsync({
        bookId: req.params.bookId,
      });
      const updateBook = await bookUpdateZodSchema.parseAsync(req.body);
      if (Object.keys(updateBook).length === 0) {
        res.status(400).json({
          success: false,
          message: `No update information provided in the request body.`,
        });
        return;
      }
      const searchResult = await bookModel.findByIdAndUpdate(
        bookId,
        updateBook,
        {
          new: true,
        }
      );
      if (!searchResult) {
        res.status(404).json({
          success: false,
          message: `Book with Id ${bookId} not found`,
          error: {
            name: "ResourceNotFoundError",
            message: "The specified book could not be found.",
          },
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: searchResult,
      });
    } catch (error) {
      next(error);
    }
  }
);

bookRouter.delete(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookId } = await paramsZodSchema.parseAsync({
        bookId: req.params.bookId,
      });
      const deletedBook = await bookModel.findByIdAndDelete(bookId);

      if (!deletedBook) {
        res.status(404).json({
          success: false,
          message: `Book with Id ${bookId} not found`,
          error: {
            name: "ResourceNotFoundError",
            message: "The specified book could not be found.",
          },
        });
      }

      res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: deletedBook,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default bookRouter;