import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import bankAccountRoutes from './routes/bankAccountRoutes.js'


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB Connection failed", err));

//Routes
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/bankaccount', bankAccountRoutes);

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}...`);
});

export default app;
