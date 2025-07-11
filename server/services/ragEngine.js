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

const genAI = new GoogleGenAI(process.env.GOOGLE_API_KEY);

export const ragQueryHandler = async (query, userId) => {
  const indexName = "vectordb";
  const namespace = userId.toString();
  const index = pinecone.index(indexName).namespace(namespace);

  //NLP Call code for intent classification
  const airesponse = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: query,
    config: {
      systemInstruction: `
        You are an intelligent AI that classifies user queries related to a personal productivity system.
        
        Your job is to:
        1. Identify the **user's intent** from the options below.
        2. Identify which **data categories** are relevant to fulfill the request.
        3. Rewrite the query to be used directly for similarity search in a vector database.
        
        --- INTENT OPTIONS ---
        Only choose one of the following:
        - "retriveData": The user is asking to view or summarize information (e.g., tasks, internships, balances, summaries).
        - "createClass": The user is asking to create a new class
        - "createTask": The user is asking to create a task for a class
        - "createAccount": The user is asking to create a bank account
        - "createTransaction": The user is asking to add a transaction to an account
        - "createInternship": The user is asking to create a new internship to add to internship manager
        - "notRelatedToActivityManagement": The query is unrelated to this system (e.g., general questions, jokes, greetings, etc.)
        
        --- CATEGORIES ---
        Choose one or more relevant categories (from the list below) that contain the information the user is requesting:
        - "task"
        - "main_summary"
        - "class_summary"
        - "internship_summary"
        - "internship"
        - "transaction"
        - "bank_account"
        
        If the user asks for "task summary", "assignment summary" or "tasks for a specific class", always include "class_summary" in the categories.
        
        --- OUTPUT FORMAT ---
        Return a valid JSON object with the following **three properties only**:
        {
            "intent": "retriveData" | "createClass" | "createTask" | "createAccount" | "createTransaction" | "createInternship" |  "notRelatedToActivityManagement",
            "categories": [one or more of the above],
            "query": "refined query for vector search"
        }
        
        Do not include any explanation, markdown, or extra text—only return the JSON response.`.trim(),
    },
  });

  let result = airesponse.text;
  result = result.replace(/```(?:json)?\n?/g, "");
  result = JSON.parse(result);
  console.log(result);

  //Search Vector Store
  const vectordbResponse = await index.searchRecords({
    query: {
      topK: 100,
      inputs: { text: result.query },
      filter: { type: { $in: result.categories } },
    },
    fields: ["chunk_text", "name", "type"],
  });

  const hits = vectordbResponse.result.hits.filter((hit) => hit._score > 0.2);

  hits.forEach((hit, i) => {
    console.log(`Result #${i + 1}`);
    console.log(`ID: ${hit._id}`);
    console.log(`Score: ${hit._score}`);
    console.log(`Type: ${hit.fields.type || "N/A"}`);
    console.log(`Name: ${hit.fields.name || "N/A"}`);
    console.log(`Chunk Text: ${hit.fields.chunk_text}`);
    console.log("---------------------------");
  });

  let response = {};
  switch (result.intent) {
    case "retriveData":
      response = viewClassSummary(hits, query);
      break;
    case "createClass":
      response = createClass();
      break;
    case "createAccount":
      response = createAccount();
      break;
    case "createTransaction":
      response = createTransaction();
      break;
    case "createInternship":
      response = createInternship();
      break;
    default:
      response = notRelatedToActivityManagement();
  }

  return response;
};

const viewClassSummary = async (chunks, query) => {
  const context = chunks
    .map((chunk, index) => {
      return `# Record ${index + 1}\nType: ${chunk.fields.type}\nName: ${
        chunk.fields.name
      }\nContent: ${chunk.fields.chunk_text}`;
    })
    .join("\n\n");

  const airesponse = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: query,
    config: {
      systemInstruction: `
        You are an intelligent AI Assistant helping a user manage their personal productivity system, which includes academic tasks, internships, financial data, and summaries.

        Your goal is to analyze the user's question and respond clearly and thoroughly **using only the context provided below**.

        --- OBJECTIVE ---
        - Provide an informative, friendly, and well-formatted response.
        - Use only the relevant data given in the context to answer.
        - If multiple records are relevant (e.g., multiple tasks or accounts), list them clearly in sections.
        - If certain information is not found in the context, gracefully say so.
        - Do not render the ID of anything, that is not user friendly

        --- FORMAT ---
        - Respond in **valid Markdown (.md)** format.
        - Use **headings**, **bold text**, and **lists** to make the response easier to read.
        - Group related information under clear headers like:  
        - ## Class Assignments
        - ## Bank Account Balances
        - ## Internship Status
        - ## Summary Overview

        - For example:
        - Use bullet points for lists of tasks or items.
        - Use bold for important labels (e.g., **Due Date**, **Status**, **Balance**).

        --- CONTEXT DATA ---
        ${context}  ← You will be provided with this separately during runtime. Use it only as your knowledge source.

        Now, using the context above, answer the following user query given
`,
    },
  });

  console.log(airesponse.text);

  return { message: airesponse.text, format: "viewClassSummary" };
};

const createClass = () => {
  const message =
    "Support for Creating a New Class is coming soon. Please try asking the personal assistant to view class information or bank balances";
  console.log(message);
  return { message: message, format: "createClass" };
};

const createAccount = () => {
  const message =
    "Support for Creating a New Bank Account is coming soon. Please try asking the personal assistant to view class information or bank balances";
    console.log(message);
  return { message: message, format: "createAccount" };
};

const createTransaction = () => {
  const message =
    "Support for Creating a New Transaction is coming soon. Please try asking the personal assistant to view class information or bank balances";
    console.log(message);
  return { message: message, format: "createTransaction" };
};

const createInternship = () => {
  const message =
    "Support for tracking Internships is coming soon. Please try asking the personal assistant to view class information or bank balances";
    console.log(message);
  return { message: message, format: "createInternship" };
};

const notRelatedToActivityManagement = () => {
  const message = "I am unable to answer that question. Please try again";
  console.log(message);
  return { message: message, format: "notRelatedToActivityManagement" };
};
