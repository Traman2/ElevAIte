import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import bankAccountRoutes from './routes/bankAccountRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
import internshipRoutes from './routes/internshipRoutes.js'
import classRoutes from './routes/classRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import embedRoutes from './routes/embedRoutes.js'


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
app.use('/transaction', transactionRoutes);
app.use('/internship', internshipRoutes);
app.use('/class', classRoutes);
app.use('/task', taskRoutes);
app.use('/embed', embedRoutes);

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}...`);
});

export default app;
