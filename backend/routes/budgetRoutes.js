const express = require('express');
const { body } = require('express-validator');
const {
  getBudgets,
  setBudget,
  deleteBudget,
} = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getBudgets).post(
  protect,
  [
    body('category', 'Category is required').not().isEmpty(),
    body('amount', 'Amount is required and must be a positive number').isFloat({ min: 0.01 }),
  ],
  setBudget
);

router.route('/:id').delete(protect, deleteBudget);

module.exports = router;