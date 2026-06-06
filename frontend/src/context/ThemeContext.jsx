import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const defaultColors = {
  darkGreen: '#6FB381',
  lightGreen: '#6FB381',
  golden: '#6FB381',
  textPrimary: '#000000',
  textSecondary: '#000000',
  bgColor: '#EDEDED',
  bodyBg: '#EDEDED',
};

const applyThemeColors = (colors) => {
  const root = document.documentElement;
  root.style.setProperty('--color-dark-green', colors.darkGreen || defaultColors.darkGreen);
  root.style.setProperty('--color-light-green', colors.lightGreen || defaultColors.lightGreen);
  root.style.setProperty('--color-golden', colors.golden || defaultColors.golden);
  root.style.setProperty('--color-text-primary', colors.textPrimary || defaultColors.textPrimary);
  root.style.setProperty('--color-text-secondary', colors.textSecondary || defaultColors.textSecondary);
  root.style.setProperty('--color-bg', colors.bgColor || defaultColors.bgColor);
  root.style.setProperty('--color-body-bg', colors.bodyBg || defaultColors.bodyBg);
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({ name: 'Default', colors: defaultColors });
  const [loading, setLoading] = useState(true);

  const fetchActiveTheme = async () => {
    try {
      const response = await fetch(`${API_URL}/themes/active`);
      const data = await response.json();
      if (data && data.colors) {
        setTheme(data);
        applyThemeColors(data.colors);
      }
    } catch (error) {
      console.error('Failed to fetch active theme:', error);
      applyThemeColors(defaultColors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveTheme();
  }, []);

  const refreshTheme = fetchActiveTheme;

  return (
    <ThemeContext.Provider value={{ theme, loading, refreshTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
