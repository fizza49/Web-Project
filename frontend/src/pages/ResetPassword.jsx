import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle, ArrowLeft, Sparkles, Shield, Zap } from 'lucide-react';
import API from '../api';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState({ password: false, confirmPassword: false });
  const [particles, setParticles] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      navigate('/forgot-password');
    }

    const initialParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 1 + Math.random() * 2
    }));
    setParticles(initialParticles);
  }, [token, navigate]);

  useEffect(() => {
    const strength = calculatePasswordStrength(formData.password);
    setPasswordStrength(strength);
  }, [formData.password]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
    if (password.match(/\d/)) strength += 25;
    if (password.match(/[^a-zA-Z\d]/)) strength += 25;
    return strength;
  };

  const getStrengthColor = (strength) => {
    if (strength < 50) return 'from-red-500 to-red-600';
    if (strength < 75) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-emerald-600';
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (passwordStrength < 50) {
      setError('Please choose a stronger password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await API.post('/auth/reset-password', {
        token,
        password: formData.password,
      });
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
          <div className="bg-white/80 backdrop-blur-sm py-10 px-6 shadow-2xl sm:rounded-3xl sm:px-10 border border-white/20 transform transition-all duration-500 hover:shadow-3xl text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 mb-6 shadow-lg transform animate-scale-in">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <div className="mb-2 flex justify-center items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <h3 className="text-2xl font-bold text-gray-900">
                Password Reset Successful!
              </h3>
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            </div>
            
            <p className="text-gray-600 mb-8 text-lg">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-primary/20"
            >
              Sign In Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
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
          <div className="flex items-center justify-center mb-3">
            <Shield className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
              Set New Password
            </h2>
          </div>
          <p className="text-gray-600 text-lg font-medium">
            Create a strong new password for your account
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
              <label className="block text-gray-800 font-semibold text-lg uppercase tracking-wide">
                New Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFocus('password')}
                  onBlur={() => handleBlur('password')}
                  className="w-full px-12 py-5 text-lg rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-primary/20 focus:border-primary shadow-lg group-hover:shadow-xl focus:shadow-2xl outline-none transition-all duration-300"
                  placeholder="Enter your new password"
                />
                <Lock 
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                    isFocused.password || formData.password ? 'text-primary scale-110' : 'text-gray-400'
                  }`} 
                  size={24} 
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors duration-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>

              {formData.password && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-600">Password strength</span>
                    <span className={`${
                      passwordStrength < 50 ? 'text-red-600' :
                      passwordStrength < 75 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${getStrengthColor(passwordStrength)}`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="block text-gray-800 font-semibold text-lg uppercase tracking-wide">
                Confirm New Password
              </label>
              <div className="relative group">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => handleFocus('confirmPassword')}
                  onBlur={() => handleBlur('confirmPassword')}
                  className="w-full px-12 py-5 text-lg rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-primary/20 focus:border-primary shadow-lg group-hover:shadow-xl focus:shadow-2xl outline-none transition-all duration-300"
                  placeholder="Confirm your new password"
                />
                <Lock 
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                    isFocused.confirmPassword || formData.confirmPassword ? 'text-primary scale-110' : 'text-gray-400'
                  }`} 
                  size={24} 
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors duration-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>

              {formData.confirmPassword && (
                <div className={`flex items-center space-x-2 text-sm font-medium ${
                  formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <CheckCircle size={16} />
                      <span>Passwords match</span>
                    </>
                  ) : (
                    <>
                      <EyeOff size={16} />
                      <span>Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || !formData.password || !formData.confirmPassword}
                className="w-full flex justify-center items-center space-x-3 bg-gradient-to-r from-primary to-primary-dark text-white py-5 px-6 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    <span>Reset Password</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-4">
              <Link
                to="/login"
                className="inline-flex items-center text-primary hover:text-primary-dark font-semibold transition-all duration-300 group"
              >
                <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>

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

export default ResetPassword;