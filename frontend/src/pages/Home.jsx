import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Plus,
  Calendar,
  Sparkles,
  Target,
  BarChart3,
  Wallet,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { transactionsAPI, budgetsAPI } from '../api';
import StatCard from '../components/StatCard';
import ChartBox from '../components/ChartBox';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    categoryStats: {},
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, transactionsData, budgetsData] = await Promise.all([
        transactionsAPI.getStats(),
        transactionsAPI.getAll(1, 5),
        budgetsAPI.getAll(),
      ]);

      setStats(statsData);
      setRecentTransactions(transactionsData.transactions);
      setBudgets(budgetsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const expenseChartData = {
    labels: Object.keys(stats.categoryStats).filter(
      category => stats.categoryStats[category].expense > 0
    ),
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.keys(stats.categoryStats)
          .filter(category => stats.categoryStats[category].expense > 0)
          .map(category => stats.categoryStats[category].expense),
        backgroundColor: [
          '#00D09E',
          '#3B82F6',
          '#EF4444',
          '#F59E0B',
          '#8B5CF6',
          '#EC4899',
          '#10B981',
          '#F97316',
        ],
        borderWidth: 0,
        borderRadius: 8,
      },
    ],
  };

  const monthlyChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Income',
        data: [1200, 1900, 1500, 1800],
        backgroundColor: '#00D09E',
        borderColor: '#00D09E',
        borderWidth: 2,
        borderRadius: 12,
        borderSkipped: false,
      },
      {
        label: 'Expenses',
        data: [800, 1200, 900, 1100],
        backgroundColor: '#EF4444',
        borderColor: '#EF4444',
        borderWidth: 2,
        borderRadius: 12,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '600',
          }
        },
      },
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            weight: '600',
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
        ticks: {
          font: {
            size: 11,
            weight: '600',
          },
          callback: function(value) {
            return '$' + value;
          }
        }
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 11,
            weight: '600',
          }
        },
      },
    },
    maintainAspectRatio: false,
    cutout: '65%',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="flex flex-col items-center space-y-4 relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <p className="text-gray-600 font-medium">Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* CHANGED LINE: Removed ml-64, kept pt-16 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-3">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
              Welcome back, {user?.name}!
            </h1>
          </div>
          <p className="text-gray-600 text-lg font-medium">
            Here's your financial overview for this month.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            className="transform hover:scale-105 transition-all duration-300"
            onMouseEnter={() => setHoveredCard('balance')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <StatCard
              title="Total Balance"
              value={`$${stats.balance.toFixed(2)}`}
              subtitle="Current available balance"
              icon={Wallet}
              color="primary"
              animated={hoveredCard === 'balance'}
            />
          </div>
          <div 
            className="transform hover:scale-105 transition-all duration-300"
            onMouseEnter={() => setHoveredCard('income')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <StatCard
              title="Total Income"
              value={`$${stats.totalIncome.toFixed(2)}`}
              subtitle="This month"
              icon={TrendingUp}
              color="green"
              animated={hoveredCard === 'income'}
            />
          </div>
          <div 
            className="transform hover:scale-105 transition-all duration-300"
            onMouseEnter={() => setHoveredCard('expenses')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <StatCard
              title="Total Expenses"
              value={`$${stats.totalExpenses.toFixed(2)}`}
              subtitle="This month"
              icon={TrendingDown}
              color="red"
              animated={hoveredCard === 'expenses'}
            />
          </div>
          <div 
            className="transform hover:scale-105 transition-all duration-300"
            onMouseEnter={() => setHoveredCard('budgets')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <StatCard
              title="Budget Status"
              value={`${budgets.length} Categories`}
              subtitle="Active budgets"
              icon={Target}
              color="blue"
              animated={hoveredCard === 'budgets'}
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="transform hover:scale-[1.02] transition-all duration-500">
            <ChartBox 
              title="Income vs Expenses - This Month" 
              className="h-80"
              icon={BarChart3}
            >
              <Bar data={monthlyChartData} options={chartOptions} />
            </ChartBox>
          </div>
          <div className="transform hover:scale-[1.02] transition-all duration-500">
            <ChartBox 
              title="Expenses by Category" 
              className="h-80"
              icon={PieChart}
            >
              <Doughnut data={expenseChartData} options={doughnutOptions} />
            </ChartBox>
          </div>
        </div>

        {/* Recent Transactions & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 transform hover:shadow-3xl transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
                    <Zap size={20} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Recent Transactions
                  </h3>
                </div>
                <Link
                  to="/transactions"
                  className="flex items-center space-x-2 text-primary hover:text-primary-dark font-semibold transition-all duration-300 group"
                >
                  <span>View all</span>
                  <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentTransactions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar size={64} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-3">No transactions yet</p>
                    <Link
                      to="/transactions"
                      className="inline-flex items-center space-x-2 text-primary hover:text-primary-dark font-semibold transition-all duration-300 group"
                    >
                      <span>Add your first transaction</span>
                      <Plus size={16} className="group-hover:scale-110 transition-transform duration-300" />
                    </Link>
                  </div>
                ) : (
                  recentTransactions.map((transaction, index) => (
                    <div
                      key={transaction._id}
                      className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/30 group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 ${
                            transaction.type === 'income'
                              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-600'
                              : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-600'
                          }`}
                        >
                          {transaction.type === 'income' ? (
                            <TrendingUp size={24} />
                          ) : (
                            <TrendingDown size={24} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-gray-500 font-medium">
                            {transaction.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${
                            transaction.type === 'income'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}$
                          {transaction.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 font-medium">
                          {new Date(transaction.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Budget Progress */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 transform hover:shadow-3xl transition-all duration-500">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles size={20} className="text-white" />
                </div>
                <span>Quick Actions</span>
              </h3>
              <div className="space-y-4">
                <Link
                  to="/transactions?action=add"
                  className="flex items-center space-x-4 p-5 bg-gradient-to-r from-primary/10 to-primary-dark/10 text-primary rounded-2xl hover:from-primary/20 hover:to-primary-dark/20 transition-all duration-300 transform hover:scale-105 group border border-primary/20"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Plus size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">Add Transaction</p>
                    <p className="text-sm opacity-80 font-medium">
                      Record income or expense
                    </p>
                  </div>
                  <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </Link>

                <Link
                  to="/budgets"
                  className="flex items-center space-x-4 p-5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105 group border border-blue-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <PieChart size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">Manage Budgets</p>
                    <p className="text-sm opacity-80 font-medium">
                      Set spending limits
                    </p>
                  </div>
                  <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </Link>

                <Link
                  to="/transactions"
                  className="flex items-center space-x-4 p-5 bg-gradient-to-r from-green-50 to-emerald-100 text-green-600 rounded-2xl hover:from-green-100 hover:to-emerald-200 transition-all duration-300 transform hover:scale-105 group border border-green-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">View Reports</p>
                    <p className="text-sm opacity-80 font-medium">
                      Analyze your spending
                    </p>
                  </div>
                  <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </Link>
              </div>
            </div>

            {/* Budget Progress */}
            {budgets.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 transform hover:shadow-3xl transition-all duration-500">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Target size={20} className="text-white" />
                  </div>
                  <span>Budget Progress</span>
                </h3>
                <div className="space-y-5">
                  {budgets.slice(0, 3).map((budget, index) => {
                    const categoryExpense =
                      stats.categoryStats[budget.category]?.expense || 0;
                    const percentage = Math.min(
                      (categoryExpense / budget.amount) * 100,
                      100
                    );

                    return (
                      <div 
                        key={budget._id}
                        className="transform hover:scale-105 transition-all duration-300"
                        style={{ animationDelay: `${index * 200}ms` }}
                      >
                        <div className="flex justify-between text-sm mb-2 font-semibold">
                          <span className="text-gray-900">{budget.category}</span>
                          <span className="text-gray-600">
                            ${categoryExpense.toFixed(2)} / ${budget.amount.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ease-out shadow-lg ${
                              percentage > 90
                                ? 'bg-gradient-to-r from-red-500 to-red-600'
                                : percentage > 75
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                                : 'bg-gradient-to-r from-primary to-primary-dark'
                            }`}
                            style={{ 
                              width: `${percentage}%`,
                              animation: 'growWidth 1s ease-out'
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-gray-500 font-medium">Progress</span>
                          <span className={`font-bold ${
                            percentage > 90 ? 'text-red-600' : 
                            percentage > 75 ? 'text-yellow-600' : 'text-primary'
                          }`}>
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add these styles to your CSS */}
      <style jsx>{`
        @keyframes growWidth {
          from { width: 0%; }
          to { width: var(--target-width); }
        }
        .animate-in {
          animation: fadeInUp 0.6s ease-out;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;