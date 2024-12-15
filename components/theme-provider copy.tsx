'use client'
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useEffect, useState, ReactNode } from 'react';
import { ThemeProviderProps } from 'next-themes/dist/types';

interface Props extends ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children, ...props }: Props) {
  const [mounted, setMounted] = useState(false);

  // Ensure the theme is applied after client-side mounting
  useEffect(() => {
    setMounted(true);
    localStorage.removeItem('theme');
  }, []);

  if (!mounted) {
    return <>{children}</>; // Render children without theme during SSR
  }

  return (
    <NextThemesProvider
      {...props}
      enableSystem={true} // Enable system preference if needed
      defaultTheme="dark" // Force dark mode as default
    >
      {children}
    </NextThemesProvider>
  );
}
