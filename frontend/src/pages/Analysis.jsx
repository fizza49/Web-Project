import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, DollarSign, Calendar, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Analysis = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('daily');
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [summary, setSummary] = useState({
    totalBalance: 0,
    availableBalance: 0,
    totalExpense: 0
  });

  useEffect(() => {
    fetchAnalysisData(activeTab);
  }, [activeTab]);

  const fetchAnalysisData = async (period) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/transactions/analysis?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setChartData(data.chartData);
        setSummary(data.summary);
      } else if (response.status === 401) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching analysis data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-800 to-teal-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header Section */}
        <div className={`text-center mb-12 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/10 p-3 rounded-full transition-all"
            >
              <ArrowLeft size={24} />
            </button>
            
            <div className="relative group flex-1">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-75"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20 shadow-lg inline-block">
                <div className="flex items-center space-x-3">
                  <Sparkles className="h-6 w-6 text-emerald-400" />
                  <h1 className="text-4xl font-bold text-white">Analysis</h1>
                  <Sparkles className="h-6 w-6 text-teal-400" />
                </div>
              </div>
            </div>
            
            <div className="w-12"></div>
          </div>
        </div>

        {/* Balance Cards */}
        <div className={`grid md:grid-cols-3 gap-6 mb-12 transition-all duration-1000 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Total Balance Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-75"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 transform transition-all duration-500 group-hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-r from-emerald-100 to-green-200 rounded-2xl flex items-center justify-center shadow-lg">
                  <Wallet className="text-emerald-600" size={28} strokeWidth={2} />
                </div>
                <TrendingUp className="text-emerald-500" size={24} />
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Total Balance</p>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                PKR {summary.totalBalance.toFixed(2)}
              </h2>
            </div>
          </div>

          {/* Available Balance Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-75"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 transform transition-all duration-500 group-hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-100 to-cyan-200 rounded-2xl flex items-center justify-center shadow-lg">
                  <DollarSign className="text-blue-600" size={28} strokeWidth={2} />
                </div>
                <TrendingUp className="text-blue-500" size={24} />
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Available Balance</p>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                PKR {summary.availableBalance.toFixed(2)}
              </h2>
            </div>
          </div>

          {/* Total Expense Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-75"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 transform transition-all duration-500 group-hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-r from-rose-100 to-pink-200 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingDown className="text-rose-600" size={28} strokeWidth={2} />
                </div>
                <Calendar className="text-rose-500" size={24} />
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Total Expense</p>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                PKR {summary.totalExpense.toFixed(2)}
              </h2>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className={`transition-all duration-1000 delay-400 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl blur-2xl opacity-30"></div>
            
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              {/* Tab Navigation */}
              <div className="flex justify-center mb-8">
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-2 shadow-inner">
                  <div className="flex space-x-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg scale-105'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart Title */}
              <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-gray-900 to-emerald-600 bg-clip-text text-transparent">
                Income & Expenses - {tabs.find(t => t.id === activeTab)?.label}
              </h3>

              {/* Loading or Chart */}
              {loading ? (
                <div className="flex justify-center items-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                </div>
              ) : chartData.length === 0 ? (
                <div className="flex justify-center items-center h-96">
                  <p className="text-gray-400 text-xl">No data available</p>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-2xl p-6 shadow-inner">
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#6b7280"
                          style={{ fontSize: '14px', fontWeight: '600' }}
                        />
                        <YAxis 
                          stroke="#6b7280"
                          style={{ fontSize: '14px', fontWeight: '600' }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                            padding: '12px'
                          }}
                          labelStyle={{ fontWeight: 'bold', marginBottom: '8px' }}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: '20px' }}
                          iconType="circle"
                        />
                        <Bar 
                          dataKey="income" 
                          fill="#10b981" 
                          radius={[8, 8, 0, 0]}
                          name="Income"
                        />
                        <Bar 
                          dataKey="expense" 
                          fill="#f43f5e" 
                          radius={[8, 8, 0, 0]}
                          name="Expense"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Chart Legend Custom */}
                  <div className="flex justify-center items-center space-x-8 mt-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-lg"></div>
                      <span className="text-gray-700 font-semibold">Income</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-rose-500 rounded-full shadow-lg"></div>
                      <span className="text-gray-700 font-semibold">Expense</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Analysis;