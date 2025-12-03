import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Sparkles, MoreVertical, Download, Filter, RefreshCw } from 'lucide-react';

const ChartBox = ({ 
  title, 
  children, 
  className = '', 
  icon = BarChart3,
  onRefresh,
  onDownload,
  onFilter,
  isLoading = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const getIconComponent = () => {
    const IconComponent = icon;
    return <IconComponent size={20} className="text-primary" />;
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
    setShowMenu(false);
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    }
    setShowMenu(false);
  };

  const handleFilter = () => {
    if (onFilter) {
      onFilter();
    }
    setShowMenu(false);
  };

  return (
    <div 
      className={`relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/20 transform transition-all duration-500 hover:shadow-3xl ${
        isHovered ? 'scale-105 -translate-y-1' : ''
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background glow effect on hover */}
      <div className={`absolute inset-0 bg-gradient-to-r from-primary/5 to-primary-dark/5 rounded-3xl transition-all duration-500 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-primary/10 to-primary-dark/10 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110">
            {getIconComponent()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <span>{title}</span>
              {isHovered && <Sparkles size={16} className="text-primary animate-pulse" />}
            </h3>
            <p className="text-gray-600 text-sm font-medium mt-1">
              Interactive chart visualization
            </p>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-primary hover:bg-white/50 rounded-2xl transition-all duration-300 transform hover:scale-110"
          >
            <MoreVertical size={20} />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 py-2 z-20 min-w-48 animate-scale-in">
              <button
                onClick={handleRefresh}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                disabled={isLoading}
              >
                <RefreshCw size={18} className={`${isLoading ? 'animate-spin' : 'group-hover:scale-110'} transition-transform duration-300`} />
                <span className="font-medium">{isLoading ? 'Refreshing...' : 'Refresh Data'}</span>
              </button>
              
              <button
                onClick={handleDownload}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
              >
                <Download size={18} className="group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">Export Data</span>
              </button>
              
              <button
                onClick={handleFilter}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
              >
                <Filter size={18} className="group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">Filter Data</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chart Content */}
      <div className="relative z-10">
        {isLoading ? (
          <div className="w-full h-64 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-gray-600 font-medium">Loading chart data...</p>
            </div>
          </div>
        ) : (
          <div className="w-full transform transition-all duration-300 hover:scale-105">
            {children}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200/50 relative z-10">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="font-medium">Real-time Data</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp size={14} className="text-green-500" />
              <span className="font-medium">Live Updates</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 font-medium">
            Updated just now
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className={`absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full transition-all duration-500 ${
        isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
      }`}></div>
      <div className={`absolute -bottom-2 -left-2 w-4 h-4 bg-primary-dark rounded-full transition-all duration-500 delay-100 ${
        isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
      }`}></div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ChartBox;