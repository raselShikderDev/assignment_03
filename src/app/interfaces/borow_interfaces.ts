import { Types } from "mongoose";

export interface IBorrowInterface {
  book: Types.ObjectId;
  quantity: number;
  dueDate: Date;
}


