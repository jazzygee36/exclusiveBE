import express, { Application } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { UsersRouter } from './modules/usersAuth/users.route';

// Initialize dotenv to use environment variables
dotenv.config();

// Initialize express app
const app: Application = express();

// Set the port
const Port = process.env.PORT || 5000;

// MongoDB connection
const uri = process.env.MONGODB_URI as string;
mongoose
  .connect(uri)
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((error) => {
    console.error('Error connecting to DB:', error);
  });

// Middleware
app.use(express.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Routes
app.use('/api', UsersRouter);

export default app;
