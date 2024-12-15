"use client";

import { useState, useEffect, Suspense } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null); // Start with null to avoid SSR mismatch

  useEffect(() => {
    // Retrieve saved theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    } else {
      // Default to 'dark' if no saved theme
      setTheme('dark');
      document.documentElement.classList.add('dark'); // Apply dark theme by default
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.remove(theme!); // Use non-null assertion
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme); // Save the new theme in localStorage
  };

  if (theme === null) return null; // Ensure that no theme is applied until after the client-side rendering

  return (
    <Suspense>
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="flex items-center justify-center p-2 rounded-full hover:bg-foreground/10 transition-colors"
      >
        {theme === 'dark' ? (
          <FaSun className="text-foreground" />
        ) : (
          <FaMoon className="text-foreground" />
        )}
      </button>
    </Suspense>
  );
}
