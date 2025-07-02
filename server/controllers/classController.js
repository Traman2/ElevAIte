import ClassModel from '../models/classModel.js';
import User from '../models/userModel.js';

// Create a new class
const createClass = async (req, res) => {
  try {
    const { className, userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const newClass = new ClassModel({ className, userId });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all classes for a user
const getUserClasses = async (req, res) => {
  try {
    const { userId } = req.params;
    const classes = await ClassModel.find({ userId });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a class
const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { className } = req.body;
    const updated = await ClassModel.findByIdAndUpdate(id, { className }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a class
const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    await ClassModel.findByIdAndDelete(id);
    res.json({ message: 'Class deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { createClass, getUserClasses, updateClass, deleteClass }; 