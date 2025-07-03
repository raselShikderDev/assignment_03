import { z } from "zod";

export const borrowZodSchema = z.object({
  book: z.string().length(24, "Invalid book ID"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  dueDate: z.coerce.date(),
});
