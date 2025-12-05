import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, AlertCircle, Info, CheckCircle, XCircle, Sparkles, Filter, Search, Zap } from 'lucide-react';
import { notificationsAPI } from '../api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [hoveredNotification, setHoveredNotification] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsAPI.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(notifications.map(notification =>
        notification._id === id ? { ...notification, isRead: true } : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
      setSelectedNotifications(new Set());
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationsAPI.delete(id);
      setNotifications(notifications.filter(notification => notification._id !== id));
      setSelectedNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const deleteSelected = async () => {
    try {
      for (const id of selectedNotifications) {
        await notificationsAPI.delete(id);
      }
      setNotifications(notifications.filter(notification => !selectedNotifications.has(notification._id)));
      setSelectedNotifications(new Set());
    } catch (error) {
      console.error('Error deleting selected notifications:', error);
    }
  };

  const toggleSelect = (id) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={24} className="text-green-500" />;
      case 'warning':
        return <AlertCircle size={24} className="text-yellow-500" />;
      case 'error':
        return <XCircle size={24} className="text-red-500" />;
      case 'info':
        return <Info size={24} className="text-blue-500" />;
      default:
        return <Info size={24} className="text-blue-500" />;
    }
  };

  const getNotificationGradient = (type) => {
    switch (type) {
      case 'success':
        return 'from-green-500 to-emerald-600';
      case 'warning':
        return 'from-yellow-500 to-orange-600';
      case 'error':
        return 'from-red-500 to-pink-600';
      case 'info':
        return 'from-blue-500 to-purple-600';
      default:
        return 'from-blue-500 to-purple-600';
    }
  };

  const getNotificationBg = (type) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-50 to-emerald-100';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-50 to-orange-100';
      case 'error':
        return 'bg-gradient-to-r from-red-50 to-pink-100';
      case 'info':
        return 'bg-gradient-to-r from-blue-50 to-purple-100';
      default:
        return 'bg-gradient-to-r from-blue-50 to-purple-100';
    }
  };

  // Filter notifications based on search and filter
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || notification.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="flex flex-col items-center space-y-4 relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <p className="text-gray-600 font-medium">Loading your notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10">
        {/* Header - FIXED */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-75 group-hover:opacity-100"></div>
                <div className="relative w-14 h-14 bg-gradient-to-r from-white to-gray-100 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-500">
                  {/* FIXED: Removed text-transparent and bg-clip-text */}
                  <Bell size={28} className="text-primary" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
                  Notifications
                </h1>
                <p className="text-gray-600 mt-2 text-lg font-medium">
                  Stay updated with your account activity
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {selectedNotifications.size > 0 && (
                <button
                  onClick={deleteSelected}
                  className="group relative flex items-center space-x-3 px-6 py-3 text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <Trash2 size={20} className="relative" />
                  <span className="relative font-semibold">
                    Delete Selected ({selectedNotifications.size})
                  </span>
                </button>
              )}
              {notifications.some(n => !n.isRead) && (
                <button
                  onClick={markAllAsRead}
                  className="group relative flex items-center space-x-3 px-6 py-3 text-white bg-gradient-to-r from-primary to-primary-dark rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <Check size={20} className="relative" />
                  <span className="relative font-semibold">Mark All as Read</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/20 mb-8 transform transition-all duration-500 hover:shadow-3xl">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-lg rounded-2xl border-2 border-gray-200 bg-white/80 focus:ring-4 focus:ring-primary/20 focus:border-primary shadow-lg outline-none transition-all duration-300"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 text-lg rounded-2xl border-2 border-gray-200 bg-white/80 focus:ring-4 focus:ring-primary/20 focus:border-primary shadow-lg outline-none transition-all duration-300"
              >
                <option value="all">All Types</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20 text-center transform transition-all duration-500 hover:shadow-3xl">
              <Bell size={80} className="mx-auto text-gray-300 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No notifications found</h3>
              <p className="text-gray-600 text-lg mb-6">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : "You're all caught up! No new notifications."
                }
              </p>
              {(searchTerm || filterType !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                  }}
                  className="inline-flex items-center space-x-2 px-6 py-3 text-primary hover:text-primary-dark font-semibold transition-all duration-300 group"
                >
                  <Zap size={20} className="group-hover:scale-110 transition-transform duration-300" />
                  <span>Clear filters</span>
                </button>
              )}
            </div>
          ) : (
            filteredNotifications.map((notification, index) => {
              // Ensure notification has a type
              const notificationType = notification.type || 'info';
              
              return (
                <div
                  key={notification._id}
                  onMouseEnter={() => setHoveredNotification(notification._id)}
                  onMouseLeave={() => setHoveredNotification(null)}
                  className={`bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/20 transform transition-all duration-500 ${
                    hoveredNotification === notification._id ? 'scale-105 shadow-3xl -translate-y-1' : ''
                  } ${!notification.isRead ? 'ring-2 ring-primary/20' : ''}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-6">
                    {/* Icon */}
                    <div className={`p-4 rounded-2xl shadow-lg ${getNotificationBg(notificationType)} transform transition-all duration-300 ${
                      hoveredNotification === notification._id ? 'scale-110' : ''
                    }`}>
                      {getNotificationIcon(notificationType)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className={`text-xl font-bold ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <span className="px-2 py-1 bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-semibold rounded-full animate-pulse">
                                NEW
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-lg leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-gray-400 text-sm mt-3 font-medium">
                            {new Date(notification.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-3 ml-4">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="p-3 text-gray-400 hover:text-green-500 bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group"
                              title="Mark as read"
                            >
                              <Check size={18} className="group-hover:scale-110 transition-transform duration-300" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="p-3 text-gray-400 hover:text-red-500 bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group"
                            title="Delete notification"
                          >
                            <Trash2 size={18} className="group-hover:scale-110 transition-transform duration-300" />
                          </button>
                          <div className={`w-6 h-6 border-2 rounded-lg transition-all duration-300 ${
                            selectedNotifications.has(notification._id)
                              ? 'bg-gradient-to-r from-primary to-primary-dark border-transparent'
                              : 'border-gray-300 hover:border-primary'
                          } transform hover:scale-110`}>
                            <input
                              type="checkbox"
                              checked={selectedNotifications.has(notification._id)}
                              onChange={() => toggleSelect(notification._id)}
                              className="opacity-0 absolute w-6 h-6 cursor-pointer"
                            />
                            {selectedNotifications.has(notification._id) && (
                              <Check size={14} className="text-white transform scale-75" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="text-center mt-8">
            <button className="group inline-flex items-center space-x-2 px-8 py-4 text-primary hover:text-primary-dark font-semibold text-lg transition-all duration-300 transform hover:scale-105">
              <Zap size={20} className="group-hover:scale-110 transition-transform duration-300" />
              <span>Load More Notifications</span>
            </button>
          </div>
        )}
      </div>

      {/* Add custom animations */}
      <style jsx>{`
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
        .animate-in {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Notifications;