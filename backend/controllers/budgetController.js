const Budget = require('../models/Budget');
const { validationResult } = require('express-validator');

// Get all budgets for a user
const getBudgets = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const budgets = await Budget.find({
      user: req.user._id,
      month: { $gte: currentMonth },
    });

    res.json(budgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create or update budget
const setBudget = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category, amount } = req.body;
    const currentDate = new Date();
    const month = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    let budget = await Budget.findOne({
      user: req.user._id,
      category,
      month,
    });

    if (budget) {
      budget.amount = amount;
      await budget.save();
    } else {
      budget = await Budget.create({
        user: req.user._id,
        category,
        amount,
        month,
      });
    }

    res.status(201).json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete budget
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (budget) {
      await Budget.deleteOne({ _id: req.params.id });
      res.json({ message: 'Budget removed' });
    } else {
      res.status(404).json({ message: 'Budget not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBudgets,
  setBudget,
  deleteBudget,
};