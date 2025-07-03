import mongoose from "mongoose";
import { z } from "zod";

export const bookZod = z.object({
  title: z.string().min(1, { message: "must be at least 1 characters" }),
  author: z.string().min(1, { message: "must be at least 1 characters" }),
  genre: z.enum(
    ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
    { errorMap: () => ({ message: "genre must be among from avilable list" }) }
  ),
  isbn: z.string(),
  description: z.string().optional(),
  copies: z
    .number()
    .int()
    .min(0, { message: "Copies must be a non-negative integer" }),
  available: z.boolean().default(true),
});

export const paramsZodSchema = z.object({
  bookId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid Book ID format",
  }),
});

export const filterQueryZodSchema = z.object({
  filter: z
    .enum(
      ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
      {
        errorMap: () => ({ message: "genre must be among from avilable list" }),
      }
    )
    .optional(),
  sortBy: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional(),
  limit: z.string().regex(/^\d+$/).optional().default("10"),
});

export const bookUpdateZodSchema = bookZod.partial();