import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/toaster'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className='dark'>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex h-screen bg-white dark:bg-gray-900">
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

