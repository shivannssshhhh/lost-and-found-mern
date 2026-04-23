import axios from 'axios';

// Base URL for API — uses proxy in dev, env var in production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor: Attach JWT token ─────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle 401 globally ─────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth API ──────────────────────────────────────────────────────────────────
export const registerUser = (data) => api.post('/register', data);
export const loginUser    = (data) => api.post('/login', data);

// ── Items API ─────────────────────────────────────────────────────────────────
export const getItems     = (params) => api.get('/items', { params });
export const searchItems  = (name)   => api.get('/items/search', { params: { name } });
export const getItemById  = (id)     => api.get(`/items/${id}`);
export const createItem   = (data)   => api.post('/items', data);
export const updateItem   = (id, data) => api.put(`/items/${id}`, data);
export const deleteItem   = (id)     => api.delete(`/items/${id}`);

export default api;
