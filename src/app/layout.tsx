
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FinanceProvider } from '@/hooks/use-finances';
import { SidebarProvider } from '@/hooks/use-sidebar-provider';
import { Inter } from "next/font/google";
import AppBody from '@/components/AppBody';
import { AuthProvider } from '@/hooks/use-auth';
import { FirebaseClientProvider } from '@/firebase';

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: 'PERSONAL FINANCE TRACKER',
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
        <FirebaseClientProvider>
          <AuthProvider>
            <FinanceProvider>
              <SidebarProvider>
                <AppBody>
                  {children}
                </AppBody>
              </SidebarProvider>
            </FinanceProvider>
          </AuthProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
