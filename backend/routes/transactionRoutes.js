const express = require('express');
const { body } = require('express-validator');
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getTransactions).post(
  protect,
  [
    body('amount', 'Amount is required and must be a positive number').isFloat({ min: 0.01 }),
    body('type', 'Type must be income or expense').isIn(['income', 'expense']),
    body('category', 'Category is required').not().isEmpty(),
    body('description', 'Description is required').not().isEmpty(),
    body('date', 'Date is required').isISO8601(),
  ],
  createTransaction
);

router.route('/stats').get(protect, getTransactionStats);

router
  .route('/:id')
  .get(protect, getTransactionById)
  .put(
    protect,
    [
      body('amount', 'Amount must be a positive number').optional().isFloat({ min: 0.01 }),
      body('type', 'Type must be income or expense').optional().isIn(['income', 'expense']),
      body('category', 'Category cannot be empty').optional().not().isEmpty(),
      body('description', 'Description cannot be empty').optional().not().isEmpty(),
      body('date', 'Date must be valid').optional().isISO8601(),
    ],
    updateTransaction
  )
  .delete(protect, deleteTransaction);

module.exports = router;