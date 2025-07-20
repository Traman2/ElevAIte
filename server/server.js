import express from "express";
import { createServer } from 'node:http';
import { Server } from 'socket.io';

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
import embedRoutes from './routes/ragAIRoutes.js'

dotenv.config();

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Change this to your React app domain in production
  },
});

const PORT = process.env.PORT || 3000;

const userSockets = new Map(); //HashMap of mongodb id to socket id

//Register user active session with mongodb id to socket id
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // client send MongoDB _id as identifier
  socket.on('register', (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on('disconnect', () => {
    for (const [userId, sId] of userSockets.entries()) {
      if (sId === socket.id) {
        userSockets.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// Notify function for use anywhere (exported)
export default function notifyUser(userId, updateType) {
  const socketId = userSockets.get(userId);
  if (!socketId) {
    console.error(`User ${userId} not connected`);
    return;
  }

  console.log("emitting to " + socketId);

  io.to(socketId).emit('refresh-component', {
    type: updateType,
    message: `Please refresh your ${updateType}`,
  });
}


mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB Connection failed", err));

//Routes
app.use(express.json());
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/bankaccount', bankAccountRoutes);
app.use('/transaction', transactionRoutes);
app.use('/internship', internshipRoutes);
app.use('/class', classRoutes);
app.use('/task', taskRoutes);
app.use('/embed', embedRoutes);

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}...`);
});
