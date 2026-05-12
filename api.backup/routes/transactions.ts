import express from 'express';
import { getTransactions, createTransaction, deleteTransaction } from '../controllers/transactionController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getTransactions);
router.post('/', createTransaction);
router.delete('/:id', deleteTransaction);

export default router;