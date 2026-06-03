import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../api/client';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('gamehub_token');
    if (!token) return setLoading(false);
    api.get('/auth/me').then(({ data }) => setUser(data.user)).catch(() => localStorage.removeItem('gamehub_token')).finally(() => setLoading(false));
  }, []);

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    localStorage.setItem('gamehub_token', data.token);
    setUser(data.user);
    toast.success('Zalogowano pomyślnie!');
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('gamehub_token', data.token);
    setUser(data.user);
    toast.success('Konto zostało utworzone!');
  };

  const logout = () => {
    localStorage.removeItem('gamehub_token');
    setUser(null);
    toast.info('Wylogowano.');
  };

  return <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}
