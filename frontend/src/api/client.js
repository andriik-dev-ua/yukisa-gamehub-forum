import axios from 'axios';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

// Interceptor automatycznie dołącza JWT do chronionych zapytań REST API.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gamehub_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
