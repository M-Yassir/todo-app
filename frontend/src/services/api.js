import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Todos API calls
export const todosAPI = {
  getAll: () => api.get('/todos'),
  create: (todo) => api.post('/todos', todo),
  update: (id, updates) => api.put(`/todos/${id}`, updates),
  delete: (id) => api.delete(`/todos/${id}`),
};

export default api;