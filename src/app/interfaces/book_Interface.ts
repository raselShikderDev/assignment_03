import { Model, Types } from "mongoose";
import { IBookBorrowDataForCreation, IBorrowInterface} from "./borow_interfaces"

export interface IBookInterface{
  title: string;
  author: string;
  genre: "FICTION" | "NON_FICTION" | "SCIENCE" | "HISTORY" | "BIOGRAPHY" | "FANTASY";
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
}

export interface IBookAvailablityCheak extends Model<IBookInterface>{
  bookAvailablity(value:{book:string, quantity:number}):Promise<IBookBorrowDataForCreation | null>;
}
