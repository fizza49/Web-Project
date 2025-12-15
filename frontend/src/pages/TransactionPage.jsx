import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Home, Zap, Utensils, Plus, ArrowLeft, TrendingUp, TrendingDown, Sparkles, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TransactionPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    totalIncome: 0,
    totalExpense: 0,
    expensePercentage: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const categoryIcons = {
    Salary: DollarSign,
    Groceries: ShoppingBag,
    Rent: Home,
    Transport: Zap,
    Food: Utensils,
    Entertainment: Utensils,
    Education: DollarSign,
    Healthcare: Plus,
    Other: DollarSign
  };

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/transactions', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        
        if (Array.isArray(data)) {
          setTransactions(data);
        } else if (data.transactions && Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
        } else {
          setTransactions([]);
        }
      } else if (response.status === 401) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/transactions/summary', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const groupTransactionsByMonth = () => {
    const grouped = {};
    if (!Array.isArray(transactions)) return grouped;
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(transaction);
    });
    return grouped;
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const groupedTransactions = groupTransactionsByMonth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="flex flex-col items-center space-y-4 relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <p className="text-gray-600 font-medium">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 relative z-10">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <button 
              onClick={() => navigate('/')}
              className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-gray-600 hover:text-primary"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center space-x-3">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
                Transactions
              </h1>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Balance Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 transform hover:scale-105 hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg">
                <DollarSign className="text-white" size={24} />
              </div>
              <TrendingUp className="text-primary" size={24} />
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Total Balance</p>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              {formatCurrency(summary.balance)}
            </h2>
          </div>

          {/* Total Income Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 transform hover:scale-105 hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="text-white" size={24} />
              </div>
              <Sparkles className="text-green-500" size={24} />
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Total Income</p>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {formatCurrency(summary.totalIncome)}
            </h2>
          </div>

          {/* Total Expense Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 transform hover:scale-105 hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingDown className="text-white" size={24} />
              </div>
              <Calendar className="text-red-500" size={24} />
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Total Expense</p>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              {formatCurrency(summary.totalExpense)}
            </h2>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
                <Zap size={20} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">All Transactions</h3>
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Calendar size={80} className="mx-auto mb-6 text-gray-300" />
              <p className="text-xl mb-3 font-semibold">No transactions yet</p>
              <p className="text-gray-400">Start by adding your first transaction</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedTransactions).map(([monthYear, monthTransactions]) => (
                <div key={monthYear} className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-gray-200">
                    <h4 className="text-xl font-bold text-gray-900">{monthYear}</h4>
                    <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-4 py-2 rounded-xl">
                      {formatCurrency(monthTransactions.reduce((sum, t) => sum + (t.type === 'expense' ? t.amount : 0), 0))} spent
                    </span>
                  </div>

                  <div className="space-y-3">
                    {monthTransactions.map((transaction, index) => {
                      const IconComponent = categoryIcons[transaction.category] || DollarSign;
                      const isExpense = transaction.type === 'expense';
                      
                      return (
                        <div 
                          key={transaction._id} 
                          className="flex items-center justify-between p-5 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/30 group"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 ${
                              isExpense 
                                ? 'bg-gradient-to-r from-red-100 to-pink-100' 
                                : 'bg-gradient-to-r from-green-100 to-emerald-100'
                            }`}>
                              <IconComponent className={`${isExpense ? 'text-red-600' : 'text-green-600'}`} size={24} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors duration-300">
                                {transaction.title || transaction.description}
                              </p>
                              <div className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
                                <span>{transaction.category}</span>
                                <span>•</span>
                                <span>{formatDate(transaction.date)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${isExpense ? 'text-red-600' : 'text-green-600'}`}>
                              {isExpense ? '-' : '+'}{formatCurrency(transaction.amount)}
                            </p>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                              {transaction.frequency || 'One-time'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;