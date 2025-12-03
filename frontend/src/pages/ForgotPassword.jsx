import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Send, Sparkles } from 'lucide-react';
import API from '../api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();

  // Particle animation for background
  useEffect(() => {
    if (success) {
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 1 + Math.random() * 2
      }));
      setParticles(newParticles);
    }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await API.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <Link 
            to="/" 
            className="flex justify-center transform hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
                EduBudget
              </span>
            </div>
          </Link>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-white/80 backdrop-blur-sm py-10 px-6 shadow-2xl sm:rounded-3xl sm:px-10 border border-white/20 transform transition-all duration-500 hover:shadow-3xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 mb-6 shadow-lg transform animate-scale-in">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <div className="mb-2 flex justify-center items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Check your email!
                </h3>
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              </div>
              
              <p className="text-gray-600 mb-8 text-lg">
                We've sent a password reset link to <br />
                <strong className="text-primary font-semibold">{email}</strong>
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-primary/20"
                >
                  Back to Login
                </button>
                
                <p className="text-sm text-gray-500 pt-4">
                  Didn't receive the email?{' '}
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-primary hover:text-primary-dark font-semibold transition-all duration-300 hover:underline"
                  >
                    Try again
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link 
          to="/" 
          className="flex justify-center transform hover:scale-105 transition-transform duration-300 mb-2"
        >
          <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
              EduBudget
            </span>
          </div>
        </Link>
        
        <div className="text-center mt-8 bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent mb-3">
            Reset Password
          </h2>
          <p className="text-gray-600 text-lg font-medium">
            Enter your email and we'll send you a reset link
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-sm py-10 px-6 shadow-2xl sm:rounded-3xl sm:px-10 border border-white/20 transform transition-all duration-500 hover:shadow-3xl">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded-xl shadow-lg transform animate-shake">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">!</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative group">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full px-12 py-4 text-lg border-2 border-gray-200 rounded-2xl bg-white/80 backdrop-blur-sm transition-all duration-300 focus:ring-4 focus:ring-primary/20 focus:border-primary shadow-lg group-hover:shadow-xl focus:shadow-2xl outline-none"
                  placeholder="Enter your email address"
                />
                <Mail 
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                    isFocused || email ? 'text-primary scale-110' : 'text-gray-400'
                  }`} 
                  size={24} 
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {email && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Link
                to="/login"
                className="flex items-center text-sm font-semibold text-primary hover:text-primary-dark transition-all duration-300 transform hover:translate-x-1 group"
              >
                <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to login
              </Link>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full flex justify-center items-center space-x-3 bg-gradient-to-r from-primary to-primary-dark text-white py-5 px-6 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add these styles to your CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes scale-in {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;