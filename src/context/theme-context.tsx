
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { themes } from '@/lib/themes';

type ThemeName = typeof themes[number]['name'];

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  isThemeChanging: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, rawSetTheme] = useState<ThemeName>('default');
  const [isThemeChanging, setIsThemeChanging] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('colorTheme') as ThemeName;
    if (storedTheme && themes.some(t => t.name === storedTheme)) {
      rawSetTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.body.className = document.body.className.replace(/theme-\S+/g, '');
      document.body.classList.add(`theme-${theme}`);
      localStorage.setItem('colorTheme', theme);
    }
  }, [theme, mounted]);

  const setTheme = (newTheme: ThemeName) => {
    if (newTheme !== theme) {
      setIsThemeChanging(true);
      // Simulate theme application delay
      setTimeout(() => {
        rawSetTheme(newTheme);
        setTimeout(() => {
          setIsThemeChanging(false);
        }, 100);
      }, 300);
    }
  };

  // set dark/light mode
  useEffect(() => {
    const storedThemeMode = localStorage.getItem('theme') || 'system';
    if (
      storedThemeMode === 'dark' ||
      (storedThemeMode === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isThemeChanging }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
