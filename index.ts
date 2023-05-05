import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoute from './routes/auth';

const app = express();
dotenv.config();

const PORT = process.env.PORT
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

app.use(cors());
app.use(express.json());

app.use('/auth', authRoute)

async function start() {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.zpj1zyh.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
    );

    app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
  } catch (err) {
    console.log(err);
  }
}

start()