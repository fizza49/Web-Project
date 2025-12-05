const Transaction = require('../models/Transaction');
const { validationResult } = require('express-validator');

// Get all transactions for a user
const getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log('Fetching transactions for user:', req.user._id);
    console.log('Page:', page, 'Limit:', limit);

    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments({ user: req.user._id });

    console.log(`Found ${transactions.length} transactions out of ${total} total`);

    res.json({
      transactions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTransactions: total,
    });
  } catch (error) {
    console.error('Error in getTransactions:', error);
    res.status(500).json({ 
      message: 'Server error fetching transactions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get transaction by ID
const getTransactionById = async (req, res) => {
  try {
    console.log('Fetching transaction by ID:', req.params.id, 'for user:', req.user._id);

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (transaction) {
      console.log('Transaction found:', transaction._id);
      res.json(transaction);
    } else {
      console.log('Transaction not found for ID:', req.params.id);
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    console.error('Error in getTransactionById:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid transaction ID format' });
    }
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create new transaction - IMPROVED VERSION
const createTransaction = async (req, res) => {
  try {
    console.log('Creating transaction with data:', req.body);
    console.log('For user:', req.user._id);

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { amount, type, category, description, date } = req.body;

    // Additional validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        message: 'Amount must be a positive number' 
      });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ 
        message: 'Type must be either "income" or "expense"' 
      });
    }

    if (!category || category.trim() === '') {
      return res.status(400).json({ 
        message: 'Category is required' 
      });
    }

    if (!description || description.trim() === '') {
      return res.status(400).json({ 
        message: 'Description is required' 
      });
    }

    // Parse and validate date
    let transactionDate;
    try {
      transactionDate = new Date(date);
      if (isNaN(transactionDate.getTime())) {
        return res.status(400).json({ 
          message: 'Invalid date format. Use YYYY-MM-DD' 
        });
      }
    } catch (dateError) {
      console.error('Date parsing error:', dateError);
      return res.status(400).json({ 
        message: 'Invalid date format' 
      });
    }

    // Parse amount to ensure it's a number
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return res.status(400).json({ 
        message: 'Amount must be a valid number' 
      });
    }

    console.log('Creating transaction with parsed data:', {
      user: req.user._id,
      amount: parsedAmount,
      type,
      category: category.trim(),
      description: description.trim(),
      date: transactionDate,
    });

    // Create transaction
    const transaction = await Transaction.create({
      user: req.user._id,
      amount: parsedAmount,
      type,
      category: category.trim(),
      description: description.trim(),
      date: transactionDate,
    });

    console.log('Transaction created successfully:', transaction._id);

    // Fetch the created transaction with full data
    const createdTransaction = await Transaction.findById(transaction._id);
    
    res.status(201).json({
      message: 'Transaction created successfully',
      transaction: createdTransaction
    });
  } catch (error) {
    console.error('Error in createTransaction:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error',
        errors: messages 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Duplicate transaction detected' 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error creating transaction',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update transaction
const updateTransaction = async (req, res) => {
  try {
    console.log('Updating transaction ID:', req.params.id);
    console.log('Update data:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      console.log('Transaction not found for update:', req.params.id);
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update fields if provided
    if (req.body.amount !== undefined) {
      const parsedAmount = parseFloat(req.body.amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ 
          message: 'Amount must be a positive number' 
        });
      }
      transaction.amount = parsedAmount;
    }

    if (req.body.type && !['income', 'expense'].includes(req.body.type)) {
      return res.status(400).json({ 
        message: 'Type must be either "income" or "expense"' 
      });
    }
    
    if (req.body.type) transaction.type = req.body.type;
    if (req.body.category) transaction.category = req.body.category.trim();
    if (req.body.description) transaction.description = req.body.description.trim();
    
    if (req.body.date) {
      const newDate = new Date(req.body.date);
      if (isNaN(newDate.getTime())) {
        return res.status(400).json({ 
          message: 'Invalid date format' 
        });
      }
      transaction.date = newDate;
    }

    transaction.updatedAt = new Date();

    const updatedTransaction = await transaction.save();
    console.log('Transaction updated successfully:', updatedTransaction._id);

    res.json({
      message: 'Transaction updated successfully',
      transaction: updatedTransaction
    });
  } catch (error) {
    console.error('Error in updateTransaction:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error',
        errors: messages 
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid transaction ID format' });
    }
    
    res.status(500).json({ 
      message: 'Server error updating transaction',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete transaction
const deleteTransaction = async (req, res) => {
  try {
    console.log('Deleting transaction ID:', req.params.id, 'for user:', req.user._id);

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      console.log('Transaction not found for deletion:', req.params.id);
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await Transaction.deleteOne({ _id: req.params.id });
    console.log('Transaction deleted successfully:', req.params.id);

    res.json({ 
      message: 'Transaction deleted successfully',
      deletedId: req.params.id
    });
  } catch (error) {
    console.error('Error in deleteTransaction:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid transaction ID format' });
    }
    
    res.status(500).json({ 
      message: 'Server error deleting transaction',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get transaction statistics 
const getTransactionStats = async (req, res) => {
  try {
    console.log('Getting transaction stats for user:', req.user._id);

    const currentDate = new Date();
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    console.log('Date range for stats:', { currentMonth, nextMonth });

    const transactions = await Transaction.find({
      user: req.user._id,
      date: { $gte: currentMonth, $lt: nextMonth },
    });

    console.log(`Found ${transactions.length} transactions for stats calculation`);

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryStats = transactions.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = { 
          income: 0, 
          expense: 0,
          count: 0 
        };
      }
      acc[transaction.category][transaction.type] += transaction.amount;
      acc[transaction.category].count += 1;
      return acc;
    }, {});

    const stats = {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      categoryStats,
      transactionCount: transactions.length,
      dateRange: {
        start: currentMonth,
        end: nextMonth
      }
    };

    console.log('Calculated stats:', {
      totalIncome,
      totalExpenses,
      balance: stats.balance,
      categories: Object.keys(categoryStats).length
    });

    res.json(stats);
  } catch (error) {
    console.error('Error in getTransactionStats:', error);
    res.status(500).json({ 
      message: 'Server error calculating statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Optional: Get recent transactions (for dashboard)
const getRecentTransactions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1, createdAt: -1 })
      .limit(limit);

    res.json({
      transactions,
      count: transactions.length
    });
  } catch (error) {
    console.error('Error in getRecentTransactions:', error);
    res.status(500).json({ 
      message: 'Server error fetching recent transactions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
  getRecentTransactions, 
};