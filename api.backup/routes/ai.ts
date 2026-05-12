import express from 'express';
import { analyze } from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/analyze', analyze);

export default router;