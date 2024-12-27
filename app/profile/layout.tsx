
import { Metadata } from 'next'
import React from 'react';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'View and edit your profile',
}

export default async function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div>
     {children}
    </div>
  );
}
