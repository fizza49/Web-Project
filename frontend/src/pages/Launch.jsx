import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, PieChart, ArrowRight, Sparkles, Star, Zap, Rocket } from 'lucide-react';

const Launch = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Initialize particles with random positions
    const initialParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4
    }));
    setParticles(initialParticles);

    // Set visibility after a tiny delay to avoid synchronous state update
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: TrendingUp,
      title: 'Track Expenses',
      description: 'Monitor your spending habits and identify areas to save money with beautiful visualizations.',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-100',
      iconColor: 'text-green-500'
    },
    {
      icon: PieChart,
      title: 'Budget Planning',
      description: 'Create custom budgets for different categories and stay on track with smart alerts.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      iconColor: 'text-blue-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and never shared with third parties. Bank-level security.',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      iconColor: 'text-purple-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-75 group-hover:opacity-100"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-white to-gray-100 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-500">
                <span className="text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text font-bold text-3xl">E</span>
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-6 w-6 text-yellow-400 animate-ping" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 shadow-lg">
              <div className="flex items-center space-x-2 text-white/90">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-semibold">Trusted by 10,000+ Students</span>
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
            EduBudget
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-medium">
            Smart finance tracking for students. Take control of your money and build better financial habits with our intuitive platform.
          </p>
        </div>

        {/* Features - FIXED ICON RENDERING */}
        <div className={`grid md:grid-cols-3 gap-8 mb-20 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {features.map((feature, index) => {
            // Create the icon component properly
            const IconElement = feature.icon;
            
            return (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                {/* Background glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100 transform group-hover:scale-105`}></div>
                
                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl h-full">
                  {/* FIXED: Icon section with proper rendering */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <IconElement 
                      className={feature.iconColor} 
                      size={32} 
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Hover indicator */}
                  <div className={`absolute bottom-6 left-8 w-8 h-1 bg-gradient-to-r ${feature.color} rounded-full transform origin-left transition-all duration-300 ${hoveredFeature === index ? 'scale-x-100' : 'scale-x-0'}`}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className={`text-center transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative">
            {/* Background glow for CTA */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-50 transform -scale-95"></div>
            
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20 transform hover:shadow-3xl transition-all duration-500 max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <Rocket className="h-12 w-12 text-blue-600 animate-bounce" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-6">
                Ready to transform your finances?
              </h2>
              <p className="text-gray-600 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of students who are already managing their money smarter and building wealth with EduBudget.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <Link
                  to="/signup"
                  className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative">Get Started Free</span>
                  <ArrowRight size={24} className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-blue-600 border-2 border-blue-500 rounded-2xl hover:bg-blue-500 hover:bg-opacity-10 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Sign In
                  <Zap size={20} className="ml-2 group-hover:scale-110 transition-transform duration-300" />
                </Link>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-gray-500 font-medium">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Free forever for students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Setup in 2 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
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

export default Launch;