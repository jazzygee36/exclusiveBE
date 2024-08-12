// src/db.ts

import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.DATABASE_NAME as string;
const client = new MongoClient(uri);

let db: Db;

export const connectToDatabase = async () => {
  try {
    await client.connect(); // Connect to the MongoDB server
    db = client.db(dbName); // Use the database name from the environment variable
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    throw error;
  }
};

export const getDb = (): Db => {
  if (!db) {
    throw new Error('Database not connected!');
  }
  return db;
};
