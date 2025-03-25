import cron from "node-cron";
import { fetchGreenBooks, upsertBooks } from "./book.service.js";

// Schedule a job to run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("Fetching green books from Open Library...");
  try {
    const data = await fetchGreenBooks();
    // Assume that the API returns results in an array called "docs"
    if (data && data.docs) {
      await upsertBooks(data.docs);
      console.log("Books upserted successfully.");
    } else {
      console.error("No book entries found in the API response.");
    }
  } catch (error) {
    console.error("Error during scheduled book fetch:", error);
  }
});

console.log("Book fetch scheduler initialized. Running every 5 minutes.");