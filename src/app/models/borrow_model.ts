import mongoose, { Schema } from "mongoose";
import { IBorrowInterface } from "../interfaces/borow_interfaces";

const borrowSchema = new mongoose.Schema<IBorrowInterface>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Books",
      required: true,
    },
    quantity: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not a interger number",
      },
      min: [0, "Quantity must be a positive number"],
    },
    dueDate: Date,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

borrowSchema.static("findById", async function bookAvailablity() {
  console.log(`[DEBUG - this of post request : ${this}]`);
});

export const borrowModel = mongoose.model("Borrows", borrowSchema);
