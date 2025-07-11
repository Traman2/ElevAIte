import express from 'express';
import { embedUserStateToPinecone } from '../controllers/embedController.js';

const router = express.Router();

// POST /embed/user/:userId - Embed user state to Pinecone
router.post('/user/:userId', embedUserStateToPinecone);

export default router; 