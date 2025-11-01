'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Check initial theme from DOM after mount
    setTimeout(() => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
      setIsMounted(true);
    }, 0);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        className="opacity-0"
      />
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative overflow-hidden hover:bg-accent"
    >
      {isDark ? (
        <Moon className="h-5 w-5 transition-all duration-300 rotate-0" />
      ) : (
        <Sun className="h-5 w-5 transition-all duration-300 rotate-0" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
