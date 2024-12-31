import { NavMenu } from '@/components/navigation/nav-menu';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/toaster';
import './globals.css';
import { Metadata } from 'next';

const metaTitle = 'Laytly | Sharing life lately';

export const metadata: Metadata = {
  title: {
    default: metaTitle,
    template: '%s | Laytly App'
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex h-screen bg-white dark:bg-gray-900">
              {/* Conditionally render NavMenu based on token existence */}
              <NavMenu />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
