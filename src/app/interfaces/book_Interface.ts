import { Model, Types } from "mongoose";
import { IBorrowInterface} from "./borow_interfaces"

export interface IBookInterface{
  title: string;
  author: string;
  genre: {
    type: string;
    value: [
      "FICTION",
      "NON_FICTION",
      "SCIENCE",
      "HISTORY",
      "BIOGRAPHY",
      "FANTASY"
    ];
  };
  isbn: string;
  description?: string;
  copies: number;
  available: {
    type: boolean;
    default: false;
  };
}

export interface IBookAvailablityCheak extends Model<IBookInterface>{
  bookAvailablity(value:{book:string, quantity:number}):Promise<IBorrowInterface | null>;
}
