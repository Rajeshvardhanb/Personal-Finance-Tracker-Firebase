import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FinanceProvider } from '@/hooks/use-finances';
import AppSidebar from '@/components/AppSidebar';
import Header from '@/components/Header';
import { SidebarProvider } from '@/hooks/use-sidebar-provider';

export const metadata: Metadata = {
  title: 'Personal Finance Tracker',
  description: 'A personal finance dashboard to track your income, expenses, and net worth.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap"
          rel="stylesheet"
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={cn('font-body antialiased')}>
        <FinanceProvider>
          <SidebarProvider>
            <div className="relative flex min-h-screen w-full">
              <AppSidebar />
              <div className="flex-1 sm:ml-64">
                <Header />
                <main className="p-4 sm:px-6 sm:py-0">
                  {children}
                </main>
              </div>
            </div>
          </SidebarProvider>
        </FinanceProvider>
        <Toaster />
      </body>
    </html>
  );
}
