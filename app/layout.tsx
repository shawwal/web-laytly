import { NavMenu } from '@/components/navigation/nav-menu';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/toaster';
import { getSupabaseToken } from '@/utils/tokenUtils'; // Import reusable token check utility
import './globals.css';
import RecoilContextProvider from '@/app/RecoilContextProvider';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Await the token from the cookies
  const token = await getSupabaseToken(); // Use the async function to get the token

  // Conditionally hide the navbar based on the session token
  const hideNavbar = !token;  // If no token exists, hide the navbar

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <RecoilContextProvider>
            <div className="flex h-screen bg-white dark:bg-gray-900">
              {/* Conditionally render NavMenu based on token existence */}
              {!hideNavbar && <NavMenu />}
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
            <Toaster />
          </RecoilContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
