import { Router } from 'express';
import { createTask, getClassTasks, updateTask, deleteTask } from '../controllers/taskController.js';

const router = Router();

router.post('/', createTask); // Create task
router.get('/class/:classId', getClassTasks); // Get all tasks for a class
router.patch('/:id', updateTask); // Update task
router.delete('/:id', deleteTask); // Delete task

export default router; 