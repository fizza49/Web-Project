import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, UserPlus, Mail, User, Lock, Sparkles, ArrowLeft, Zap, CheckCircle } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isFocused, setIsFocused] = useState({ name: false, email: false, password: false, confirmPassword: false });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const { register, user, error, setError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
    setError('');

    // Initialize particles
    const initialParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3
    }));
    setParticles(initialParticles);
  }, [user, navigate, setError]);

  useEffect(() => {
    // Calculate password strength
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

    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      if (formData.password !== formData.confirmPassword) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
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
      setPasswordError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    if (passwordStrength < 50) {
      setPasswordError('Please choose a stronger password');
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
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

      <div className="max-w-md w-full mx-auto relative z-10">
        {/* Back Button */}
        <Link 
          to="/" 
          className="group inline-flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-all duration-300 transform hover:-translate-x-1"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-lg font-medium">Back to Home</span>
        </Link>

        {/* Signup Card */}
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
              <UserPlus className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
                Create Account
              </h2>
            </div>
            <p className="text-gray-600 text-xl font-medium">
              Join thousands of students managing their finances
            </p>
          </div>

          {/* Error Message */}
          {(error || passwordError) && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-2xl mb-8 shadow-lg transform animate-shake">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold">{error || passwordError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Field */}
            <div className="space-y-4">
              <label className="block text-gray-800 font-semibold text-lg uppercase tracking-wide">
                Full Name
              </label>
              <div className="relative group">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus('name')}
                  onBlur={() => handleBlur('name')}
                  className="w-full px-12 py-5 text-lg rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-primary/20 focus:border-primary shadow-lg group-hover:shadow-xl focus:shadow-2xl outline-none transition-all duration-300"
                  placeholder="Enter your full name"
                />
                <User 
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                    isFocused.name || formData.name ? 'text-primary scale-110' : 'text-gray-400'
                  }`} 
                  size={24} 
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-4">
              <label className="block text-gray-800 font-semibold text-lg uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative group">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                  className="w-full px-12 py-5 text-lg rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-primary/20 focus:border-primary shadow-lg group-hover:shadow-xl focus:shadow-2xl outline-none transition-all duration-300"
                  placeholder="Enter your email address"
                />
                <Mail 
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                    isFocused.email || formData.email ? 'text-primary scale-110' : 'text-gray-400'
                  }`} 
                  size={24} 
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-4">
              <label className="block text-gray-800 font-semibold text-lg uppercase tracking-wide">
                Password
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
                  placeholder="Create a strong password"
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

              {/* Password Strength Meter */}
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

            {/* Confirm Password Field */}
            <div className="space-y-4">
              <label className="block text-gray-800 font-semibold text-lg uppercase tracking-wide">
                Confirm Password
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
                  placeholder="Confirm your password"
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

              {/* Password Match Indicator */}
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

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-2xl border border-blue-200">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded mt-1 transform hover:scale-110 transition-transform duration-300"
              />
              <label htmlFor="terms" className="text-sm text-gray-700 font-medium">
                I agree to the{' '}
                <Link to="/terms" className="text-primary hover:text-primary-dark font-semibold transition-colors duration-300">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary hover:text-primary-dark font-semibold transition-colors duration-300">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center space-x-3 bg-gradient-to-r from-primary to-primary-dark text-white py-5 px-6 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center mt-10 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-lg font-medium">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-primary hover:text-primary-dark font-semibold transition-all duration-300 group"
              >
                Sign In
                <Zap size={16} className="ml-1 inline group-hover:scale-110 transition-transform duration-300" />
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

export default Signup;