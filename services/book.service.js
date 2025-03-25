import axios from 'axios';
import {Book} from '../models/book.model.js';

const BASE_URL = 'https://openlibrary.org';

async function fetchGreenBooks() {
  try {
    const response = await axios.get(`${BASE_URL}/search.json`, {
      params: { title: 'green' }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
}

async function upsertBooks(bookEntries) {
  // Assume bookEntries is an array of book objects from the API.
  // Modify this mapping as needed depending on API response structure.
  for (const entry of bookEntries) {
    const openLibraryId = entry.key; // e.g., "/books/OL1M"
    const title = entry.title;
    const authors = entry.author_name || [];
    
    // Upsert based on unique openLibraryId
    await Book.findOneAndUpdate(
      { openLibraryId },
      { 
        openLibraryId,
        title,
        authors,
        // Optionally include more fields from the API here
      },
      { upsert: true, new: true }
    );
  }
}


export { fetchGreenBooks, upsertBooks };