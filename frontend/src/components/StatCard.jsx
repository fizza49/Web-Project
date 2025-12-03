import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Sparkles, Zap } from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color = 'primary',
  animated = false,
  onClick 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const colorConfig = {
    primary: {
      bg: 'from-primary/10 to-primary-dark/10',
      iconBg: 'from-primary to-primary-dark',
      text: 'text-primary',
      trend: 'from-primary to-primary-dark'
    },
    green: {
      bg: 'from-green-50 to-emerald-100',
      iconBg: 'from-green-500 to-emerald-600',
      text: 'text-green-600',
      trend: 'from-green-500 to-emerald-600'
    },
    red: {
      bg: 'from-red-50 to-pink-100',
      iconBg: 'from-red-500 to-pink-600',
      text: 'text-red-600',
      trend: 'from-red-500 to-pink-600'
    },
    blue: {
      bg: 'from-blue-50 to-indigo-100',
      iconBg: 'from-blue-500 to-indigo-600',
      text: 'text-blue-600',
      trend: 'from-blue-500 to-indigo-600'
    },
    yellow: {
      bg: 'from-yellow-50 to-amber-100',
      iconBg: 'from-yellow-500 to-amber-600',
      text: 'text-yellow-600',
      trend: 'from-yellow-500 to-amber-600'
    },
  };

  const config = colorConfig[color];

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  return (
    <div 
      className={`relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/20 transform transition-all duration-500 ${
        isHovered ? 'shadow-3xl -translate-y-2 scale-105' : ''
      } ${isPressed ? 'scale-95' : ''} ${onClick ? 'cursor-pointer' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={onClick}
    >
      {/* Background glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.bg} rounded-3xl transition-all duration-500 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}></div>

      {/* Animated sparkles */}
      {animated && isHovered && (
        <>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="h-4 w-4 text-primary animate-ping" />
          </div>
          <div className="absolute -bottom-1 -left-1">
            <Sparkles className="h-3 w-3 text-primary-dark animate-pulse" />
          </div>
        </>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 transition-colors duration-300">
              {title}
            </p>
            
            {/* Value */}
            <div className="flex items-baseline space-x-2 mb-2">
              <p className="text-3xl font-bold text-gray-900 truncate transition-colors duration-300">
                {value}
              </p>
              {animated && isHovered && (
                <Zap className="h-5 w-5 text-primary animate-bounce" />
              )}
            </div>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-sm text-gray-500 font-medium mb-3 transition-colors duration-300">
                {subtitle}
              </p>
            )}

            {/* Trend */}
            {trend && (
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-gradient-to-r ${config.trend} text-white text-xs font-semibold shadow-lg transition-all duration-300 ${
                isHovered ? 'scale-105' : ''
              }`}>
                {trend.direction === 'up' ? (
                  <TrendingUp size={14} className="text-white" />
                ) : (
                  <TrendingDown size={14} className="text-white" />
                )}
                <span>{trend.value}</span>
                <span className="opacity-90">
                  {trend.direction === 'up' ? 'increase' : 'decrease'}
                </span>
              </div>
            )}
          </div>

          {/* Icon */}
          {Icon && (
            <div className="relative ml-4">
              {/* Icon background glow */}
              <div className={`absolute inset-0 bg-gradient-to-r ${config.iconBg} rounded-2xl blur-md transition-all duration-500 ${
                isHovered ? 'opacity-75 scale-110' : 'opacity-0 scale-100'
              }`}></div>
              
              {/* Icon container */}
              <div className={`relative w-14 h-14 bg-gradient-to-r ${config.iconBg} rounded-2xl flex items-center justify-center shadow-2xl transform transition-all duration-500 ${
                isHovered ? 'scale-110 rotate-6' : ''
              }`}>
                <Icon size={28} className="text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Progress bar for animated cards */}
        {animated && (
          <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5 shadow-inner overflow-hidden">
            <div 
              className={`h-1.5 rounded-full bg-gradient-to-r ${config.trend} transition-all duration-1000 ease-out ${
                isHovered ? 'w-full' : 'w-3/4'
              }`}
              style={{
                animation: isHovered ? 'pulse 2s ease-in-out infinite' : 'none'
              }}
            ></div>
          </div>
        )}
      </div>

      {/* Floating particles on hover */}
      {isHovered && (
        <>
          <div className="absolute top-2 right-6 w-1 h-1 bg-current rounded-full opacity-60 animate-float" 
               style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute top-4 right-4 w-1 h-1 bg-current rounded-full opacity-40 animate-float" 
               style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}></div>
          <div className="absolute top-6 right-8 w-1 h-1 bg-current rounded-full opacity-30 animate-float" 
               style={{ animationDelay: '1s', animationDuration: '2s' }}></div>
        </>
      )}

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(180deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default StatCard;