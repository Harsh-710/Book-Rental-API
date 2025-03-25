import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

// Mount books API routes
import booksRouter from './routes/books.routes.js';
app.use('/', booksRouter);

// Initialize the scheduler (this will start the node-cron job)
import './services/scheduler.service.js';

// Catches and handles errors in your application. This should be placed after all your routes.
// Example error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


export { app };