import express from 'express';
import { getBudgets, createBudget, updateBudget } from '../controllers/budgetController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getBudgets);
router.post('/', createBudget);
router.put('/:id', updateBudget);

export default router;