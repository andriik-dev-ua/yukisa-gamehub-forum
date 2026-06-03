import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem('gamehub_theme') === 'dark');
  useEffect(() => {
    document.documentElement.dataset.bsTheme = dark ? 'dark' : 'light';
    document.body.className = dark ? 'app-dark' : 'app-light';
    localStorage.setItem('gamehub_theme', dark ? 'dark' : 'light');
  }, [dark]);
  return <ThemeContext.Provider value={{ dark, toggleTheme: () => setDark((value) => !value) }}>{children}</ThemeContext.Provider>;
}
