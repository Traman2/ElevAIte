import { pinecone } from "../services/pinecone.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

//Task Models
import User from "../models/userModel.js";
import ClassModel from "../models/classModel.js";
import Internship from "../models/internshipModel.js";
import TaskModel from "../models/taskModel.js";
import Transaction from "../models/transactionModel.js";
import Account from "../models/bankAccountModel.js";

const genAI = new GoogleGenAI(process.env.Google_GenAI_URL);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default function ragQueryHandler(query) {

}

const addTask = () => {

}

const addClass = () => {

}

const addBankAccount = () => {

}

const addInternship = () => {

}

const addtransaction = () => {

}