import express from 'express';
import { ragQueryCall } from '../controllers/ragAIController.js';

const router = express.Router();

router.post('/query/:userId', ragQueryCall);

export default router; 