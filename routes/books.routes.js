import express from "express";
import {Book} from "../models/book.model.js";

const router = express.Router();

/**
 * GET /books
 * Returns the current list of books in the stored collection.
 */
router.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    return res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({ error: "Error fetching books" });
  }
});

/**
 * GET /book
 * Returns a single book by its title.
 */
router.get("/book", async (req, res) => {
  try {
    const {title} = req.body;
    const book = await Book.find({ title });
    return res.json(book);
  } catch (error) {
    console.error("Error fetching the book:", error);
    return res.status(500).json({ error: "Error fetching the book" });
  }
});

/**
 * POST /books/rent
 * Atomically rents a book if it’s not already rented.
 * Accepts a JSON body with { bookId, userId }.
 */
router.post("/books/rent", async (req, res) => {
  const { bookId, userId } = req.body;
  if (!bookId || !userId) {
    return res.status(400).json({ error: "Missing bookId or userId" });
  }

  try {
    // Atomic update: only update if the book is not already rented.
    const updatedBook = await Book.findOneAndUpdate(
      { openLibraryId: bookId, isRented: false },
      { isRented: true, rentedBy: userId, rentedAt: new Date() },
      { new: true }
    );

    if (!updatedBook) {
      return res
        .status(400)
        .json({ error: "Book already rented or not found" });
    }

    return res.status(200).json({ message: "Book rented successfully", book: updatedBook });
  } catch (error) {
    console.error("Error renting book:", error);
    return res.status(500).json({ error: "Error renting book" });
  }
});

/**
 * POST /books/return
 * Returns a book if it was previously rented by the given user.
 * Accepts a JSON body with { bookId, userId }.
 */
router.post("/books/return", async (req, res) => {
  const { bookId, userId } = req.body;
  if (!bookId || !userId) {
    return res.status(400).json({ error: "Missing bookId or userId" });
  }

  try {
    // Check that the book is rented by the given user and update it atomically.
    const updatedBook = await Book.findOneAndUpdate(
      { openLibraryId: bookId, isRented: true, rentedBy: userId },
      { isRented: false, rentedBy: null, rentedAt: null },
      { new: true }
    );

    if (!updatedBook) {
      return res
        .status(400)
        .json({ error: "Book is not rented by this user or not found" });
    }

    return res.status(200).json({
      message: "Book returned successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Error returning book:", error);
    return res.status(500).json({ error: "Error returning book" });
  }
});

export default router;