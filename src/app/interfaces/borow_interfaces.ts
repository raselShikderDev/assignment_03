import { Types } from "mongoose";

export interface IBorrowInterface {
  book: Types.ObjectId;
  quantity: number;
  dueDate: Date;
}

export interface IBookBorrowDataForCreation {
  book: string; 
  quantity: number;
  dueDate: Date;
}
