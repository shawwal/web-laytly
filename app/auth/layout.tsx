// auth/layout.tsx
import React from 'react';
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Laytly App | Login',
  description: 'Sharing your life lately',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
