import axios from 'axios';

const defaultApiUrl = `${window.location.protocol}//${window.location.hostname}:5000/api`;

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || defaultApiUrl });

// Interceptor automatycznie dołącza JWT do chronionych zapytań REST API.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gamehub_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
