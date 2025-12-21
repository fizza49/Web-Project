import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  X,
  User,
  LogOut,
  Bell,
  Settings,
  Sparkles,
  Zap,
  Home,
  CreditCard,
  PieChart,
  MessageSquare,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      current: location.pathname === "/",
      icon: Home,
    },
    {
      name: "Transactions",
      href: "/transactions",
      current: location.pathname === "/transactions",
      icon: CreditCard,
    },
    {
      name: "Budgets",
      href: "/budgets",
      current: location.pathname === "/budgets",
      icon: PieChart,
    },
    {
      name: "Notifications",
      href: "/notifications",
      current: location.pathname === "/notifications",
      icon: MessageSquare,
    },
  ];

  const handleLogout = () => {
    logout();
  };

  const getNavIcon = (iconComponent) => {
    const Icon = iconComponent;
    return <Icon size={18} />;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-sm shadow-2xl border-b border-white/20"
          : "bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-3 group"
              onMouseEnter={() => setActiveHover("logo")}
              onMouseLeave={() => setActiveHover(null)}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark rounded-2xl blur-md group-hover:blur-lg transition-all duration-500 opacity-75 group-hover:opacity-100"></div>
                <div className="relative w-10 h-10 bg-gradient-to-r from-white to-gray-100 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-500">
                  <span className="text-transparent bg-gradient-to-r from-primary to-primary-dark bg-clip-text font-bold text-xl">
                    E
                  </span>
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
                EduBudget
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onMouseEnter={() => setActiveHover(item.name)}
                onMouseLeave={() => setActiveHover(null)}
                className={`relative px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 group ${
                  item.current
                    ? "text-primary bg-gradient-to-r from-primary/10 to-primary-dark/10 shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={`transition-all duration-300 ${
                      item.current ? "scale-110" : "group-hover:scale-110"
                    }`}
                  >
                    {getNavIcon(item.icon)}
                  </div>
                  <span>{item.name}</span>
                </div>

                {/* Active indicator */}
                {item.current && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-primary to-primary-dark rounded-full"></div>
                )}

                {/* Hover effect */}
                {activeHover === item.name && !item.current && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary-dark/5 rounded-2xl animate-pulse"></div>
                )}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Notifications */}
            <button
              className="relative p-3 text-gray-400 hover:text-primary bg-white/50 rounded-2xl hover:bg-white/80 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group"
              onMouseEnter={() => setActiveHover("notifications")}
              onMouseLeave={() => setActiveHover(null)}
            >
              <Bell
                size={20}
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
            </button>

            {/* User Profile */}
            <div
              className="flex items-center space-x-3 bg-white/50 rounded-2xl px-4 py-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group cursor-pointer"
              onMouseEnter={() => setActiveHover("profile")}
              onMouseLeave={() => setActiveHover(null)}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <User size={16} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">
                  {user?.name}
                </span>
                <span className="text-xs text-gray-500">Student</span>
              </div>
            </div>

            {/* Settings */}
            <Link
              to="/settings"
              className="p-3 text-gray-400 hover:text-primary bg-white/50 rounded-2xl hover:bg-white/80 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group"
            >
              <Settings
                size={20}
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-3 text-gray-400 hover:text-red-500 bg-white/50 rounded-2xl hover:bg-red-50 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group"
              onMouseEnter={() => setActiveHover("logout")}
              onMouseLeave={() => setActiveHover(null)}
              title="Logout"
            >
              <LogOut
                size={20}
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded-2xl text-gray-400 hover:text-primary hover:bg-white/50 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-scale-in">
            <div className="px-2 pt-2 pb-4 space-y-2 sm:px-3 bg-white/80 backdrop-blur-sm border-t border-white/20 rounded-b-3xl shadow-2xl">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-base font-semibold transition-all duration-300 transform hover:scale-105 group ${
                    item.current
                      ? "text-primary bg-gradient-to-r from-primary/10 to-primary-dark/10 shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <div
                    className={`transition-all duration-300 ${
                      item.current ? "scale-110" : "group-hover:scale-110"
                    }`}
                  >
                    {getNavIcon(item.icon)}
                  </div>
                  <span>{item.name}</span>
                </Link>
              ))}

              {/* Mobile User Section */}
              <div className="pt-4 border-t border-gray-200/50 space-y-2">
                <div className="flex items-center space-x-3 px-4 py-3 text-gray-600 bg-white/50 rounded-2xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
                    <User size={20} className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">
                      {user?.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      Student Account
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-base font-semibold text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 transform hover:scale-105 group"
                >
                  <LogOut
                    size={20}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
