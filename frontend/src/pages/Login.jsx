import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, Sparkles, Zap } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [particles, setParticles] = useState([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize particles asynchronously to prevent synchronous state update
    const timer = setTimeout(() => {
      const initialParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 3
      }));
      setParticles(initialParticles);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/home');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Floating particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Back Button */}
        <Link 
          to="/" 
          className="group inline-flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-all duration-300 transform hover:-translate-x-1"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-lg font-medium">Back to Home</span>
        </Link>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-white/20 transform transition-all duration-500 hover:shadow-3xl">
          {/* Logo */}
          <div className="flex items-center justify-center mb-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-75 group-hover:opacity-100"></div>
              <div className="relative w-16 h-16 bg-gradient-to-r from-white to-gray-100 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-500">
                <span className="text-transparent bg-gradient-to-r from-primary to-primary-dark bg-clip-text font-bold text-2xl">E</span>
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              </div>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent ml-4">
              EduBudget
            </span>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-3">
              <Zap className="h-6 w-6 text-primary mr-2 animate-pulse" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
                Welcome Back
              </h2>
            </div>
            <p className="text-gray-600 text-xl font-medium">
              Sign in to your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-2xl mb-8 shadow-lg transform animate-shake">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Field */}
            <div className="space-y-4">
              <label className="block text-gray-800 font-semibold text-lg uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                  required
                  className="w-full px-12 py-5 text-lg rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-primary/20 focus:border-primary shadow-lg group-hover:shadow-xl focus:shadow-2xl outline-none transition-all duration-300"
                  placeholder="Enter your email"
                />
                <Mail 
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                    isFocused.email || formData.email ? 'text-primary scale-110' : 'text-gray-400'
                  }`} 
                  size={24} 
                />
                {formData.email && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-4">
              <label className="block text-gray-800 font-semibold text-lg uppercase tracking-wide">
                Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFocus('password')}
                  onBlur={() => handleBlur('password')}
                  required
                  className="w-full px-12 py-5 text-lg rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-primary/20 focus:border-primary shadow-lg group-hover:shadow-xl focus:shadow-2xl outline-none transition-all duration-300"
                  placeholder="Enter your password"
                />
                <Lock 
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                    isFocused.password || formData.password ? 'text-primary scale-110' : 'text-gray-400'
                  }`} 
                  size={24} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors duration-300"
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link 
                to="/forgot-password" 
                className="inline-flex items-center text-primary hover:text-primary-dark font-semibold transition-all duration-300 group"
              >
                Forgot your password?
                <ArrowLeft size={16} className="ml-1 transform rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center space-x-3 bg-gradient-to-r from-primary to-primary-dark text-white py-5 px-6 rounded-2xl font-semibold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-10 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-lg font-medium">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-primary hover:text-primary-dark font-semibold transition-all duration-300 group"
              >
                Sign Up
                <ArrowLeft size={16} className="ml-1 transform rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
