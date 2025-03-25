import mongoose from "mongoose";

const DB_NAME = "Book-API"

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
    
        console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;