import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FinanceProvider } from '@/hooks/use-finances';
import AppSidebar from '@/components/AppSidebar';
import Header from '@/components/Header';
import { SidebarProvider } from '@/hooks/use-sidebar-provider';
import { Inter } from "next/font/google";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: 'Infinity Cloud',
  description: 'A personal finance dashboard to track your income, expenses, and net worth.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <FinanceProvider>
          <SidebarProvider>
            <div className="relative flex min-h-screen w-full">
              <AppSidebar />
              <div className="flex-1 transition-all duration-300 ease-in-out data-[state=expanded]:sm:ml-64" data-state='expanded'>
                <Header />
                <main className="p-4 sm:px-6 sm:py-4">
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
