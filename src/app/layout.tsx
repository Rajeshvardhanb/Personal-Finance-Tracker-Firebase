import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FinanceProvider } from '@/hooks/use-finances';
import AppSidebar from '@/components/AppSidebar';
import Header from '@/components/Header';
import { SidebarProvider, useSidebar } from '@/hooks/use-sidebar-provider';
import { Inter } from "next/font/google";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: 'Infinity Cloud',
  description: 'A personal finance dashboard to track your income, expenses, and net worth.',
};

function AppBody({ children }: { children: React.ReactNode }) {
  'use client';
  const { state } = useSidebar();
  return (
    <div className="relative flex min-h-screen w-full flex-col" data-sidebar={state}>
      <Header />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 p-4 transition-all duration-300 ease-in-out data-[sidebar=expanded]:sm:ml-72 sm:px-6 sm:py-4 sm:ml-[78px]">
          {children}
        </main>
      </div>
    </div>
  )
}

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
            <AppBody>
              {children}
            </AppBody>
          </SidebarProvider>
        </FinanceProvider>
        <Toaster />
      </body>
    </html>
  );
}
