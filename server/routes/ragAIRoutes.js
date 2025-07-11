import express from 'express';
import { embedUserStateToPinecone, ragQueryCall } from '../controllers/ragAIController.js';

const router = express.Router();

// POST /embed/user/:userId - Embed user state to Pinecone
router.post('/user/:userId', embedUserStateToPinecone);

router.post('/query/:userId', ragQueryCall);

export default router; 