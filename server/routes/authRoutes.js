import { Router } from 'express'
import authUser from '../controllers/authController.js';

const router = Router();

//use for login portal
router.post('/', authUser);

export default router;