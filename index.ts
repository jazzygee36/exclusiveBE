import express, { response } from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import bodyParser from 'body-parser';
const Port = process.env.PORT || 5000;
import cors from 'cors';
import { UsersRouter } from './modules/usersAuth/users.route';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI as string;
mongoose
  .connect(uri)
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(() => {
    console.log('error');
  });

app.use(express.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use('/api', UsersRouter);

app.listen(Port, () => {
  try {
    console.log('Working', Port);
  } catch (error) {
    response.status(500).send(error);
  }
});
