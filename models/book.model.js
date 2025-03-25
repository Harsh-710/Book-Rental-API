import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    openLibraryId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    authors: [{ type: String }],
    description: {
        type: String
    },
    isRented: {
        type: Boolean,
        default: false 
    },
    rentedBy: {     // userid of the user who rented the book
        type: String,
        default: null
    },
    rentedAt: {
        type: Date,
        default: null
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);
