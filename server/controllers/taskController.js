import TaskModel from '../models/taskModel.js';
import ClassModel from '../models/classModel.js';

// Create a new task
const createTask = async (req, res) => {
  try {
    const { name, isComplete, dueDate, classId } = req.body;
    const classObj = await ClassModel.findById(classId);
    if (!classObj) return res.status(404).json({ message: 'Class not found' });
    const newTask = new TaskModel({ name, isComplete, dueDate, classId });
    await newTask.save();
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
    const { name, isComplete, dueDate } = req.body;
    const updated = await TaskModel.findByIdAndUpdate(id, { name, isComplete, dueDate }, { new: true });
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
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { createTask, getClassTasks, updateTask, deleteTask }; 