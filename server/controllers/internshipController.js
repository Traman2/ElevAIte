import Internship from '../models/internshipModel.js';
import User from "../models/userModel.js";

// Create new internship
const createInternship = async (req, res) => {
  try {
    const { date, name, category, employer, status, description, userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const internship = new Internship({ date, name, category, employer, status, description, userId });
    await internship.save();
    res.status(201).json(internship);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Get all internships for a user
const getUserInternships = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const internships = await Internship.find({ userId }).sort({ date: -1 });
    res.json(internships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete internship by id
const deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;
    await Internship.findByIdAndDelete(id);
    res.json({ message: 'Internship deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
} 

export {
    createInternship,
    getUserInternships,
    deleteInternship
}