import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => API.post('/auth/login', { email, password }).then(res => res.data),
  register: (name, email, password) => API.post('/auth/register', { name, email, password }).then(res => res.data),
  getProfile: () => API.get('/auth/profile').then(res => res.data),
  updateProfile: (userData) => API.put('/auth/profile', userData).then(res => res.data),
   forgotPassword: (email) => API.post('/auth/forgot-password', { email }).then(res => res.data),
  resetPassword: (token, password) => API.post('/auth/reset-password', { token, password }).then(res => res.data),
};

// Transactions API
export const transactionsAPI = {
  getAll: (page = 1, limit = 10) => API.get(`/transactions?page=${page}&limit=${limit}`).then(res => res.data),
  getById: (id) => API.get(`/transactions/${id}`).then(res => res.data),
  create: (transaction) => API.post('/transactions', transaction).then(res => res.data),
  update: (id, transaction) => API.put(`/transactions/${id}`, transaction).then(res => res.data),
  delete: (id) => API.delete(`/transactions/${id}`).then(res => res.data),
  getStats: () => API.get('/transactions/stats').then(res => res.data),
};

// Budgets API
export const budgetsAPI = {
  getAll: () => API.get('/budgets').then(res => res.data),
  set: (budget) => API.post('/budgets', budget).then(res => res.data),
  delete: (id) => API.delete(`/budgets/${id}`).then(res => res.data),
};

export const notificationsAPI = {
  getAll: () => API.get('/notifications').then(res => res.data),
  markAsRead: (id) => API.put(`/notifications/${id}/read`).then(res => res.data),
  markAllAsRead: () => API.put('/notifications/read-all').then(res => res.data),
  delete: (id) => API.delete(`/notifications/${id}`).then(res => res.data),
};

export default API;