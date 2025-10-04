import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FinanceProvider } from '@/hooks/use-finances';
import AppSidebar from '@/components/AppSidebar';
import Header from '@/components/Header';
import { SidebarProvider } from '@/components/ui/sidebar';

export const metadata: Metadata = {
  title: 'INR Tracker',
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
      </head>
      <body className={cn('font-body antialiased')}>
        <FinanceProvider>
          <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
              <AppSidebar />
              <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
                <Header />
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
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
