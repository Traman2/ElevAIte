import {Router} from 'express';
import { createInternship, getUserInternships, deleteInternship } from '../controllers/internshipController.js';

const router = Router();

router.post('/', createInternship); // Create internship
router.get('/user/:userId', getUserInternships); // Get all internships for a user
router.delete('/:id', deleteInternship); // Delete internship by id

export default router;