'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import { Button } from '../components/ui/button';
import {
  Laptop,
  LucideProps,
  Moon,
  SunMedium,
  Twitter,
  type Icon as LucideIcon,
} from 'lucide-react';

// Add a new prop called fullWidth with a default value of false
export function ThemeToggle({ fullWidth = false }) {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={fullWidth ? 'w-full' : ''} // Apply w-full class if fullWidth is true
    >
      <SunMedium className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
