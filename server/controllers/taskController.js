import TaskModel from '../models/taskModel.js';
import ClassModel from '../models/classModel.js';
import { embedUserStateToPineconeLocal } from "../controllers/ragAIController.js";

// Create a new task
const createTask = async (req, res) => {
  try {
    const { name, isComplete, dueDate, classId, userId } = req.body;
    const classObj = await ClassModel.findById(classId);
    if (!classObj) return res.status(404).json({ message: 'Class not found' });
    const newTask = new TaskModel({ name, isComplete, dueDate, classId });
    await newTask.save();
    embedUserStateToPineconeLocal(userId, false);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all tasks for a class
const getClassTasks = async (req, res) => {
  try {
    const { classId } = req.params;
    const tasks = await TaskModel.find({ classId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {updates, userId} = req.body;
    const updated = await TaskModel.findByIdAndUpdate(id, updates, { new: true });
    embedUserStateToPineconeLocal(userId, false);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await TaskModel.findByIdAndDelete(id);
    const {userId} = req.body;
    embedUserStateToPineconeLocal(userId, true);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { createTask, getClassTasks, updateTask, deleteTask }; 