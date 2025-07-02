import { Router } from 'express';
import { createClass, getUserClasses, updateClass, deleteClass } from '../controllers/classController.js';

const router = Router();

router.post('/', createClass); // Create class
router.get('/user/:userId', getUserClasses); // Get all classes for a user
router.put('/:id', updateClass); // Update class
router.delete('/:id', deleteClass); // Delete class

export default router; 