import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.error(`Server Error: ${error.message}`);
        throw error;
    });
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error(`MongoDB connection failed: ${error.message}`);
});